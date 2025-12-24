/**
 * Seed Planning Project Management System - Edit Page
 * プロジェクト編集画面
 */

class EditPage {
  constructor() {
    this.pjNumber = this.getPjNumberFromURL();
    this.projectData = null;
    
    // UI要素
    this.loadingState = document.getElementById('loadingState');
    this.errorState = document.getElementById('errorState');
    this.errorMessage = document.getElementById('errorMessage');
    this.navigationCard = document.getElementById('navigationCard');
    this.infoAlert = document.getElementById('infoAlert');
    this.form = document.getElementById('editForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.loadingMessage = document.getElementById('loadingMessage');
    this.formErrorMessage = document.getElementById('formErrorMessage');
    this.successMessage = document.getElementById('successMessage');
    this.pageSubtitle = document.getElementById('pageSubtitle');
    this.viewDetailLink = document.getElementById('viewDetailLink');
    
    this.init();
  }

  /**
   * 初期化
   */
  async init() {
    if (!this.pjNumber) {
      this.showError('PJ番号が指定されていません。URLパラメータを確認してください。');
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
   * プロジェクトデータ読み込み
   */
  async loadProject() {
    try {
      this.showLoadingState();
      
      const response = await api.getProjectDetail(this.pjNumber);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'プロジェクトが見つかりません');
      }
      
      this.projectData = response.data;
      this.populateForm();
      this.bindEvents();
      this.showFormState();
      
    } catch (error) {
      console.error('Load project error:', error);
      this.showError(`プロジェクトの読み込みに失敗しました: ${error.message}`);
    }
  }

  /**
   * フォームにデータを設定
   */
  populateForm() {
    // ページサブタイトル更新
    this.pageSubtitle.textContent = `${this.projectData.pj_number} - ${this.projectData.project_name}`;
    
    // 詳細ページへのリンク設定
    this.viewDetailLink.href = `project.html?pj=${encodeURIComponent(this.pjNumber)}`;
    
    // 基本情報
    document.getElementById('pj_number').value = this.projectData.pj_number || '';
    document.getElementById('project_name').value = this.projectData.project_name || '';
    document.getElementById('project_type').value = this.projectData.project_type || '';
    document.getElementById('category').value = this.projectData.category || '';
    document.getElementById('term').value = this.projectData.term || '';
    document.getElementById('client_name').value = this.projectData.client_name || '';
    document.getElementById('summary').value = this.projectData.summary || '';
    document.getElementById('registered_by').value = this.projectData.registered_by || '';
    
    // 詳細情報
    document.getElementById('background').value = this.projectData.background || '';
    document.getElementById('purpose').value = this.projectData.purpose || '';
    document.getElementById('implementation').value = this.projectData.implementation || '';
    document.getElementById('deliverables').value = this.projectData.deliverables || '';
    document.getElementById('reference_files').value = this.projectData.reference_files || '';
    
    // サマリー文字数カウント更新
    this.updateSummaryCount();
  }

  /**
   * イベントバインディング
   */
  bindEvents() {
    // フォーム送信
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // リアルタイムバリデーション
    const requiredFields = this.form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });

    // サマリーの文字数カウント
    const summaryField = document.getElementById('summary');
    if (summaryField) {
      summaryField.addEventListener('input', () => this.updateSummaryCount());
    }
  }

  /**
   * サマリー文字数カウント更新
   */
  updateSummaryCount() {
    const summaryField = document.getElementById('summary');
    const countElement = document.getElementById('summaryCount');
    
    if (summaryField && countElement) {
      const count = summaryField.value.length;
      countElement.textContent = count;
      
      // 80文字以上で警告色
      if (count >= 80) {
        countElement.style.color = '#ea580c';
      } else {
        countElement.style.color = 'inherit';
      }
    }
  }

  /**
   * フィールドバリデーション
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // 必須チェック
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, `${this.getFieldLabel(field)}は必須項目です`);
      return false;
    }

    // 実施期の形式チェック（日付または「○○期」）
    if (fieldName === 'term' && value) {
      const isDate = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(value);
      const isTerm = /^\d+期$/.test(value);
      
      if (!isDate && !isTerm) {
        this.showFieldError(field, '日付（例: 2025-06-15）または期（例: 43期）の形式で入力してください');
        return false;
      }
    }

    this.clearFieldError(field);
    return true;
  }

  /**
   * フィールドエラー表示
   */
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    field.classList.add('field-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
  }

  /**
   * フィールドエラークリア
   */
  clearFieldError(field) {
    field.classList.remove('field-error');
    
    const errorMsg = field.parentElement.querySelector('.field-error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  /**
   * フィールドラベル取得
   */
  getFieldLabel(field) {
    const label = field.parentElement.querySelector('.form-label');
    if (label) {
      return label.textContent.replace(/\s*必須\s*$/, '').trim();
    }
    return field.getAttribute('name');
  }

  /**
   * フォーム全体のバリデーション
   */
  validateForm() {
    let isValid = true;
    
    const requiredFields = this.form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * フォームデータ取得
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};
    
    // PJ番号（変更不可）
    data.pj_number = this.pjNumber;
    
    // 基本情報（projects_index）
    data.project_name = formData.get('project_name').trim();
    data.project_type = formData.get('project_type');
    data.category = formData.get('category');
    data.term = formData.get('term').trim();
    data.client_name = formData.get('client_name').trim();
    data.summary = formData.get('summary').trim();
    data.registered_by = formData.get('registered_by').trim();
    
    // 詳細情報（projects_detail）
    data.background = formData.get('background').trim();
    data.purpose = formData.get('purpose').trim();
    data.implementation = formData.get('implementation').trim();
    data.deliverables = formData.get('deliverables').trim();
    data.reference_files = formData.get('reference_files').trim();
    
    // タイムスタンプ
    data.clientTimestamp = new Date().toISOString();
    
    return data;
  }

  /**
   * フォーム送信処理
   */
  async handleSubmit() {
    // バリデーション
    if (!this.validateForm()) {
      this.showFormError('入力内容に誤りがあります。赤字の項目を確認してください。');
      return;
    }

    // 確認ダイアログ
    const confirmed = confirm('このプロジェクトの変更を保存しますか？');
    if (!confirmed) {
      return;
    }

    // UI更新
    this.showFormLoading();
    this.hideFormMessages();
    this.submitBtn.disabled = true;

    try {
      // フォームデータ取得
      const data = this.getFormData();
      
      console.log('Updating data:', data);

      // API呼び出し
      const response = await api.updateProject(data);

      console.log('API Response:', response);

      if (response.success) {
        this.showFormSuccess(`プロジェクト「${data.project_name}」を更新しました。`);
        
        // 2秒後に詳細ページへリダイレクト
        setTimeout(() => {
          window.location.href = `project.html?pj=${encodeURIComponent(this.pjNumber)}`;
        }, 2000);
      } else {
        throw new Error(response.message || '更新に失敗しました');
      }
    } catch (error) {
      console.error('Update error:', error);
      this.showFormError(`エラーが発生しました: ${error.message}`);
      this.submitBtn.disabled = false;
    } finally {
      this.hideFormLoading();
    }
  }

  /**
   * 状態表示：読み込み中
   */
  showLoadingState() {
    this.loadingState.style.display = 'block';
    this.errorState.style.display = 'none';
    this.navigationCard.style.display = 'none';
    this.infoAlert.style.display = 'none';
    this.form.style.display = 'none';
  }

  /**
   * 状態表示：エラー
   */
  showError(message) {
    this.loadingState.style.display = 'none';
    this.errorState.style.display = 'block';
    this.errorMessage.textContent = message;
    this.navigationCard.style.display = 'none';
    this.infoAlert.style.display = 'none';
    this.form.style.display = 'none';
  }

  /**
   * 状態表示：フォーム
   */
  showFormState() {
    this.loadingState.style.display = 'none';
    this.errorState.style.display = 'none';
    this.navigationCard.style.display = 'block';
    this.infoAlert.style.display = 'block';
    this.form.style.display = 'block';
  }

  /**
   * フォームローディング表示
   */
  showFormLoading() {
    this.loadingMessage.style.display = 'block';
  }

  /**
   * フォームローディング非表示
   */
  hideFormLoading() {
    this.loadingMessage.style.display = 'none';
  }

  /**
   * フォームエラーメッセージ表示
   */
  showFormError(message) {
    this.formErrorMessage.textContent = `❌ ${message}`;
    this.formErrorMessage.style.display = 'block';
    
    // エラーメッセージまでスクロール
    this.formErrorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * フォーム成功メッセージ表示
   */
  showFormSuccess(message) {
    this.successMessage.textContent = `✅ ${message}`;
    this.successMessage.style.display = 'block';
    
    // 成功メッセージまでスクロール
    this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * フォームメッセージ非表示
   */
  hideFormMessages() {
    this.formErrorMessage.style.display = 'none';
    this.successMessage.style.display = 'none';
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  new EditPage();
});
