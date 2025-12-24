/**
 * Seed Planning Project Management System - Register Page
 * 新規プロジェクト登録画面
 */

class RegisterPage {
  constructor() {
    this.form = document.getElementById('registerForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.loadingMessage = document.getElementById('loadingMessage');
    this.errorMessage = document.getElementById('errorMessage');
    this.successMessage = document.getElementById('successMessage');
    
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.bindEvents();
    this.setDefaultValues();
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
      summaryField.addEventListener('input', () => this.updateCharCount(summaryField));
    }
  }

  /**
   * デフォルト値設定
   */
  setDefaultValues() {
    // 登録日を今日の日付に設定
    const today = new Date().toISOString().split('T')[0];
    
    // デフォルトの登録担当者を設定（必要に応じて）
    // document.getElementById('registered_by').value = 'デフォルト担当者';
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

    // PJ番号の形式チェック
    if (fieldName === 'pj_number' && value) {
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        this.showFieldError(field, 'PJ番号は英数字のみで入力してください');
        return false;
      }
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
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
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
   * 文字数カウント更新
   */
  updateCharCount(field) {
    const maxLength = field.getAttribute('maxlength') || 200;
    const currentLength = field.value.length;
    
    let countDiv = field.parentElement.querySelector('.char-count');
    if (!countDiv) {
      countDiv = document.createElement('div');
      countDiv.className = 'char-count';
      countDiv.style.fontSize = '0.875rem';
      countDiv.style.color = '#6c757d';
      countDiv.style.marginTop = '0.25rem';
      countDiv.style.textAlign = 'right';
      field.parentElement.appendChild(countDiv);
    }
    
    countDiv.textContent = `${currentLength} / ${maxLength}文字`;
    
    if (currentLength > maxLength * 0.9) {
      countDiv.style.color = '#dc3545';
    } else {
      countDiv.style.color = '#6c757d';
    }
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
    
    // 基本情報（projects_index）
    data.pj_number = formData.get('pj_number').trim();
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
      this.showError('入力内容に誤りがあります。赤字の項目を確認してください。');
      return;
    }

    // 確認ダイアログ
    const confirmed = confirm('このプロジェクトを登録しますか？');
    if (!confirmed) {
      return;
    }

    // UI更新
    this.showLoading();
    this.hideMessages();
    this.submitBtn.disabled = true;

    try {
      // フォームデータ取得
      const data = this.getFormData();
      
      console.log('Submitting data:', data);

      // API呼び出し
      const response = await api.addProject(data);

      console.log('API Response:', response);

      if (response.success) {
        this.showSuccess(`プロジェクト「${data.project_name}」を登録しました。`);
        
        // 3秒後に一覧ページへリダイレクト
        setTimeout(() => {
          window.location.href = `project.html?pj=${encodeURIComponent(data.pj_number)}`;
        }, 2000);
      } else {
        throw new Error(response.message || '登録に失敗しました');
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.showError(`エラーが発生しました: ${error.message}`);
      this.submitBtn.disabled = false;
    } finally {
      this.hideLoading();
    }
  }

  /**
   * ローディング表示
   */
  showLoading() {
    this.loadingMessage.style.display = 'block';
  }

  /**
   * ローディング非表示
   */
  hideLoading() {
    this.loadingMessage.style.display = 'none';
  }

  /**
   * エラーメッセージ表示
   */
  showError(message) {
    this.errorMessage.textContent = `❌ ${message}`;
    this.errorMessage.style.display = 'block';
    
    // エラーメッセージまでスクロール
    this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * 成功メッセージ表示
   */
  showSuccess(message) {
    this.successMessage.textContent = `✅ ${message}`;
    this.successMessage.style.display = 'block';
    
    // 成功メッセージまでスクロール
    this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * メッセージ非表示
   */
  hideMessages() {
    this.errorMessage.style.display = 'none';
    this.successMessage.style.display = 'none';
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  new RegisterPage();
});
