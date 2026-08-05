/**
 * API Client for Project Tracker
 * Google Sheets-backed data source via Google Apps Script (Web App)
 *
 * Fix: Prevent multiple simultaneous GETs to GAS (which can trigger 429 / Too many requests)
 * by coalescing concurrent fetches into a single in-flight Promise.
 */

class ProjectAPI {
  constructor() {
    // GAS URL（js/config.js で定義）
    this.API_BASE = (typeof API !== 'undefined' && typeof API.getDataUrl === 'function')
      ? API.getDataUrl()
      : '';

    // キャッシュ（メモリ）
    this.cache = {
      projects: null,
      timestamp: null,
      ttl: (typeof GAS_CONFIG !== 'undefined' && GAS_CONFIG.CACHE_TTL_MS)
        ? GAS_CONFIG.CACHE_TTL_MS
        : 60000,
    };

    // 同時リクエスト束ね（in-flight Promise）
    // ※詳細モーダル表示や類似案件読み込み等で短時間に複数回 getAllProjects() が呼ばれても、
    //   実際の fetch は1回に抑える。
    this._projectsFetchPromise = null;
    this.storageKey = 'projectTracker.projects.v2';
    this.lastLoadMeta = { source: 'none', savedAt: null };

    // 前回成功データを先に復元。GASが一時的に不調でも空画面にしない。
    this.restorePersistentCache_();

    // 専門科の略語マッピング
    this.specialtyDictionary = typeof SpecialtyDictionary !== 'undefined'
      ? SpecialtyDictionary
      : null;
  }

  /**
   * プロジェクトデータを取得（Google Sheets → GAS doGet() JSON）
   * - in-flight Promise を使って同時実行を束ね、429発生リスクを低減
   */
  async getAllProjects(forceRefresh = false) {
    // すでに同じ取得が走っているなら、それを待って返す（多重fetch防止）
    if (this._projectsFetchPromise) {
      return this._projectsFetchPromise;
    }

    // キャッシュチェック
    if (!forceRefresh && this.cache.projects && this.cache.timestamp) {
      const age = Date.now() - this.cache.timestamp;
      if (age < this.cache.ttl) {
        console.log('Using cached data');
        return this.cache.projects;
      }
    }

    // ここから先の処理を「in-flight Promise」に束ねる
    this._projectsFetchPromise = (async () => {
      try {
        // GAS URL が未設定のときは、ローカル JSON を読む（デモ/開発用）
        if (!this.API_BASE) {
          console.warn('GAS_CONFIG.URL is not set. Falling back to local data/projects.json');
          const response = await fetch('data/projects.json', { cache: 'no-store' });
          if (!response.ok) {
            throw new Error(`Local fallback HTTP ${response.status}: ${response.statusText}`);
          }
          const raw = await response.json();
          const projects = Array.isArray(raw) ? raw : (raw.projects || []);
          const normalized = projects.map((p, i) => this.normalizeProject_(p, i));

          this.cache.projects = normalized;
          this.cache.timestamp = Date.now();

          console.log(`Loaded ${normalized.length} projects from local fallback`);
          return normalized;
        }

        console.log('Fetching data from Google Sheets via GAS...');
        const raw = await this.fetchJsonWithRetry_(this.API_BASE);
        const projects = Array.isArray(raw) ? raw : (raw.projects || []);
        const normalized = projects.map((p, i) => this.normalizeProject_(p, i));

        // キャッシュ更新
        this.cache.projects = normalized;
        this.cache.timestamp = Date.now();
        this.lastLoadMeta = { source: 'network', savedAt: this.cache.timestamp };
        this.persistCache_(normalized, this.cache.timestamp);
        this.notifyStatus_('online', { count: normalized.length });

        console.log(`Loaded ${normalized.length} projects from Google Sheets`);
        return normalized;

      } catch (error) {
        console.error('Failed to fetch projects:', error);

        // キャッシュがあれば返す（古くても）
        if (this.cache.projects) {
          console.warn('Using stale cache due to fetch error');
          const storedAt = this.lastLoadMeta.savedAt || this.cache.timestamp;
          // 同じ画面表示中に集計処理が何度も再取得を始めないよう、
          // セッション内のキャッシュ時刻だけ更新する。
          this.cache.timestamp = Date.now();
          this.lastLoadMeta = { source: 'stored', savedAt: storedAt };
          this.notifyStatus_('stored', {
            count: this.cache.projects.length,
            savedAt: storedAt,
            message: error.message,
          });
          return this.cache.projects;
        }

        this.notifyStatus_('error', { message: error.message });
        throw error;
      } finally {
        // 重要：in-flight を必ず解除（次回の取得ができなくなるのを防ぐ）
        this._projectsFetchPromise = null;
      }
    })();

    return this._projectsFetchPromise;
  }

