/**
 * プロジェクト履歴管理システム - データベース管理モジュール (Seed Planning版)
 * JSONファイルベースのローカルストレージシステム
 * 実際のSeed Planningデータ構造に対応
 */

class ProjectDatabase {
  constructor() {
    this.storageKey = 'project_tracker_data_v2';
    this.initialized = false;
    
    // 専門科の略語マッピング
    this.specialtyAbbreviations = {
      'BAS': '肥満症専門医',
      'CARD': '循環器科',
      'DERM': '皮膚科',
      'Endos': '内分泌科',
      'Gastro': '消化器科',
      'GI Surgeon': '消化器外科',
      'GYN': '産婦人科医',
      'HEM': '血液科・血液内科',
      'HEPA': '肝臓専門医',
      'IM': '内科（専門医）',
      'NEPH': '腎臓内科医',
      'NEURO': '神経内科',
      'ONC': '腫瘍内科',
      'Opht': '眼科',
      'ORTHO': '整形外科医',
      'PATH': '病理学医',
      'PULMs': '呼吸器科',
      'Psych': '精神科',
      'Rheum': 'リウマチ科',
      'URO': '泌尿器科'
    };
    
    // 逆マッピング（日本語→略語）
    this.specialtyReverse = {};
    Object.entries(this.specialtyAbbreviations).forEach(([abbr, full]) => {
      this.specialtyReverse[full.toLowerCase()] = abbr.toLowerCase();
    });
  }

