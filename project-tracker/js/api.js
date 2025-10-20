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
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return [];
    }

    // ヘッダー行をスキップ
    const dataLines = lines.slice(1);
    
    return dataLines.map((line, index) => {
      const fields = this.parseCSVLine(line);
      
      return {
        id: index + 1,
        diseaseName: fields[0] || '',
        diseaseAbbr: fields[1] || '',
        method: fields[2] || '',
        surveyType: fields[3] || '',
        targetType: fields[4] || '',
        specialty: fields[5] || '',
        recruitCount: parseInt(fields[6]) || 0,
        targetConditions: fields[7] || '',
        drug: fields[8] || '',
        recruitCompany: fields[9] || '',
        client: fields[10] || '',
        projectId: fields[11] || '', // 追加フィールド（もしあれば）
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
        // フィールド区切り
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // 最後のフィールドを追加
    fields.push(current);
    
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
      return (
        project.diseaseName.toLowerCase().includes(searchTerm) ||
        project.diseaseAbbr.toLowerCase().includes(searchTerm) ||
        project.method.toLowerCase().includes(searchTerm) ||
        project.surveyType.toLowerCase().includes(searchTerm) ||
        project.targetType.toLowerCase().includes(searchTerm) ||
        project.specialty.toLowerCase().includes(searchTerm) ||
        project.targetConditions.toLowerCase().includes(searchTerm) ||
        project.drug.toLowerCase().includes(searchTerm) ||
        project.recruitCompany.toLowerCase().includes(searchTerm) ||
        project.client.toLowerCase().includes(searchTerm) ||
        (project.projectId && project.projectId.toLowerCase().includes(searchTerm))
      );
    });
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
    });
    
    // 平均実績数
    stats.averageRecruits = stats.totalProjects > 0 
      ? Math.round(stats.totalRecruits / stats.totalProjects) 
      : 0;
    
    // 最近のプロジェクト（最新10件）
    stats.recentProjects = projects.slice(0, 10);
    
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
