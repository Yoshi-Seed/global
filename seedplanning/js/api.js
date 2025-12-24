/**
 * Seed Planning Project Management System - API Client
 * 
 * GAS APIとの通信を担当するモジュール
 */

class SeedPlanningAPI {
  constructor(config = GAS_CONFIG) {
    this.config = config;
    this.cache = new Map();
  }

  /**
   * キャッシュキーを生成
   */
  _getCacheKey(url, params) {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${url}_${paramStr}`;
  }

  /**
   * キャッシュから取得
   */
  _getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.config.CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    
    log('Cache hit:', key);
    return cached.data;
  }

  /**
   * キャッシュに保存
   */
  _setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * URLパラメータを構築
   */
  _buildURL(action, params = {}) {
    const url = new URL(this.config.URL);
    url.searchParams.set('action', action);
    
    if (this.config.TOKEN) {
      url.searchParams.set('token', this.config.TOKEN);
    }
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
    
    return url.toString();
  }

  /**
   * GETリクエスト
   */
  async _get(action, params = {}, useCache = true) {
    const url = this._buildURL(action, params);
    const cacheKey = this._getCacheKey(url, params);
    
    if (useCache) {
      const cached = this._getCache(cacheKey);
      if (cached) return cached;
    }
    
    log('GET request:', action, params);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (useCache) {
        this._setCache(cacheKey, data);
      }
      
      log('GET response:', data);
      return data;
    } catch (error) {
      logError('GET request failed:', error);
      throw error;
    }
  }

  /**
   * POSTリクエスト
   */
  async _post(action, payload = {}, urlParams = {}) {
    const url = this._buildURL(action, urlParams);
    
    log('POST request:', action, payload);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          token: this.config.TOKEN || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // POSTの場合、キャッシュをクリア
      this.clearCache();
      
      log('POST response:', data);
      return data;
    } catch (error) {
      logError('POST request failed:', error);
      throw error;
    }
  }

  /**
   * キャッシュをクリア
   */
  clearCache() {
    this.cache.clear();
    log('Cache cleared');
  }

  // ================================
  // Public API Methods
  // ================================

  /**
   * ヘルスチェック
   */
  async health() {
    return this._get('health', {}, false);
  }

  /**
   * プロジェクト一覧取得（フィルタ対応）
   * @param {Object} filters - { type, category, term, client, q }
   */
  async getProjects(filters = {}) {
    return this._get('list', filters, true);
  }

  /**
   * プロジェクト詳細取得
   * @param {string} pjNumber - PJ番号
   */
  async getProjectDetail(pjNumber) {
    if (!pjNumber) {
      throw new Error('pjNumber is required');
    }
    return this._get('detail', { pj: pjNumber }, true);
  }

  /**
   * プロジェクト新規登録
   * @param {Object} projectData - プロジェクトデータ
   */
  async createProject(projectData) {
    if (!projectData.pj_number || !projectData.project_name) {
      throw new Error('pj_number and project_name are required');
    }
    return this._post('add', projectData);
  }

  /**
   * プロジェクト更新
   * @param {string} pjNumber - PJ番号
   * @param {Object} projectData - 更新データ
   */
  async updateProject(pjNumber, projectData) {
    if (!pjNumber) {
      throw new Error('pjNumber is required');
    }
    return this._post('update', projectData, { pj: pjNumber });
  }

  /**
   * 削除依頼
   * @param {string} pjNumber - PJ番号
   * @param {string} reason - 削除理由
   * @param {Object} projectInfo - プロジェクト情報（スナップショット）
   */
  async requestDelete(pjNumber, reason, projectInfo = null) {
    if (!pjNumber || !reason) {
      throw new Error('pjNumber and reason are required');
    }
    return this._post('delete_request', {
      pj_number: pjNumber,
      reason,
      projectInfo,
      clientTimestamp: new Date().toISOString()
    });
  }

  /**
   * 削除実行（TOKEN必須）
   * @param {string} pjNumber - PJ番号
   * @param {string} reason - 削除理由
   * @param {string} password - 確認パスワード（"delete"）
   */
  async deleteProject(pjNumber, reason, password) {
    if (!pjNumber || !reason || !password) {
      throw new Error('pjNumber, reason, and password are required');
    }
    return this._post('delete', {
      pj_number: pjNumber,
      reason,
      password,
      clientTimestamp: new Date().toISOString()
    }, { pj: pjNumber });
  }
}

// グローバルインスタンスを作成
const api = new SeedPlanningAPI();