  async fetchJsonWithRetry_(url) {
    const timeoutMs = Number(GAS_CONFIG.REQUEST_TIMEOUT_MS) || 12000;
    const maxRetries = Math.max(1, Number(GAS_CONFIG.MAX_RETRIES) || 3);
    const baseDelay = Number(GAS_CONFIG.RETRY_BASE_DELAY_MS) || 900;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.notifyStatus_(attempt === 1 ? 'loading' : 'retrying', {
        attempt,
        maxRetries,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          cache: 'no-store',
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          const message = response.status === 429
            ? 'GASのアクセス上限に達しました（HTTP 429）'
            : `GAS応答エラー（HTTP ${response.status}）`;
          const error = new Error(message);
          error.retryable = response.status === 408 || response.status === 429 || response.status >= 500;
          throw error;
        }

        const raw = await response.json();
        if (raw && raw.success === false) {
          throw new Error(raw.message || 'GASがエラーを返しました');
        }
        return raw;
      } catch (error) {
        lastError = error.name === 'AbortError'
          ? new Error(`GASの応答が${Math.round(timeoutMs / 1000)}秒以内にありませんでした`)
          : error;

        const retryable = error.name === 'AbortError' || error.retryable !== false;
        if (!retryable || attempt === maxRetries) break;

        const delay = baseDelay * (2 ** (attempt - 1)) + Math.floor(Math.random() * 250);
        await new Promise(resolve => setTimeout(resolve, delay));
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw lastError || new Error('GASからデータを取得できませんでした');
  }

  restorePersistentCache_() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed.projects)) return;
      this.cache.projects = parsed.projects;
      const savedAt = Number(parsed.savedAt) || 0;
      // 保存データは即時表示し、最新化は画面側からバックグラウンドで行う。
      this.cache.timestamp = Date.now();
      this.lastLoadMeta = { source: 'stored', savedAt };
    } catch (error) {
      console.warn('Stored project cache could not be restored:', error);
    }
  }

  persistCache_(projects, savedAt) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({ projects, savedAt }));
    } catch (error) {
      console.warn('Project cache could not be persisted:', error);
    }
  }

  notifyStatus_(status, detail = {}) {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
    window.dispatchEvent(new CustomEvent('project-api-status', {
      detail: { status, ...detail },
    }));
  }

  /**
   * GASから返るJSONを、従来の ProjectAPI と同じ形に正規化
   */
  normalizeProject_(raw, index) {
    const p = raw || {};

    const id = Number.parseInt(p.id, 10);
    const safeId = Number.isFinite(id) ? id : (index + 1);

    // inquiryOnly: boolean / 'TRUE'/'FALSE' / 'true'/'false'
    const inquiryOnly = (() => {
      const v = p.inquiryOnly;
      if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
      const s = String(v ?? '').trim().toUpperCase();
      if (s === 'TRUE') return 'TRUE';
      if (s === 'FALSE') return 'FALSE';
      // Apps Script が boolean を返すケース
      if (s === '1' || s === 'YES') return 'TRUE';
      if (s === '0' || s === 'NO') return 'FALSE';
      return 'FALSE';
    })();

    const registeredDate = String(p.registeredDate || p.registered_date || '').trim();
    const createdAt = (() => {
      if (p.createdAt) return String(p.createdAt);
      if (!registeredDate) return null;
      const d = new Date(registeredDate);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    })();

    const specialtyName = String(p.specialty || '').trim();
    const specialtyCode = this.specialtyDictionary
      ? this.specialtyDictionary.deriveCodeFromName(specialtyName)
      : null;

    return {
      id: safeId,
      registrationId: String(p.registrationId || p.registration_id || '').trim(),
      diseaseName: String(p.diseaseName || p.disease_name || '').trim(),
      diseaseAbbr: String(p.diseaseAbbr || p.disease_abbr || '').trim(),
      method: String(p.method || '').trim(),
      surveyType: String(p.surveyType || p.survey_type || '').trim(),
      targetType: String(p.targetType || p.target_type || '').trim(),
      specialty: specialtyName,
      specialtyCode,
      recruitCount: Number.parseInt(p.recruitCount ?? p.recruit_count ?? 0, 10) || 0,
      inquiryOnly,
      targetConditions: String(p.targetConditions || p.target_conditions || '').trim(),
      drug: String(p.drug || '').trim(),
      recruitCompany: String(p.recruitCompany || p.recruit_company || '').trim(),
      moderator: String(p.moderator || '').trim(),
      client: String(p.client || '').trim(),
      endClient: String(p.endClient || p.end_client || '').trim(),
      projectNumber: String(p.projectNumber || p.project_number || '').trim(),
      implementationDate: String(p.implementationDate || p.implementation_date || '').trim(),
      registrant: String(p.registrant || '').trim(),
      registeredDate: registeredDate,
      createdAt,
    };
  }

  /**
   * CSVテキストをパース（引用符内の改行に対応）
   */
  parseCSV(csvText) {
    const text = csvText.trim();
    const rows = [];
    let currentRow = '';
    let inQuotes = false;

    // 文字列を1文字ずつ処理して、引用符内の改行を考慮
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // エスケープされた引用符
          currentRow += '""';
          i++; // 次の文字をスキップ
        } else {
          // 引用符の開始/終了
          inQuotes = !inQuotes;
          currentRow += char;
        }
      } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
        // 引用符外の改行 = 行の区切り
        if (currentRow.trim()) {
          rows.push(currentRow.trim());
        }
        currentRow = '';
        if (char === '\r') i++; // CRLF の場合、\n もスキップ
      } else {
        currentRow += char;
      }
    }

    // 最後の行を追加
    if (currentRow.trim()) {
      rows.push(currentRow.trim());
    }

    if (rows.length < 2) {
      return [];
    }

    // ヘッダー行をスキップ
    const dataRows = rows.slice(1);

    console.log(`📝 CSV parsing: ${rows.length} total rows (including header), ${dataRows.length} data rows`);

    return dataRows.map((row, index) => {
      const fields = this.parseCSVLine(row);

      // CSVカラム順（20列）：id, registrationId, 疾患名, 疾患略語, 手法, 調査種別, 対象者種別, 専門, 実績数, 問合せのみ, 対象条件, 薬剤, リクルート実施, モデレーター, クライアント, エンドクライアント, PJ番号, 実施年月, 登録担当, 登録日
      const id = parseInt(fields[0]) || (index + 1);
      const registrationId = fields[1] || '';
      const specialtyName = fields[7] || '';
      const specialtyCode = this.specialtyDictionary
        ? this.specialtyDictionary.deriveCodeFromName(specialtyName)
        : null;
      const registeredDate = fields[19] || '';
      const createdAt = registeredDate ? new Date(registeredDate).toISOString() : null;

      return {
        id: id,
        registrationId: registrationId,
        diseaseName: fields[2] || '',
        diseaseAbbr: fields[3] || '',
        method: fields[4] || '',
        surveyType: fields[5] || '',
        targetType: fields[6] || '',
        specialty: specialtyName,
        specialtyCode: specialtyCode,
        recruitCount: parseInt(fields[8]) || 0,
        inquiryOnly: fields[9] || 'FALSE',
        targetConditions: fields[10] || '',
        drug: fields[11] || '',
        recruitCompany: fields[12] || '',
        moderator: fields[13] || '',
        client: fields[14] || '',
        endClient: fields[15] || '',
        projectNumber: fields[16] || '',
        implementationDate: fields[17] || '',
        registrant: fields[18] || '',
        registeredDate: registeredDate, // 登録日（YYYY-MM-DD）
        createdAt: createdAt, // ISO形式に変換
      };
    }).filter(project => project.diseaseName); // 空行を除外
  }

  /**
   * CSV行をパース（引用符対応）
   */
  parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // エスケープされた引用符
          current += '"';
          i++; // 次の文字をスキップ
        } else {
          // 引用符の開始/終了
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // フィールド区切り（引用符なしのフィールドはトリム）
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // 最後のフィールドを追加（引用符なしのフィールドはトリム）
    fields.push(current.trim());

    return fields;
  }

  /**
   * プロジェクトIDで検索
   */
  async getProjectById(id) {
    const projects = await this.getAllProjects();
    return projects.find(p => p.id === parseInt(id));
  }

  /**
   * フリーワード検索
   */
  async searchProjects(query) {
    const projects = await this.getAllProjects();

    if (!query || query.trim() === '') {
      return projects;
    }

    const searchTerm = query.toLowerCase();

    return projects.filter(project => {
      const specialtyMatch = this.matchesSpecialty(project, query, {
        searchTerm,
      });

      return (
        (project.diseaseName || '').toLowerCase().includes(searchTerm) ||
        (project.diseaseAbbr || '').toLowerCase().includes(searchTerm) ||
        (project.method || '').toLowerCase().includes(searchTerm) ||
        (project.surveyType || '').toLowerCase().includes(searchTerm) ||
        (project.targetType || '').toLowerCase().includes(searchTerm) ||
        specialtyMatch ||
        (project.targetConditions || '').toLowerCase().includes(searchTerm) ||
        (project.drug || '').toLowerCase().includes(searchTerm) ||
        (project.recruitCompany || '').toLowerCase().includes(searchTerm) ||
        (project.moderator || '').toLowerCase().includes(searchTerm) ||
        (project.client || '').toLowerCase().includes(searchTerm) ||
        (project.endClient || '').toLowerCase().includes(searchTerm) ||
        (project.projectNumber || '').toLowerCase().includes(searchTerm) ||
        (project.implementationDate || '').toLowerCase().includes(searchTerm) ||
        (project.registrant || '').toLowerCase().includes(searchTerm) ||
        (project.projectId && project.projectId.toLowerCase().includes(searchTerm))
      );
    });
  }

  /**
   * 専門科のフィルタ一致判定
   */
  matchesSpecialty(project, term, options = {}) {
    if (!term || !term.trim()) {
      return true;
    }

    if (this.specialtyDictionary) {
      return this.specialtyDictionary.matchesProject(project, term);
    }

    const specialty = (project.specialty || '').toLowerCase();
    const specialtyCode = (project.specialtyCode || '').toLowerCase();
    const normalizedTerm = (options.searchTerm || term).trim().toLowerCase();

    if (specialty && specialty.includes(normalizedTerm)) {
      return true;
    }

    if (specialtyCode && specialtyCode.includes(normalizedTerm)) {
      return true;
    }

    return false;
  }

  /**
   * フィルター適用
   */
  async filterProjects(filters) {
    let projects = await this.getAllProjects();

    // 疾患名フィルター
    if (filters.diseaseName && filters.diseaseName !== 'all') {
      projects = projects.filter(p => p.diseaseName === filters.diseaseName);
    }

    // 手法フィルター
    if (filters.method && filters.method !== 'all') {
      projects = projects.filter(p => p.method === filters.method);
    }

    // 調査種別フィルター
    if (filters.surveyType && filters.surveyType !== 'all') {
      projects = projects.filter(p => p.surveyType === filters.surveyType);
    }

    // 対象者種別フィルター
    if (filters.targetType && filters.targetType !== 'all') {
      projects = projects.filter(p => p.targetType === filters.targetType);
    }

    return projects;
  }

  /**
   * 統計情報を取得（database.js互換）
   */
  async getStats() {
    const projects = await this.getAllProjects();

    const stats = {
      totalProjects: projects.length,
      totalRecruits: 0,
      averageRecruits: 0,
      targetTypeDistribution: {},
      diseaseDistribution: {},
      methodDistribution: {},
      surveyTypeDistribution: {},
      specialtyDistribution: {},
      clientDistribution: {},
      monthlyTrend: {},
      recentProjects: [],
    };

    projects.forEach(project => {
      // 総実績数
      stats.totalRecruits += project.recruitCount;

      // 対象者種別カウント
      if (project.targetType) {
        stats.targetTypeDistribution[project.targetType] =
          (stats.targetTypeDistribution[project.targetType] || 0) + 1;
      }

      // 疾患別カウント
      if (project.diseaseName) {
        stats.diseaseDistribution[project.diseaseName] =
          (stats.diseaseDistribution[project.diseaseName] || 0) + 1;
      }

      // 手法別カウント
      if (project.method) {
        stats.methodDistribution[project.method] =
          (stats.methodDistribution[project.method] || 0) + 1;
      }

      // 調査種別カウント
      if (project.surveyType) {
        stats.surveyTypeDistribution[project.surveyType] =
          (stats.surveyTypeDistribution[project.surveyType] || 0) + 1;
      }

      // 専門科カウント
      if (project.specialty) {
        stats.specialtyDistribution[project.specialty] =
          (stats.specialtyDistribution[project.specialty] || 0) + 1;
      }

      // クライアントカウント
      if (project.client) {
        stats.clientDistribution[project.client] =
          (stats.clientDistribution[project.client] || 0) + 1;
      }

      // 月次トレンド
      const registeredDate = project.createdAt || project.registeredDate;
      if (registeredDate) {
        const date = new Date(registeredDate);
        if (!Number.isNaN(date.getTime())) {
          const month = date.toISOString().substring(0, 7);
          stats.monthlyTrend[month] = (stats.monthlyTrend[month] || 0) + 1;
        }
      }
    });

    // 平均実績数
    stats.averageRecruits = stats.totalProjects > 0
      ? Math.round(stats.totalRecruits / stats.totalProjects)
      : 0;

    // 最近のプロジェクト（登録番号でソート、最新5件）
    const projectsWithRegId = projects.filter(p => p.registrationId);
    const projectsWithoutRegId = projects.filter(p => !p.registrationId);

    // 登録番号があるものを新しい順にソート（YYYYMMDD-XXXX形式）
    projectsWithRegId.sort((a, b) => {
      // registrationId を比較（文字列として降順）
      return b.registrationId.localeCompare(a.registrationId);
    });

    // 登録番号があるもの優先、残りは先頭から
    stats.recentProjects = [...projectsWithRegId, ...projectsWithoutRegId].slice(0, 5);

    return stats;
  }

  /**
   * ユニークな値のリストを取得（フィルター用）
   */
  async getUniqueValues(field) {
    const projects = await this.getAllProjects();
    const values = [...new Set(projects.map(p => p[field]).filter(v => v))];
    return values.sort();
  }

  /**
   * 類似案件を検索
   */
  async findSimilarProjects(projectId, limit = 5) {
    const projects = await this.getAllProjects();
    const targetProject = projects.find(p => p.id === parseInt(projectId));

    if (!targetProject) {
      return [];
    }

    // 類似度を計算
    const scoredProjects = projects
      .filter(p => p.id !== targetProject.id)
      .map(project => {
        let score = 0;

        // 疾患名が同じ
        if (project.diseaseName === targetProject.diseaseName) {
          score += 50;
        }

        // 対象者種別が同じ
        if (project.targetType === targetProject.targetType) {
          score += 20;
        }

        // 手法が同じ
        if (project.method === targetProject.method) {
          score += 15;
        }

        // 調査種別が同じ
        if (project.surveyType === targetProject.surveyType) {
          score += 10;
        }

        // 専門科が同じ
        if (project.specialty && targetProject.specialty &&
            project.specialty === targetProject.specialty) {
          score += 5;
        }

        return {
          ...project,
          similarityScore: score
        };
      })
      .filter(p => p.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return scoredProjects;
  }

  /**
   * キャッシュをクリア（強制リフレッシュ用）
   */
  clearCache() {
    this.cache.projects = null;
    this.cache.timestamp = null;
    this._projectsFetchPromise = null;
    console.log('Cache cleared');
  }
}

// グローバルインスタンス
const api = new ProjectAPI();
