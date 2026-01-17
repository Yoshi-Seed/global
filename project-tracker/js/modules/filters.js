/**
 * Project Tracker - フィルタリングモジュール
 * 
 * 案件のフィルタリング機能を管理
 */

class ProjectFilters {
  constructor() {
    this.filters = {
      disease: '',
      targetType: '',
      specialty: '',
      client: '',
      recruitMin: null,
      recruitMax: null,
      inquiryOnly: false,
      startDate: null,
      endDate: null,
      freeText: ''
    };
    
    this.callbacks = {
      onFilterChange: null,
      onReset: null
    };
  }

  /**
   * フィルタの初期化
   */
  initialize(config = {}) {
    this.callbacks = config;
    this.loadFromURL();
    this.attachEventListeners();
  }

  /**
   * URLパラメータからフィルタを読み込み
   */
  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    this.filters.disease = params.get('disease') || '';
    this.filters.targetType = params.get('targetType') || '';
    this.filters.specialty = params.get('specialty') || '';
    this.filters.client = params.get('client') || '';
    this.filters.recruitMin = params.get('recruitMin') ? parseInt(params.get('recruitMin')) : null;
    this.filters.recruitMax = params.get('recruitMax') ? parseInt(params.get('recruitMax')) : null;
    this.filters.inquiryOnly = params.get('inquiryOnly') === 'true';
    this.filters.startDate = params.get('startDate') || null;
    this.filters.endDate = params.get('endDate') || null;
    this.filters.freeText = params.get('q') || '';
    
