/**
 * フォームバリデーションモジュール
 * @module form-validation
 */

/**
 * バリデーションルール定義
 */
const VALIDATION_RULES = {
  required: {
    validate: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
    message: 'このフィールドは必須です'
  },
  
  maxLength: {
    validate: (value, max) => !value || value.toString().length <= max,
    message: (max) => `${max}文字以内で入力してください`
  },
  
  minLength: {
    validate: (value, min) => !value || value.toString().length >= min,
    message: (min) => `${min}文字以上入力してください`
  },
  
  pattern: {
    validate: (value, pattern) => !value || new RegExp(pattern).test(value),
    message: 'フォーマットが正しくありません'
  },
  
  number: {
    validate: (value) => !value || !isNaN(value),
    message: '数値を入力してください'
  },
  
  min: {
    validate: (value, min) => !value || parseFloat(value) >= min,
    message: (min) => `${min}以上の値を入力してください`
  },
  
  max: {
    validate: (value, max) => !value || parseFloat(value) <= max,
    message: (max) => `${max}以下の値を入力してください`
  },
  
  email: {
    validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: '有効なメールアドレスを入力してください'
  },
  
  date: {
    validate: (value) => !value || !isNaN(Date.parse(value)),
    message: '有効な日付を入力してください'
  },
  
  custom: {
    validate: (value, fn) => fn(value),
    message: 'バリデーションエラー'
  }
};

/**
 * フォームバリデーター
 */
export class FormValidator {
  /**
   * コンストラクタ
   * @param {string|HTMLFormElement} formOrId - フォーム要素またはID
   * @param {Object} rules - バリデーションルール
   * @param {Object} options - オプション
   */
  constructor(formOrId, rules = {}, options = {}) {
    this.form = typeof formOrId === 'string' 
      ? document.getElementById(formOrId)
      : formOrId;
      
    if (!this.form) {
      throw new Error('Form element not found');
    }
    
    this.rules = rules;
    this.options = {
      validateOnBlur: true,
      validateOnChange: false,
      validateOnSubmit: true,
      showErrorMessages: true,
      errorClass: 'border-red-400',
      errorMessageClass: 'text-red-600 text-sm mt-1',
      ...options
    };
    
    this.errors = {};
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    // バリデーションイベントの設定
    if (this.options.validateOnSubmit) {
      this.form.addEventListener('submit', (e) => {
        if (!this.validateAll()) {
          e.preventDefault();
          e.stopPropagation();
          this.focusFirstError();
        }
      });
    }
    
    // フィールドごとのイベント設定
    Object.keys(this.rules).forEach(fieldName => {
      const field = this.form.elements[fieldName];
      if (!field) return;
      
      if (this.options.validateOnBlur) {
        field.addEventListener('blur', () => {
          this.validateField(fieldName);
        });
      }
      
      if (this.options.validateOnChange) {
        field.addEventListener('change', () => {
          this.validateField(fieldName);
        });
      }
      
      // エラーメッセージ要素の作成
      if (this.options.showErrorMessages && !this.getErrorElement(field)) {
        const errorElement = document.createElement('div');
        errorElement.className = this.options.errorMessageClass;
        errorElement.style.display = 'none';
        errorElement.setAttribute('data-error-for', fieldName);
        
        // フィールドの後に挿入
        if (field.parentNode) {
          field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
      }
    });
  }

  /**
   * フィールドのバリデーション
   * @param {string} fieldName - フィールド名
   * @returns {boolean} - 有効かどうか
   */
  validateField(fieldName) {
    const field = this.form.elements[fieldName];
    if (!field) return true;
    
    const rules = this.rules[fieldName];
    if (!rules) return true;
    
    const value = this.getFieldValue(field);
    const errors = [];
    
    // 各ルールをチェック
    Object.entries(rules).forEach(([ruleName, ruleValue]) => {
      if (ruleName === 'custom') {
        // カスタムバリデーション
        const customRule = ruleValue;
        if (typeof customRule === 'function') {
          const result = customRule(value, this.form);
          if (result !== true) {
            errors.push(typeof result === 'string' ? result : 'バリデーションエラー');
          }
        } else if (typeof customRule === 'object' && customRule.validate) {
          if (!customRule.validate(value, this.form)) {
            errors.push(customRule.message || 'バリデーションエラー');
          }
        }
      } else if (VALIDATION_RULES[ruleName]) {
        // 組み込みルール
        const rule = VALIDATION_RULES[ruleName];
        if (!rule.validate(value, ruleValue)) {
          const message = typeof rule.message === 'function' 
            ? rule.message(ruleValue)
            : rule.message;
          errors.push(message);
        }
      }
    });
    
    // 条件付き必須チェック
    if (rules.requiredIf) {
      const condition = rules.requiredIf;
      if (typeof condition === 'function' && condition(this.form)) {
        if (!value || value.toString().trim() === '') {
          errors.push('このフィールドは必須です');
        }
      }
    }
    
    // エラー表示を更新
    if (errors.length > 0) {
      this.errors[fieldName] = errors;
      this.showFieldError(field, errors[0]);
    } else {
      delete this.errors[fieldName];
      this.hideFieldError(field);
    }
    
    return errors.length === 0;
  }

  /**
   * すべてのフィールドをバリデート
   * @returns {boolean} - すべて有効かどうか
   */
  validateAll() {
    let isValid = true;
    
    Object.keys(this.rules).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * フィールドの値を取得
   * @param {HTMLElement} field - フィールド要素
   * @returns {*} - 値
   */
  getFieldValue(field) {
    if (field.type === 'checkbox') {
      return field.checked;
    } else if (field.type === 'radio') {
      const checkedRadio = this.form.querySelector(`input[name="${field.name}"]:checked`);
      return checkedRadio ? checkedRadio.value : null;
    } else if (field.tagName === 'SELECT' && field.multiple) {
      return Array.from(field.selectedOptions).map(option => option.value);
    } else {
      return field.value;
    }
  }

  /**
   * フィールドエラーを表示
   * @param {HTMLElement} field - フィールド要素
   * @param {string} message - エラーメッセージ
   */
  showFieldError(field, message) {
    // エラークラスを追加
    field.classList.add(this.options.errorClass);
    
    // エラーメッセージを表示
    if (this.options.showErrorMessages) {
      const errorElement = this.getErrorElement(field);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      }
    }
    
    // ARIA属性を設定
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `error-${field.name}`);
  }