  /**
   * データベース初期化
   */
  async init() {
    try {
      // ローカルストレージからデータを読み込み
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        // 初回起動時は空データで初期化
        await this.initializeEmptyData();
      }
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      return false;
    }
  }

  /**
   * 空データで初期化
   */
  async initializeEmptyData() {
    const emptyData = {
      projects: [],
      lastUpdated: new Date().toISOString(),
      version: '2.0.0'
    };
    localStorage.setItem(this.storageKey, JSON.stringify(emptyData));
    return emptyData;
  }

  /**
   * CSVデータをインポート
   */
  async importFromCSV(csvText) {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      
      const projects = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        
        if (values.length < headers.length) continue;
        
        const project = {
          id: this.generateId(),
          projectId: '', // 任意項目
          diseaseName: values[0] || '', // 疾患名
          diseaseAbbr: values[1] || '', // 疾患略語
          method: values[2] || '', // 手法
          surveyType: values[3] || '', // 調査種別
          targetType: values[4] || '', // 対象者種別
          specialty: values[5] || '', // 専門
          recruitCount: parseInt(values[6]) || 0, // 実績数
          targetConditions: values[7] || '', // 対象条件
          drug: values[8] || '', // 薬剤
          recruitCompany: values[9] || '', // リクルート実施
          client: values[10] || '', // クライアント
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'import'
        };
        
        projects.push(project);
      }
      
      const data = {
        projects: projects,
        lastUpdated: new Date().toISOString(),
        version: '2.0.0'
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return { success: true, count: projects.length };
    } catch (error) {
      console.error('CSV import failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * CSV行をパース（カンマを含むフィールドに対応）
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
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
   * 新規プロジェクト作成
   */
  createProject(projectData) {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey) || '{"projects":[]}');
      
      const newProject = {
        id: this.generateId(),
        projectId: projectData.projectId || '', // 任意
        diseaseName: projectData.diseaseName,
        diseaseAbbr: projectData.diseaseAbbr || '',
        method: projectData.method || '',
        surveyType: projectData.surveyType || '',
        targetType: projectData.targetType,
        specialty: projectData.specialty || '',
        recruitCount: parseInt(projectData.recruitCount),
        targetConditions: projectData.targetConditions || '',
        drug: projectData.drug || '',
        recruitCompany: projectData.recruitCompany || '',
        client: projectData.client || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: projectData.createdBy || 'user'
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
   * 専門科の略語を展開する
   */
  expandSpecialtyAbbreviation(query) {
    const upperQuery = query.toUpperCase();
    const lowerQuery = query.toLowerCase();
    
    // 略語から正式名称
    if (this.specialtyAbbreviations[upperQuery]) {
      return this.specialtyAbbreviations[upperQuery].toLowerCase();
    }
    
    // 大文字小文字混在の略語チェック
    for (const [abbr, full] of Object.entries(this.specialtyAbbreviations)) {
      if (abbr.toLowerCase() === lowerQuery) {
        return full.toLowerCase();
      }
    }
    
    return null;
  }

  /**
   * 検索機能（全フィールド対象の包括的検索）
   * フリーワード検索で全てのデータ項目から部分一致で検索
   */
  searchProjects(query) {
    const projects = this.getAllProjects();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return projects;
    
    // 専門科略語の展開
    const expandedSpecialty = this.expandSpecialtyAbbreviation(query);

    return projects.filter(p => {
      // 1. 疾患名
      if (p.diseaseName && p.diseaseName.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 2. 疾患略語
      if (p.diseaseAbbr && p.diseaseAbbr.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 3. 手法
      if (p.method && p.method.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 4. 調査種別
      if (p.surveyType && p.surveyType.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 5. 対象者タイプ
      if (p.targetType && p.targetType.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 6. 専門科（略語対応）
      if (p.specialty) {
        const specialtyLower = p.specialty.toLowerCase();
        // 直接検索
        if (specialtyLower.includes(lowerQuery)) {
          return true;
        }
        // 略語展開後の検索
        if (expandedSpecialty && specialtyLower.includes(expandedSpecialty)) {
          return true;
        }
      }
      
      // 7. 対象条件
      if (p.targetConditions && p.targetConditions.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 8. 薬剤
      if (p.drug && p.drug.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 9. リクルート実施企業
      if (p.recruitCompany && p.recruitCompany.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 10. クライアント名
      if (p.client && p.client.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // 11. プロジェクトID（任意項目）
      if (p.projectId && p.projectId.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * フィルター機能（専門科略語対応）
   * 引数でプロジェクトリストを受け取り、そのリストに対してフィルターを適用
   */
  filterProjects(filters, projects = null) {
    let projectsList = projects || this.getAllProjects();

    if (filters.targetType && filters.targetType !== 'all') {
      projectsList = projectsList.filter(p => p.targetType === filters.targetType);
    }

    if (filters.diseaseName) {
      const lowerDisease = filters.diseaseName.toLowerCase();
      projectsList = projectsList.filter(p => 
        (p.diseaseName && p.diseaseName.toLowerCase().includes(lowerDisease)) ||
        (p.diseaseAbbr && p.diseaseAbbr.toLowerCase().includes(lowerDisease))
      );
    }

    if (filters.specialty) {
      const expandedSpecialty = this.expandSpecialtyAbbreviation(filters.specialty);
      const lowerSpecialty = filters.specialty.toLowerCase();
      
      projectsList = projectsList.filter(p => {
        if (!p.specialty) return false;
        const specialtyLower = p.specialty.toLowerCase();
        
        // 直接マッチ
        if (specialtyLower.includes(lowerSpecialty)) return true;
        
        // 略語展開後のマッチ
        if (expandedSpecialty && specialtyLower.includes(expandedSpecialty)) return true;
        
        return false;
      });
    }

    if (filters.client) {
      projectsList = projectsList.filter(p => 
        p.client && p.client.toLowerCase().includes(filters.client.toLowerCase())
      );
    }

    if (filters.minRecruitCount) {
      projectsList = projectsList.filter(p => p.recruitCount >= parseInt(filters.minRecruitCount));
    }

    if (filters.maxRecruitCount) {
      projectsList = projectsList.filter(p => p.recruitCount <= parseInt(filters.maxRecruitCount));
    }

    if (filters.dateFrom) {
      projectsList = projectsList.filter(p => new Date(p.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      projectsList = projectsList.filter(p => new Date(p.createdAt) <= new Date(filters.dateTo));
    }

    return projectsList;
  }

  /**
   * 類似案件検索（改良版）
   */
  findSimilarProjects(projectId, limit = 5) {
    const target = this.getProjectById(projectId);
    if (!target) return [];

    const allProjects = this.getAllProjects().filter(p => p.id !== target.id);

    // 類似度スコア計算
    const scoredProjects = allProjects.map(p => {
      let score = 0;

      // 疾患名の完全一致
      if (p.diseaseName === target.diseaseName) score += 50;
      
      // 疾患略語の完全一致
      if (p.diseaseAbbr && target.diseaseAbbr && p.diseaseAbbr === target.diseaseAbbr) score += 40;

      // 対象者タイプが同じ
      if (p.targetType === target.targetType) score += 30;

      // 専門が同じ
      if (p.specialty && target.specialty && p.specialty === target.specialty) score += 25;

      // 疾患名の部分一致
      if (p.diseaseName !== target.diseaseName) {
        const targetWords = this.tokenize(target.diseaseName);
        const projectWords = this.tokenize(p.diseaseName);
        const commonWords = targetWords.filter(w => projectWords.includes(w));
        score += commonWords.length * 10;
      }

      // リクルート人数の近さ
      const recruitDiff = Math.abs(p.recruitCount - target.recruitCount);
      if (recruitDiff < 5) score += 15;
      else if (recruitDiff < 10) score += 10;
      else if (recruitDiff < 20) score += 5;

      // 対象条件の類似度
      if (target.targetConditions && p.targetConditions) {
        const targetConditions = target.targetConditions.toLowerCase();
        const projectConditions = p.targetConditions.toLowerCase();
        const conditionWords = this.tokenize(targetConditions);
        const matchingConditions = conditionWords.filter(w => projectConditions.includes(w));
        score += matchingConditions.length * 3;
      }

      // 薬剤の類似度
      if (target.drug && p.drug) {
        const targetDrugs = this.tokenize(target.drug);
        const projectDrugs = this.tokenize(p.drug);
        const commonDrugs = targetDrugs.filter(d => projectDrugs.includes(d));
        score += commonDrugs.length * 8;
      }

      // クライアントが同じ
      if (p.client && target.client && p.client === target.client) score += 20;

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
      diseaseDistribution: {},
      specialtyDistribution: {},
      clientDistribution: {},
      recentProjects: projects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
      monthlyTrend: this.getMonthlyTrend(projects)
    };

    // 各種集計
    projects.forEach(p => {
      // 対象者タイプ別
      stats.targetTypeDistribution[p.targetType] = 
        (stats.targetTypeDistribution[p.targetType] || 0) + 1;
      
      stats.totalRecruits += p.recruitCount;

      // 疾患名集計
      if (p.diseaseName) {
        const key = p.diseaseName.substring(0, 30);
        stats.diseaseDistribution[key] = (stats.diseaseDistribution[key] || 0) + 1;
      }

      // 専門別集計
      if (p.specialty) {
        stats.specialtyDistribution[p.specialty] = 
          (stats.specialtyDistribution[p.specialty] || 0) + 1;
      }

      // クライアント別集計
      if (p.client) {
        stats.clientDistribution[p.client] = 
          (stats.clientDistribution[p.client] || 0) + 1;
      }
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
      const month = new Date(p.createdAt).toISOString().substring(0, 7);
      trend[month] = (trend[month] || 0) + 1;
    });
    return trend;
  }

  /**
   * CSVエクスポート
   */
  exportToCSV() {
    const projects = this.getAllProjects();
    
    const headers = [
      '疾患名',
      '疾患略語',
      '手法',
      '調査種別',
      '対象者種別',
      '専門',
      '実績数',
      '対象条件',
      '薬剤',
      'リクルート実施',
      'クライアント',
      'Project ID',
      '登録日',
      '登録者'
    ];

    const rows = projects.map(p => [
      p.diseaseName,
      p.diseaseAbbr,
      p.method,
      p.surveyType,
      p.targetType,
      p.specialty,
      p.recruitCount,
      p.targetConditions,
      p.drug,
      p.recruitCompany,
      p.client,
      p.projectId || '',
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
   * データエクスポート（JSON）
   */
  exportToJSON() {
    const data = localStorage.getItem(this.storageKey);
    return data;
  }

  /**
   * データインポート（JSON）
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
   * ユーティリティ：ID生成
   */
  generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * ユーティリティ：テキストをトークン化
   */
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\sぁ-んァ-ヶー一-龠]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  /**
   * データベースクリア
   */
  clearDatabase() {
    localStorage.removeItem(this.storageKey);
    return { success: true };
  }
}

// グローバルインスタンスを作成
const db = new ProjectDatabase();
