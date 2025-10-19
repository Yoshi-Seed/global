/**
 * プロジェクト履歴管理システム - データベース管理モジュール
 * JSONファイルベースのローカルストレージシステム
 */

class ProjectDatabase {
  constructor() {
    this.storageKey = 'project_tracker_data';
    this.initialized = false;
  }

  /**
   * データベース初期化
   */
  async init() {
    try {
      // ローカルストレージからデータを読み込み
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        // 初回起動時はサンプルデータで初期化
        await this.initializeSampleData();
      }
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      return false;
    }
  }

  /**
   * サンプルデータで初期化
   */
  async initializeSampleData() {
    const sampleData = {
      projects: [
        {
          id: this.generateId(),
          projectId: 'PRJ-2025-001',
          targetType: '医師',
          diseaseTheme: '糖尿病治療における新規薬剤の使用実態',
          recruitCount: 50,
          screeningConditions: {
            specialty: '内科・糖尿病内科',
            experience: '5年以上',
            patientCount: '月20名以上の糖尿病患者を診察',
            region: '関東圏'
          },
          freeComment: '特に2型糖尿病の治療経験が豊富な医師を優先してリクルート',
          createdAt: new Date('2025-01-15').toISOString(),
          updatedAt: new Date('2025-01-15').toISOString(),
          createdBy: 'admin'
        },
        {
          id: this.generateId(),
          projectId: 'PRJ-2025-002',
          targetType: '患者',
          diseaseTheme: '乳がん患者のQOL調査',
          recruitCount: 100,
          screeningConditions: {
            age: '40-65歳',
            diagnosis: '乳がんステージI-III',
            treatment: '手術後6ヶ月以内',
            status: '外来通院中'
          },
          freeComment: 'ホルモン療法を受けている患者を中心にリクルート。心理的サポートが必要な場合あり',
          createdAt: new Date('2025-02-10').toISOString(),
          updatedAt: new Date('2025-02-10').toISOString(),
          createdBy: 'user01'
        },
        {
          id: this.generateId(),
          projectId: 'PRJ-2025-003',
          targetType: '医師・患者',
          diseaseTheme: 'アトピー性皮膚炎の治療満足度調査',
          recruitCount: 80,
          screeningConditions: {
            doctorSpecialty: '皮膚科',
            doctorExperience: '3年以上',
            patientAge: '18-50歳',
            patientSeverity: '中等症以上',
            matchRequired: '同一医療機関での医師・患者ペア'
          },
          freeComment: '医師30名と患者50名をリクルート。可能な限り同じ医療機関でペアを作成',
          createdAt: new Date('2025-03-05').toISOString(),
          updatedAt: new Date('2025-03-05').toISOString(),
          createdBy: 'user02'
        }
      ],
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    };

    localStorage.setItem(this.storageKey, JSON.stringify(sampleData));
    return sampleData;
  }

  /**
   * 全プロジェクトを取得
   */
  getAllProjects() {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{"projects":[]}');
      return data.projects || [];
    } catch (error) {
      console.error('Failed to get projects:', error);
      return [];
    }
  }

  /**
   * プロジェクトIDで検索
   */
  getProjectById(id) {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id);
  }

  /**
   * プロジェクトIDで検索（Project ID文字列）
   */
  getProjectByProjectId(projectId) {
    const projects = this.getAllProjects();
    return projects.find(p => p.projectId === projectId);
  }

  /**
   * 新規プロジェクト作成
   */
  createProject(projectData) {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{"projects":[]}');
      
      const newProject = {
        id: this.generateId(),
        projectId: projectData.projectId,
        targetType: projectData.targetType,
        diseaseTheme: projectData.diseaseTheme,
        recruitCount: parseInt(projectData.recruitCount),
        screeningConditions: projectData.screeningConditions,
        freeComment: projectData.freeComment || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: projectData.createdBy || 'anonymous'
      };

      data.projects.push(newProject);
      data.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Failed to create project:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * プロジェクト更新
   */
  updateProject(id, updates) {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{"projects":[]}');
      const index = data.projects.findIndex(p => p.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Project not found' };
      }

      data.projects[index] = {
        ...data.projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      data.lastUpdated = new Date().toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return { success: true, project: data.projects[index] };
    } catch (error) {
      console.error('Failed to update project:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * プロジェクト削除
   */
  deleteProject(id) {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{"projects":[]}');
      const index = data.projects.findIndex(p => p.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Project not found' };
      }

      data.projects.splice(index, 1);
      data.lastUpdated = new Date().toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete project:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 検索機能
   */
  searchProjects(query) {
    const projects = this.getAllProjects();
    const lowerQuery = query.toLowerCase();

    return projects.filter(p => {
      return (
        p.projectId.toLowerCase().includes(lowerQuery) ||
        p.diseaseTheme.toLowerCase().includes(lowerQuery) ||
        p.targetType.toLowerCase().includes(lowerQuery) ||
        p.freeComment.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(p.screeningConditions).toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * フィルター機能
   */
  filterProjects(filters) {
    let projects = this.getAllProjects();

    if (filters.targetType && filters.targetType !== 'all') {
      projects = projects.filter(p => p.targetType === filters.targetType);
    }

    if (filters.diseaseTheme) {
      projects = projects.filter(p => 
        p.diseaseTheme.toLowerCase().includes(filters.diseaseTheme.toLowerCase())
      );
    }

    if (filters.minRecruitCount) {
      projects = projects.filter(p => p.recruitCount >= parseInt(filters.minRecruitCount));
    }

    if (filters.maxRecruitCount) {
      projects = projects.filter(p => p.recruitCount <= parseInt(filters.maxRecruitCount));
    }

    if (filters.dateFrom) {
      projects = projects.filter(p => new Date(p.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      projects = projects.filter(p => new Date(p.createdAt) <= new Date(filters.dateTo));
    }

    return projects;
  }

  /**
   * 類似案件検索（TF-IDF風の簡易実装）
   */
  findSimilarProjects(projectId, limit = 5) {
    const target = this.getProjectByProjectId(projectId) || this.getProjectById(projectId);
    if (!target) return [];

    const allProjects = this.getAllProjects().filter(p => p.id !== target.id);

    // 類似度スコア計算
    const scoredProjects = allProjects.map(p => {
      let score = 0;

      // 対象者タイプが同じ
      if (p.targetType === target.targetType) score += 30;

      // 疾患・テーマの類似度（単語の一致）
      const targetWords = this.tokenize(target.diseaseTheme);
      const projectWords = this.tokenize(p.diseaseTheme);
      const commonWords = targetWords.filter(w => projectWords.includes(w));
      score += commonWords.length * 20;

      // リクルート人数の近さ
      const recruitDiff = Math.abs(p.recruitCount - target.recruitCount);
      if (recruitDiff < 20) score += 15;
      else if (recruitDiff < 50) score += 10;

      // スクリーニング条件の類似度
      const targetConditions = JSON.stringify(target.screeningConditions).toLowerCase();
      const projectConditions = JSON.stringify(p.screeningConditions).toLowerCase();
      const conditionWords = this.tokenize(targetConditions);
      const matchingConditions = conditionWords.filter(w => projectConditions.includes(w));
      score += matchingConditions.length * 5;

      return { project: p, score };
    });

    // スコアでソートして上位を返す
    return scoredProjects
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(item => item.score > 0)
      .map(item => ({ ...item.project, similarityScore: item.score }));
  }

  /**
   * 統計情報取得
   */
  getStatistics() {
    const projects = this.getAllProjects();

    const stats = {
      totalProjects: projects.length,
      targetTypeDistribution: {},
      totalRecruits: 0,
      averageRecruits: 0,
      diseaseThemes: {},
      recentProjects: projects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
      monthlyTrend: this.getMonthlyTrend(projects)
    };

    // 対象者タイプ別集計
    projects.forEach(p => {
      stats.targetTypeDistribution[p.targetType] = 
        (stats.targetTypeDistribution[p.targetType] || 0) + 1;
      
      stats.totalRecruits += p.recruitCount;

      // 疾患テーマ集計（簡易）
      const theme = p.diseaseTheme.substring(0, 20); // 最初の20文字で分類
      stats.diseaseThemes[theme] = (stats.diseaseThemes[theme] || 0) + 1;
    });

    stats.averageRecruits = projects.length > 0 
      ? Math.round(stats.totalRecruits / projects.length) 
      : 0;

    return stats;
  }

  /**
   * 月次トレンド取得
   */
  getMonthlyTrend(projects) {
    const trend = {};
    projects.forEach(p => {
      const month = new Date(p.createdAt).toISOString().substring(0, 7); // YYYY-MM
      trend[month] = (trend[month] || 0) + 1;
    });
    return trend;
  }

  /**
   * データエクスポート（JSON）
   */
  exportToJSON() {
    const data = localStorage.getItem(this.storageKey);
    return data;
  }

  /**
   * データインポート
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error('Invalid data format');
      }
      localStorage.setItem(this.storageKey, jsonString);
      return { success: true };
    } catch (error) {
      console.error('Failed to import data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * CSVエクスポート
   */
  exportToCSV() {
    const projects = this.getAllProjects();
    
    const headers = [
      'Project ID',
      'Target Type',
      'Disease/Theme',
      'Recruit Count',
      'Screening Conditions',
      'Free Comment',
      'Created At',
      'Created By'
    ];

    const rows = projects.map(p => [
      p.projectId,
      p.targetType,
      p.diseaseTheme,
      p.recruitCount,
      JSON.stringify(p.screeningConditions),
      p.freeComment,
      new Date(p.createdAt).toLocaleString('ja-JP'),
      p.createdBy
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * ユーティリティ：ID生成
   */
  generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * ユーティリティ：テキストをトークン化
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  /**
   * データベースクリア（開発用）
   */
  clearDatabase() {
    localStorage.removeItem(this.storageKey);
    return { success: true };
  }
}

// グローバルインスタンスを作成
const db = new ProjectDatabase();
