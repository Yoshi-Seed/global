/**
 * API Client for Project Tracker
 * GitHub-backed data source via Cloudflare Worker
 */

class ProjectAPI {
  constructor() {
    // Cloudflare Worker エンドポイント
    this.API_BASE = 'https://project-tracker-api.y-honda.workers.dev';

    // キャッシュ（メモリ）
    this.cache = {
      projects: null,
      timestamp: null,
      ttl: 60000, // 1分（Worker側で5分キャッシュしているので、クライアント側は短くてOK）
    };

    // 専門科の略語マッピング
    this.specialtyDictionary = typeof SpecialtyDictionary !== 'undefined'
      ? SpecialtyDictionary
      : null;
  }

  /**
   * プロジェクトデータを取得（GitHub main ブランチのCSV）
   */
  async getAllProjects(forceRefresh = false) {
    // キャッシュチェック
    if (!forceRefresh && this.cache.projects && this.cache.timestamp) {
      const age = Date.now() - this.cache.timestamp;
      if (age < this.cache.ttl) {
        console.log('Using cached data');
        return this.cache.projects;
      }
    }

    try {
      console.log('Fetching data from GitHub via Worker...');
      const response = await fetch(`${this.API_BASE}/data`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      const projects = this.parseCSV(csvText);
      
      // キャッシュ更新
      this.cache.projects = projects;
      this.cache.timestamp = Date.now();
      
      console.log(`Loaded ${projects.length} projects from GitHub`);
      return projects;
      
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      
      // キャッシュがあれば返す（古くても）
      if (this.cache.projects) {
        console.warn('Using stale cache due to fetch error');
        return this.cache.projects;
      }
      
      throw error;
    }
  }

  /**
   * CSVテキストをパース
   */
  parseCSV(csvText) {
    // CRLF (\r\n) と LF (\n) の両方に対応
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return [];
    }

    // ヘッダー行をスキップ
    const dataLines = lines.slice(1);
    
    return dataLines.map((line, index) => {
      const fields = this.parseCSVLine(line.trim());

      // CSVカラム順：id, registrationId, 疾患名, 疾患略語, 手法, 調査種別, 対象者種別, 専門, 実績数, 対象条件, 薬剤, リクルート実施, クライアント, 登録日
      const id = parseInt(fields[0]) || (index + 1);
      const registrationId = fields[1] || '';
      const specialtyName = fields[7] || '';
      const specialtyCode = this.specialtyDictionary
        ? this.specialtyDictionary.deriveCodeFromName(specialtyName)
        : null;
      const registeredDate = fields[13] || '';
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
        targetConditions: fields[9] || '',
        drug: fields[10] || '',
        recruitCompany: fields[11] || '',
        client: fields[12] || '',
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
        (project.client || '').toLowerCase().includes(searchTerm) ||
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
    
    // 最近のプロジェクト（日付でソート、最新5件）
    const projectsWithDate = projects.filter(p => p.createdAt);
    const projectsWithoutDate = projects.filter(p => !p.createdAt);
    
    // 日付があるものを新しい順にソート
    projectsWithDate.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 日付があるもの優先、残りは先頭から
    stats.recentProjects = [...projectsWithDate, ...projectsWithoutDate].slice(0, 5);
    
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
    console.log('Cache cleared');
  }
}

// グローバルインスタンス
const api = new ProjectAPI();