  /**
   * フィールドエラーを非表示
   * @param {HTMLElement} field - フィールド要素
   */
  hideFieldError(field) {
    // エラークラスを削除
    field.classList.remove(this.options.errorClass);
    
    // エラーメッセージを非表示
    if (this.options.showErrorMessages) {
      const errorElement = this.getErrorElement(field);
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
    
    // ARIA属性を削除
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }

  /**
   * エラー要素を取得
   * @param {HTMLElement} field - フィールド要素
   * @returns {HTMLElement} - エラー要素
   */
  getErrorElement(field) {
    return field.parentNode ? 
      field.parentNode.querySelector(`[data-error-for="${field.name}"]`) : null;
  }

  /**
   * 最初のエラーフィールドにフォーカス
   */
  focusFirstError() {
    const firstErrorField = Object.keys(this.errors)[0];
    if (firstErrorField) {
      const field = this.form.elements[firstErrorField];
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * エラーをクリア
   * @param {string} fieldName - フィールド名（省略時は全エラー）
   */
  clearErrors(fieldName) {
    if (fieldName) {
      delete this.errors[fieldName];
      const field = this.form.elements[fieldName];
      if (field) {
        this.hideFieldError(field);
      }
    } else {
      Object.keys(this.errors).forEach(name => {
        const field = this.form.elements[name];
        if (field) {
          this.hideFieldError(field);
        }
      });
      this.errors = {};
    }
  }

  /**
   * エラーがあるかチェック
   * @returns {boolean} - エラーがあるかどうか
   */
  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * エラーを取得
   * @param {string} fieldName - フィールド名（省略時は全エラー）
   * @returns {*} - エラー
   */
  getErrors(fieldName) {
    return fieldName ? this.errors[fieldName] : this.errors;
  }

  /**
   * カスタムエラーを設定
   * @param {string} fieldName - フィールド名
   * @param {string|Array} errors - エラーメッセージ
   */
  setError(fieldName, errors) {
    const field = this.form.elements[fieldName];
    if (!field) return;
    
    const errorArray = Array.isArray(errors) ? errors : [errors];
    this.errors[fieldName] = errorArray;
    this.showFieldError(field, errorArray[0]);
  }
}

// プロジェクト登録フォーム用のバリデーションルール
export const PROJECT_VALIDATION_RULES = {
  diseaseName: {
    required: true,
    maxLength: 100,
    custom: (value) => {
      // 特殊文字のチェック
      if (/[<>]/.test(value)) {
        return '特殊文字 < > は使用できません';
      }
      return true;
    }
  },
  
  diseaseAbbr: {
    maxLength: 50
  },
  
  targetType: {
    required: true
  },
  
  specialty: {
    requiredIf: (form) => {
      const targetType = form.elements.targetType?.value;
      return targetType === '医師';
    },
    custom: (value, form) => {
      const targetType = form.elements.targetType?.value;
      if (targetType === '医師' && !value) {
        return '医師の場合は診療科の選択が必須です';
      }
      return true;
    }
  },
  
  recruitCount: {
    number: true,
    min: 0,
    max: 99999
  },
  
  client: {
    required: true,
    maxLength: 200
  },
  
  implementationDate: {
    pattern: '^\\d{4}/(0[1-9]|1[0-2])(/([0-2][0-9]|3[01]))?$',
    custom: (value) => {
      if (!value) return true;
      
      // 日付フォーマットのチェック
      const parts = value.split('/');
      if (parts.length < 2) return '正しい形式で入力してください（例: 2024/03）';
      
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      
      if (year < 1900 || year > 2100) {
        return '有効な年を入力してください';
      }
      
      if (month < 1 || month > 12) {
        return '有効な月を入力してください';
      }
      
      if (parts.length === 3) {
        const day = parseInt(parts[2]);
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day < 1 || day > daysInMonth) {
          return '有効な日を入力してください';
        }
      }
      
      return true;
    }
  }
};

// デフォルトエクスポート
export default FormValidator;