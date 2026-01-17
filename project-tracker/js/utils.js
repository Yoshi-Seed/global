/**
 * Project Tracker - 共通ユーティリティ関数
 * 
 * 複数のページで使用される汎用的な関数を集約
 * グローバルスコープの汚染を防ぐため、ProjectUtils名前空間に整理
 */

const ProjectUtils = {
  /**
   * テキストを指定された長さで切り詰め
   * @param {string} text - 対象テキスト
   * @param {number} length - 最大文字数
   * @returns {string} 切り詰められたテキスト
   */
  truncate(text, length = 100) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  },

  /**
   * CSVフィールドをエスケープ
   * @param {*} field - エスケープする値
   * @returns {string} エスケープされた値
   */
  escapeCSVField(field) {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    
    // カンマ、改行、ダブルクォートが含まれる場合は引用符で囲む
    if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
      // ダブルクォートをエスケープ（ダブルクォートを2つに）
      return '"' + stringField.replace(/"/g, '""') + '"';
    }
    return stringField;
  },

  /**
   * 日付文字列をフォーマット（YYYY-MM-DD形式）
   * @param {string|Date} value - 日付値
   * @returns {string} フォーマットされた日付
   */
  formatDateString(value) {
    if (!value) return '';
    
    // Date オブジェクトの場合
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    
    // 文字列の場合、様々な形式を試みる
    const dateStr = String(value).trim();
    
    // YYYY-MM-DD形式の場合はそのまま返す
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // ISO 8601形式の場合
    if (dateStr.includes('T') || dateStr.includes(' ')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    
    // その他の形式の場合
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return dateStr; // パースできない場合は元の値を返す
  },

  /**
   * 日付を日本語形式でフォーマット（YYYY年MM月DD日）
   * @param {string|Date} date - 日付値
   * @returns {string} 日本語形式の日付
   */
  formatDateJapanese(date) {
    if (!date) return '';
    
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return String(date);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}年${month}月${day}日`;
  },

  /**
   * 対象者種別のバッジクラスを取得
   * @param {string} type - 対象者種別
   * @returns {string} CSSクラス名
   */
  getTargetTypeBadgeClass(type) {
    const typeMap = {
      '医師': 'bg-blue-100 text-blue-800',
      '患者': 'bg-green-100 text-green-800',
      '介護者': 'bg-yellow-100 text-yellow-800',
      'KOL': 'bg-purple-100 text-purple-800',
      '看護師': 'bg-pink-100 text-pink-800',
      '薬剤師': 'bg-indigo-100 text-indigo-800',
      'その他': 'bg-gray-100 text-gray-800'
    };
    
    return typeMap[type] || 'bg-gray-100 text-gray-800';
  },

  /**
   * 調査種別のバッジクラスを取得
   * @param {string} type - 調査種別
   * @returns {string} CSSクラス名
   */
  getSurveyTypeBadgeClass(type) {
    const typeMap = {
      '定性': 'bg-purple-100 text-purple-800',
      '定量': 'bg-orange-100 text-orange-800'
    };
    
    return typeMap[type] || 'bg-gray-100 text-gray-800';
  },

  /**
   * 数値をカンマ区切りでフォーマット
   * @param {number} num - 数値
   * @returns {string} カンマ区切りの数値文字列
   */
  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('ja-JP');
  },

  /**
   * URLパラメータを取得
   * @returns {URLSearchParams} URLパラメータオブジェクト
   */
  getUrlParams() {
    return new URLSearchParams(window.location.search);
  },

  /**
   * URLパラメータを更新（ページリロードなし）
   * @param {Object} params - 設定するパラメータ
   */
  updateUrlParams(params) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    });
    window.history.pushState({}, '', url);
  },

  /**
   * デバウンス関数（連続呼び出しを制限）
   * @param {Function} func - 実行する関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @returns {Function} デバウンスされた関数
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * スロットル関数（一定時間ごとに実行を制限）
   * @param {Function} func - 実行する関数
   * @param {number} limit - 制限時間（ミリ秒）
   * @returns {Function} スロットルされた関数
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 深いオブジェクトのコピー
   * @param {Object} obj - コピー元オブジェクト
   * @returns {Object} コピーされたオブジェクト
   */
  deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepCopy(item));
    
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepCopy(obj[key]);
      }
    }
    return cloned;
  },

  /**
   * 配列をチャンクに分割
   * @param {Array} array - 分割する配列
   * @param {number} size - チャンクサイズ
   * @returns {Array} チャンクの配列
   */
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  /**
   * 配列から重複を削除
   * @param {Array} array - 対象配列
   * @param {Function} keyFunc - キーを生成する関数（オプション）
   * @returns {Array} 重複が削除された配列
   */
  unique(array, keyFunc) {
    if (!keyFunc) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const key = keyFunc(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  /**
   * 配列をソート（日本語対応）
   * @param {Array} array - ソートする配列
   * @param {string|Function} key - ソートキーまたは比較関数
   * @param {boolean} desc - 降順フラグ
   * @returns {Array} ソートされた配列
   */
  sortArray(array, key, desc = false) {
    const sorted = [...array];
    
    if (typeof key === 'function') {
      sorted.sort(key);
    } else if (typeof key === 'string') {
      sorted.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        // 数値の場合
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return aVal - bVal;
        }
        
        // 文字列の場合（日本語対応）
        return String(aVal).localeCompare(String(bVal), 'ja');
      });
    } else {
      sorted.sort((a, b) => String(a).localeCompare(String(b), 'ja'));
    }
    
    return desc ? sorted.reverse() : sorted;
  },

  /**
   * ローカルストレージへの安全な保存
   * @param {string} key - ストレージキー
   * @param {*} value - 保存する値
   * @returns {boolean} 成功フラグ
   */
  saveToStorage(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },

  /**
   * ローカルストレージからの安全な読み込み
   * @param {string} key - ストレージキー
   * @param {*} defaultValue - デフォルト値
   * @returns {*} 読み込んだ値
   */
  loadFromStorage(key, defaultValue = null) {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * セッションストレージへの安全な保存
   * @param {string} key - ストレージキー
   * @param {*} value - 保存する値
   * @returns {boolean} 成功フラグ
   */
  saveToSession(key, value) {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
      return false;
    }
  },

  /**
   * セッションストレージからの安全な読み込み
   * @param {string} key - ストレージキー
   * @param {*} defaultValue - デフォルト値
   * @returns {*} 読み込んだ値
   */
  loadFromSession(key, defaultValue = null) {
    try {
      const serialized = sessionStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load from sessionStorage:', error);
      return defaultValue;
    }
  },

  /**
   * クリップボードにコピー
   * @param {string} text - コピーするテキスト
   * @returns {Promise<boolean>} 成功フラグ
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // フォールバック方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },

  /**
   * ランダムID生成
   * @param {string} prefix - IDプレフィックス
   * @returns {string} 生成されたID
   */
  generateId(prefix = 'id') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  },

  /**
   * メールアドレスのバリデーション
   * @param {string} email - メールアドレス
   * @returns {boolean} 有効性
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 電話番号のバリデーション（日本）
   * @param {string} phone - 電話番号
   * @returns {boolean} 有効性
   */
  isValidPhoneNumber(phone) {
    // 日本の電話番号形式（携帯、固定電話）
    const phoneRegex = /^(0[0-9]{1,4}-?[0-9]{1,4}-?[0-9]{3,4}|0[0-9]{9,10})$/;
    return phoneRegex.test(phone.replace(/[－‐ー−]/g, '-'));
  },

  /**
   * 全角を半角に変換
   * @param {string} str - 変換する文字列
   * @returns {string} 変換後の文字列
   */
  toHalfWidth(str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  },

  /**
   * 半角を全角に変換
   * @param {string} str - 変換する文字列
   * @returns {string} 変換後の文字列
   */
  toFullWidth(str) {
    return str.replace(/[A-Za-z0-9]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
  }
};

// グローバルに公開（互換性のため）
if (typeof window !== 'undefined') {
  window.ProjectUtils = ProjectUtils;
  
  // 後方互換性のため、個別の関数もグローバルに公開
  window.truncate = ProjectUtils.truncate;
  window.escapeCSVField = ProjectUtils.escapeCSVField;
  window.formatDateString = ProjectUtils.formatDateString;
  window.getTargetTypeBadgeClass = ProjectUtils.getTargetTypeBadgeClass;
}