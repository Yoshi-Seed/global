/**
 * Seed Planning Project Management System - Project Detail Page
 * プロジェクト詳細ページ
 */

class ProjectDetailPage {
  constructor() {
    this.pjNumber = this.getPjNumberFromURL();
    this.project = null;
    
    // DOM要素
    this.loadingState = document.getElementById('loadingState');
    this.errorState = document.getElementById('errorState');
    this.errorMessage = document.getElementById('errorMessage');
    this.projectContent = document.getElementById('projectContent');
    
    this.init();
  }

  /**
   * 初期化
   */
  async init() {
    if (!this.pjNumber) {
      this.showError('PJ番号が指定されていません。');
      return;
    }

    await this.loadProject();
  }

  /**
   * URLからPJ番号を取得
   */
  getPjNumberFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('pj');
  }

  /**
   * プロジェクト詳細を読み込み
   */
  async loadProject() {
    this.showLoading();

    try {
      console.log('Loading project:', this.pjNumber);
      
      const response = await api.getProjectDetail(this.pjNumber);
      
      console.log('API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'プロジェクトの読み込みに失敗しました');
      }

      this.project = response.project;
      this.renderProject();
      this.showContent();
    } catch (error) {
      console.error('Load project error:', error);
      this.showError(`プロジェクトの読み込みに失敗しました: ${error.message}`);
    }
  }

  /**
   * プロジェクト情報を表示
   */
  renderProject() {
    const p = this.project;

    // ページタイトル
    document.getElementById('pageTitle').textContent = `📄 ${p.project_name || 'プロジェクト詳細'}`;
    document.getElementById('pageSubtitle').textContent = p.pj_number || '';
    document.title = `${p.project_name || 'プロジェクト詳細'} - Seed Planning`;

    // 基本情報
    this.setText('pjNumber', p.pj_number);
    this.setText('projectName', p.project_name);
    this.setText('category', p.category);
    this.setText('term', p.term);
    this.setText('clientName', p.client_name);
    this.setText('registeredBy', p.registered_by);
    this.setText('registeredDate', this.formatDate(p.registered_date));
    this.setText('summary', p.summary);

    // プロジェクトタイプ（バッジ表示）
    const typeElement = document.getElementById('projectType');
    if (p.project_type) {
      const badge = this.createBadge(p.project_type);
      typeElement.innerHTML = '';
      typeElement.appendChild(badge);
    } else {
      typeElement.textContent = '-';
    }

    // 詳細情報セクション（Markdown表示）
    this.renderMarkdownSection('background', 'backgroundSection', 'backgroundContent', p.background);
    this.renderMarkdownSection('purpose', 'purposeSection', 'purposeContent', p.purpose);
    this.renderMarkdownSection('implementation', 'implementationSection', 'implementationContent', p.implementation);
    this.renderMarkdownSection('deliverables', 'deliverablesSection', 'deliverablesContent', p.deliverables);

    // 参照ファイル
    this.renderReferenceFiles(p.reference_files);

    // 変更履歴
    this.renderHistory(p.history_log);

    // 編集ボタン
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
      editBtn.style.display = 'inline-block';
      editBtn.onclick = () => {
        window.location.href = `edit.html?pj=${encodeURIComponent(this.pjNumber)}`;
      };
    }
  }

  /**
   * テキスト設定
   */
  setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text || '-';
    }
  }

  /**
   * バッジ作成
   */
  createBadge(type) {
    const badge = document.createElement('span');
    badge.className = type === '公的' ? 'badge badge-info' : 'badge badge-primary';
    badge.textContent = type;
    return badge;
  }

  /**
   * Markdownセクション表示
   */
  renderMarkdownSection(fieldName, sectionId, contentId, content) {
    const section = document.getElementById(sectionId);
    const contentElement = document.getElementById(contentId);

    if (content && content.trim()) {
      section.classList.remove('d-none');
      
      try {
        // Markdownをパース
        const html = marked.parse(content);
        contentElement.innerHTML = html;
      } catch (error) {
        console.error(`Failed to parse markdown for ${fieldName}:`, error);
        // Markdownパースに失敗した場合、プレーンテキストとして表示
        contentElement.textContent = content;
      }
    } else {
      section.classList.add('d-none');
    }
  }

  /**
   * 参照ファイル表示
   */
  renderReferenceFiles(referenceFiles) {
    const section = document.getElementById('referenceFilesSection');
    const contentElement = document.getElementById('referenceFilesContent');

    if (referenceFiles && referenceFiles.trim()) {
      section.classList.remove('d-none');
      
      // 改行で分割してリスト表示
      const files = referenceFiles.split('\n').filter(f => f.trim());
      
      if (files.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'file-list';
        
        files.forEach(file => {
          const li = document.createElement('li');
          li.className = 'file-item';
          li.textContent = file.trim();
          ul.appendChild(li);
        });
        
        contentElement.innerHTML = '';
        contentElement.appendChild(ul);
      } else {
        contentElement.textContent = 'ファイル情報がありません';
      }
    } else {
      section.classList.add('d-none');
    }
  }

  /**
   * 変更履歴表示
   */
  renderHistory(historyLog) {
    const section = document.getElementById('historySection');
    const contentElement = document.getElementById('historyContent');

    if (historyLog && Array.isArray(historyLog) && historyLog.length > 0) {
      section.classList.remove('d-none');
      
      const list = document.createElement('div');
      list.className = 'history-list';
      
      historyLog.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'history-timestamp';
        timestamp.textContent = this.formatDateTime(entry.timestamp);
        
        const action = document.createElement('span');
        action.className = 'history-action';
        action.textContent = this.getActionLabel(entry.action);
        
        const user = document.createElement('span');
        user.className = 'history-user';
        user.textContent = entry.user || '不明';
        
        item.appendChild(timestamp);
        item.appendChild(action);
        item.appendChild(user);
        
        list.appendChild(item);
      });
      
      contentElement.innerHTML = '';
      contentElement.appendChild(list);
    } else {
      section.classList.add('d-none');
    }
  }

  /**
   * アクションラベル取得
   */
  getActionLabel(action) {
    const labels = {
      'created': '作成',
      'updated': '更新',
      'deleted': '削除'
    };
    return labels[action] || action;
  }

  /**
   * 日付フォーマット（yyyy-MM-dd）
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
   * 日時フォーマット（yyyy-MM-dd HH:mm）
   */
  formatDateTime(dateString) {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  }

  /**
   * ローディング表示
   */
  showLoading() {
    this.loadingState.classList.remove('d-none');
    this.errorState.classList.add('d-none');
    this.projectContent.classList.add('d-none');
  }

  /**
   * エラー表示
   */
  showError(message) {
    this.loadingState.classList.add('d-none');
    this.errorState.classList.remove('d-none');
    this.projectContent.classList.add('d-none');
    this.errorMessage.textContent = message;
  }

  /**
   * コンテンツ表示
   */
  showContent() {
    this.loadingState.classList.add('d-none');
    this.errorState.classList.add('d-none');
    this.projectContent.classList.remove('d-none');
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  new ProjectDetailPage();
});