    this.updateUI();
  }

  /**
   * UIを現在のフィルタ状態に更新
   */
  updateUI() {
    // 疾患名
    const diseaseInput = document.getElementById('diseaseFilter');
    if (diseaseInput) diseaseInput.value = this.filters.disease;
    
    // 対象者種別
    const targetTypeSelect = document.getElementById('targetTypeFilter');
    if (targetTypeSelect) targetTypeSelect.value = this.filters.targetType;
    
    // 専門
    const specialtyInput = document.getElementById('specialtyFilter');
    if (specialtyInput) specialtyInput.value = this.filters.specialty;
    
    // クライアント
    const clientInput = document.getElementById('clientFilter');
    if (clientInput) clientInput.value = this.filters.client;
    
    // リクルート人数
    const recruitMinInput = document.getElementById('recruitMinFilter');
    if (recruitMinInput) recruitMinInput.value = this.filters.recruitMin || '';
    
    const recruitMaxInput = document.getElementById('recruitMaxFilter');
    if (recruitMaxInput) recruitMaxInput.value = this.filters.recruitMax || '';
    
    // 問合せのみ
    const inquiryOnlyCheck = document.getElementById('inquiryOnlyFilter');
    if (inquiryOnlyCheck) inquiryOnlyCheck.checked = this.filters.inquiryOnly;
    
    // 期間
    const startDateInput = document.getElementById('startDateFilter');
    if (startDateInput) startDateInput.value = this.filters.startDate || '';
    
    const endDateInput = document.getElementById('endDateFilter');
    if (endDateInput) endDateInput.value = this.filters.endDate || '';
    
    // フリーテキスト
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = this.filters.freeText;
  }

  /**
   * URLパラメータを更新
   */
  updateURL() {
    const params = new URLSearchParams();
    
    if (this.filters.disease) params.set('disease', this.filters.disease);
    if (this.filters.targetType) params.set('targetType', this.filters.targetType);
    if (this.filters.specialty) params.set('specialty', this.filters.specialty);
    if (this.filters.client) params.set('client', this.filters.client);
    if (this.filters.recruitMin !== null) params.set('recruitMin', this.filters.recruitMin);
    if (this.filters.recruitMax !== null) params.set('recruitMax', this.filters.recruitMax);
    if (this.filters.inquiryOnly) params.set('inquiryOnly', 'true');
    if (this.filters.startDate) params.set('startDate', this.filters.startDate);
    if (this.filters.endDate) params.set('endDate', this.filters.endDate);
    if (this.filters.freeText) params.set('q', this.filters.freeText);
    
    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newURL);
  }

  /**
   * イベントリスナーのアタッチ
   */
  attachEventListeners() {
    // フィルタ入力フィールドのイベント
    const filterInputs = [
      'diseaseFilter',
      'targetTypeFilter',
      'specialtyFilter',
      'clientFilter',
      'recruitMinFilter',
      'recruitMaxFilter',
      'startDateFilter',
      'endDateFilter'
    ];
    
    filterInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => this.applyFilters());
      }
    });
    
    // 問合せのみチェックボックス
    const inquiryOnlyCheck = document.getElementById('inquiryOnlyFilter');
    if (inquiryOnlyCheck) {
      inquiryOnlyCheck.addEventListener('change', () => this.applyFilters());
    }
    
    // 検索ボックス（デバウンス処理）
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.filters.freeText = e.target.value;
          this.applyFilters();
        }, 300);
      });
    }
    
    // フィルタ適用ボタン
    const applyButton = document.getElementById('applyFilters');
    if (applyButton) {
      applyButton.addEventListener('click', () => this.applyFilters());
    }
    
    // リセットボタン
    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
      resetButton.addEventListener('click', () => this.resetFilters());
    }
  }

  /**
   * フィルタを適用
   */
  applyFilters() {
    // UI値を読み取り
    this.filters.disease = document.getElementById('diseaseFilter')?.value || '';
    this.filters.targetType = document.getElementById('targetTypeFilter')?.value || '';
    this.filters.specialty = document.getElementById('specialtyFilter')?.value || '';
    this.filters.client = document.getElementById('clientFilter')?.value || '';
    
    const recruitMin = document.getElementById('recruitMinFilter')?.value;
    this.filters.recruitMin = recruitMin ? parseInt(recruitMin) : null;
    
    const recruitMax = document.getElementById('recruitMaxFilter')?.value;
    this.filters.recruitMax = recruitMax ? parseInt(recruitMax) : null;
    
    this.filters.inquiryOnly = document.getElementById('inquiryOnlyFilter')?.checked || false;
    this.filters.startDate = document.getElementById('startDateFilter')?.value || null;
    this.filters.endDate = document.getElementById('endDateFilter')?.value || null;
    
    // URLを更新
    this.updateURL();
    
    // コールバック実行
    if (this.callbacks.onFilterChange) {
      this.callbacks.onFilterChange(this.filters);
    }
  }

  /**
   * フィルタをリセット
   */
  resetFilters() {
    this.filters = {
      disease: '',
      targetType: '',
      specialty: '',
      client: '',
      recruitMin: null,
      recruitMax: null,
      inquiryOnly: false,
      startDate: null,
      endDate: null,
      freeText: ''
    };
    
    this.updateUI();
    this.updateURL();
    
    if (this.callbacks.onReset) {
      this.callbacks.onReset();
    }
    
    if (this.callbacks.onFilterChange) {
      this.callbacks.onFilterChange(this.filters);
    }
  }

  /**
   * プロジェクトがフィルタに一致するかチェック
   */
  matchesFilters(project) {
    // 疾患名フィルタ
    if (this.filters.disease) {
      const disease = (project.diseaseName || '').toLowerCase();
      const diseaseAbbr = (project.diseaseAbbr || '').toLowerCase();
      const filterValue = this.filters.disease.toLowerCase();
      
      if (!disease.includes(filterValue) && !diseaseAbbr.includes(filterValue)) {
        return false;
      }
    }
    
    // 対象者種別フィルタ
    if (this.filters.targetType && project.targetType !== this.filters.targetType) {
      return false;
    }
    
    // 専門フィルタ
    if (this.filters.specialty) {
      const specialty = (project.specialty || '').toLowerCase();
      if (!specialty.includes(this.filters.specialty.toLowerCase())) {
        return false;
      }
    }
    
    // クライアントフィルタ
    if (this.filters.client) {
      const client = (project.client || '').toLowerCase();
      const endClient = (project.endClient || '').toLowerCase();
      const filterValue = this.filters.client.toLowerCase();
      
      if (!client.includes(filterValue) && !endClient.includes(filterValue)) {
        return false;
      }
    }
    
    // リクルート人数範囲フィルタ
    const recruitCount = parseInt(project.recruitCount) || 0;
    if (this.filters.recruitMin !== null && recruitCount < this.filters.recruitMin) {
      return false;
    }
    if (this.filters.recruitMax !== null && recruitCount > this.filters.recruitMax) {
      return false;
    }
    
    // 問合せのみフィルタ
    if (this.filters.inquiryOnly && !project.inquiryOnly) {
      return false;
    }
    
    // 期間フィルタ
    if (this.filters.startDate || this.filters.endDate) {
      const implDate = project.implementationDate ? new Date(project.implementationDate) : null;
      
      if (implDate) {
        if (this.filters.startDate && implDate < new Date(this.filters.startDate)) {
          return false;
        }
        if (this.filters.endDate && implDate > new Date(this.filters.endDate)) {
          return false;
        }
      }
    }
    
    // フリーテキスト検索
    if (this.filters.freeText) {
      const searchText = this.filters.freeText.toLowerCase();
      const searchableFields = [
        project.diseaseName,
        project.diseaseAbbr,
        project.method,
        project.surveyType,
        project.targetType,
        project.specialty,
        project.targetConditions,
        project.drug,
        project.recruitCompany,
        project.moderator,
        project.client,
        project.endClient,
        project.projectNumber,
        project.registrant
      ];
      
      const matchFound = searchableFields.some(field => {
        if (!field) return false;
        return String(field).toLowerCase().includes(searchText);
      });
      
      if (!matchFound) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 現在のフィルタを取得
   */
  getFilters() {
    return { ...this.filters };
  }

  /**
   * 特定のフィルタを設定
   */
  setFilter(key, value) {
    if (key in this.filters) {
      this.filters[key] = value;
      this.updateUI();
      this.updateURL();
    }
  }

  /**
   * アクティブなフィルタ数を取得
   */
  getActiveFilterCount() {
    let count = 0;
    
    if (this.filters.disease) count++;
    if (this.filters.targetType) count++;
    if (this.filters.specialty) count++;
    if (this.filters.client) count++;
    if (this.filters.recruitMin !== null) count++;
    if (this.filters.recruitMax !== null) count++;
    if (this.filters.inquiryOnly) count++;
    if (this.filters.startDate) count++;
    if (this.filters.endDate) count++;
    if (this.filters.freeText) count++;
    
    return count;
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.ProjectFilters = ProjectFilters;
}