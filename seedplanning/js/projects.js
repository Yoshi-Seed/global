/**
 * Seed Planning Project Management System - Projects List Page
 */

class ProjectsListPage {
  constructor() {
    this.currentFilters = {};
    this.init();
  }

  /**
   * 初期化
   */
  async init() {
    this.bindEvents();
    await this.loadProjects();
  }

  /**
   * イベントバインディング
   */
  bindEvents() {
    // 検索フォーム送信
    document.getElementById('filterForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSearch();
    });

    // リセットボタン
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetFilters();
    });

    // Enterキーで検索
    ['filterClient', 'filterKeyword'].forEach(id => {
      document.getElementById(id).addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          await this.handleSearch();
        }
      });
    });
  }

  /**
   * フィルタ値を取得
   */
  getFilters() {
    return {
      type: document.getElementById('filterType').value.trim(),
      category: document.getElementById('filterCategory').value.trim(),
      term: document.getElementById('filterTerm').value.trim(),
      client: document.getElementById('filterClient').value.trim(),
      q: document.getElementById('filterKeyword').value.trim()
    };
  }

  /**
   * フィルタをリセット
   */
  resetFilters() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterTerm').value = '';
    document.getElementById('filterClient').value = '';
    document.getElementById('filterKeyword').value = '';
    this.currentFilters = {};
    this.loadProjects();
  }

  /**
   * 検索処理
   */
  async handleSearch() {
    this.currentFilters = this.getFilters();
    await this.loadProjects(this.currentFilters);
  }

  /**
   * プロジェクト一覧読み込み
   */
  async loadProjects(filters = {}) {
    this.showLoading();

    try {
      const response = await api.getProjects(filters);

      if (!response.success) {
        throw new Error(response.message || 'データの取得に失敗しました');
      }

      this.renderProjects(response.projects);
      this.updateResultCount(response.count, filters);
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * プロジェクト一覧を表示
   */
  renderProjects(projects) {
    const tbody = document.getElementById('projectsList');
    tbody.innerHTML = '';

    if (!projects || projects.length === 0) {
      this.showEmpty();
      return;
    }

    projects.forEach(project => {
      const row = this.createProjectRow(project);
      tbody.appendChild(row);
    });

    this.showResults();
  }

  /**
   * プロジェクト行を作成
   */
  createProjectRow(project) {
    const tr = document.createElement('tr');

    // PJ番号
    const tdPjNumber = document.createElement('td');
    const pjLink = document.createElement('a');
    pjLink.href = `project.html?pj=${encodeURIComponent(project.pj_number)}`;
    pjLink.className = 'table-link';
    pjLink.textContent = project.pj_number || '-';
    tdPjNumber.appendChild(pjLink);
    tr.appendChild(tdPjNumber);

    // プロジェクト名
    const tdName = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.href = `project.html?pj=${encodeURIComponent(project.pj_number)}`;
    nameLink.className = 'table-link';
    nameLink.textContent = project.project_name || '-';
    nameLink.title = project.summary || project.project_name;
    tdName.appendChild(nameLink);
    tr.appendChild(tdName);

    // タイプ
    const tdType = document.createElement('td');
    if (project.project_type) {
      const badge = document.createElement('span');
      badge.className = project.project_type === '公的' ? 'badge badge-info' : 'badge badge-primary';
      badge.textContent = project.project_type;
      tdType.appendChild(badge);
    } else {
      tdType.textContent = '-';
    }
    tr.appendChild(tdType);

    // カテゴリー
    const tdCategory = document.createElement('td');
    tdCategory.textContent = project.category || '-';
    tr.appendChild(tdCategory);

    // 実施期
    const tdTerm = document.createElement('td');
    tdTerm.textContent = project.term || '-';
    tr.appendChild(tdTerm);

    // クライアント名
    const tdClient = document.createElement('td');
    tdClient.textContent = project.client_name || '-';
    tdClient.title = project.client_name;
    tr.appendChild(tdClient);

    // 更新日
    const tdUpdated = document.createElement('td');
    tdUpdated.textContent = this.formatDate(project.updated_at || project.registered_date);
    tr.appendChild(tdUpdated);

    return tr;
  }

  /**
   * 日付フォーマット
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return dateString;
    }
  }

  /**
   * 検索結果件数を更新
   */
  updateResultCount(count, filters) {
    const resultCount = document.getElementById('resultCount');
    
    const hasFilters = Object.values(filters).some(v => v !== '');
    
    if (hasFilters) {
      resultCount.textContent = `🔍 検索結果: ${count}件`;
    } else {
      resultCount.textContent = `📊 全プロジェクト: ${count}件`;
    }
  }

  /**
   * ローディング表示
   */
  showLoading() {
    document.getElementById('loadingState').classList.remove('d-none');
    document.getElementById('errorState').classList.add('d-none');
    document.getElementById('emptyState').classList.add('d-none');
    document.getElementById('resultsTable').classList.add('d-none');
  }

  /**
   * エラー表示
   */
  showError(message) {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('errorState').classList.remove('d-none');
    document.getElementById('emptyState').classList.add('d-none');
    document.getElementById('resultsTable').classList.add('d-none');
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('resultCount').textContent = '⚠️ エラーが発生しました';
  }

  /**
   * 空状態表示
   */
  showEmpty() {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('errorState').classList.add('d-none');
    document.getElementById('emptyState').classList.remove('d-none');
    document.getElementById('resultsTable').classList.add('d-none');
  }

  /**
   * 検索結果表示
   */
  showResults() {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('errorState').classList.add('d-none');
    document.getElementById('emptyState').classList.add('d-none');
    document.getElementById('resultsTable').classList.remove('d-none');
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsListPage();
});
