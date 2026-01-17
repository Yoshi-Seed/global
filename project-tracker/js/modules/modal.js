/**
 * モーダル管理モジュール
 * @module modal
 */

export class ModalManager {
  constructor() {
    this.activeModal = null;
    this.modalStack = [];
    this.escListeners = new Map();
    this.init();
  }

  init() {
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        const topModal = this.modalStack[this.modalStack.length - 1];
        if (topModal && this.escListeners.has(topModal)) {
          const handler = this.escListeners.get(topModal);
          if (handler) {
            handler();
          } else {
            this.close(topModal);
          }
        }
      }
    });

    // 外側クリックでモーダルを閉じる
    document.addEventListener('click', (e) => {
      if (this.activeModal && e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal-container');
        if (modal === this.activeModal) {
          this.close(modal);
        }
      }
    });
  }

  /**
   * モーダルを開く
   * @param {string} modalId - モーダル要素のID
   * @param {Object} options - オプション
   * @param {Function} options.onClose - クローズ時のコールバック
   * @param {boolean} options.closeOnEsc - ESCキーで閉じるか
   * @param {boolean} options.closeOnOverlayClick - オーバーレイクリックで閉じるか
   */
  open(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with id "${modalId}" not found`);
      return;
    }

    // 既存のモーダルがあれば非表示にする
    if (this.activeModal && this.activeModal !== modal) {
      this.activeModal.classList.add('hidden');
    }

    // モーダルを表示
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // アニメーションクラスを追加
    const content = modal.querySelector('.modal-content, [role="dialog"]');
    if (content) {
      content.classList.add('modal-enter');
      setTimeout(() => {
        content.classList.remove('modal-enter');
      }, 10);
    }

    // スタックに追加
    if (!this.modalStack.includes(modal)) {
      this.modalStack.push(modal);
    }
    
    this.activeModal = modal;

    // ESCキーハンドラの登録
    if (options.closeOnEsc !== false) {
      this.escListeners.set(modal, options.onClose || (() => this.close(modal)));
    }

    // フォーカス管理
    this.manageFocus(modal);

    // body のスクロールを無効化
    document.body.style.overflow = 'hidden';

    return modal;
  }

  /**
   * モーダルを閉じる
   * @param {string|HTMLElement} modalOrId - モーダル要素またはID
   */
  close(modalOrId) {
    const modal = typeof modalOrId === 'string' 
      ? document.getElementById(modalOrId) 
      : modalOrId;

    if (!modal) return;

    // アニメーションクラスを追加
    const content = modal.querySelector('.modal-content, [role="dialog"]');
    if (content) {
      content.classList.add('modal-exit');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        content.classList.remove('modal-exit');
        
        // スタックから削除
        const index = this.modalStack.indexOf(modal);
        if (index > -1) {
          this.modalStack.splice(index, 1);
        }

        // ESCリスナーをクリーンアップ
        this.escListeners.delete(modal);

        // 前のモーダルを表示
        if (this.modalStack.length > 0) {
          const prevModal = this.modalStack[this.modalStack.length - 1];
          prevModal.classList.remove('hidden');
          prevModal.classList.add('flex');
          this.activeModal = prevModal;
          this.manageFocus(prevModal);
        } else {
          this.activeModal = null;
          // すべてのモーダルが閉じたらbodyのスクロールを有効化
          document.body.style.overflow = '';
        }
      }, 200); // アニメーション時間
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  /**
   * すべてのモーダルを閉じる
   */
  closeAll() {
    while (this.modalStack.length > 0) {
      this.close(this.modalStack[this.modalStack.length - 1]);
    }
  }

  /**
   * フォーカス管理
   * @param {HTMLElement} modal - モーダル要素
   */
  manageFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      // 最初のフォーカス可能な要素にフォーカス
      setTimeout(() => {
        focusableElements[0].focus();
      }, 100);

      // タブトラップの実装
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      modal.addEventListener('keydown', function trapTabKey(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      });
    }
  }

  /**
   * 確認ダイアログを表示
   * @param {Object} options - オプション
   * @param {string} options.title - タイトル
   * @param {string} options.message - メッセージ
   * @param {string} options.confirmText - 確認ボタンのテキスト
   * @param {string} options.cancelText - キャンセルボタンのテキスト
   * @param {string} options.type - タイプ (info, warning, error, success)
   * @returns {Promise<boolean>} - 確認された場合true
   */
  async confirm(options = {}) {
    const {
      title = '確認',
      message = '実行してもよろしいですか？',
      confirmText = 'はい',
      cancelText = 'キャンセル',
      type = 'info'
    } = options;

    // 動的に確認ダイアログを作成
    const modalId = 'confirm-modal-' + Date.now();
    const modalHtml = `
      <div id="${modalId}" class="modal-container modal-overlay fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50">
        <div class="modal-content bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center mb-4">
            ${this.getIcon(type)}
            <h3 class="text-lg font-semibold ml-3">${title}</h3>
          </div>
          <p class="text-gray-600 mb-6">${message}</p>
          <div class="flex justify-end space-x-3">
            <button class="modal-cancel px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              ${cancelText}
            </button>
            <button class="modal-confirm px-4 py-2 bg-sp-primary text-white rounded-lg hover:bg-opacity-90 transition">
              ${confirmText}
            </button>
          </div>
        </div>
      </div>
    `;

    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById(modalId);

    return new Promise((resolve) => {
      // 確認ボタン
      modal.querySelector('.modal-confirm').addEventListener('click', () => {
        this.close(modal);
        modal.remove();
        resolve(true);
      });

      // キャンセルボタン
      modal.querySelector('.modal-cancel').addEventListener('click', () => {
        this.close(modal);
        modal.remove();
        resolve(false);
      });

      // モーダルを開く
      this.open(modalId, {
        onClose: () => {
          modal.remove();
          resolve(false);
        }
      });
    });
  }

  /**
   * アラートダイアログを表示
   * @param {Object} options - オプション
   * @param {string} options.title - タイトル
   * @param {string} options.message - メッセージ
   * @param {string} options.buttonText - ボタンのテキスト
   * @param {string} options.type - タイプ (info, warning, error, success)
   */
  async alert(options = {}) {
    const {
      title = '通知',
      message = '',
      buttonText = 'OK',
      type = 'info'
    } = options;

    // 動的にアラートダイアログを作成
    const modalId = 'alert-modal-' + Date.now();
    const modalHtml = `
      <div id="${modalId}" class="modal-container modal-overlay fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50">
        <div class="modal-content bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center mb-4">
            ${this.getIcon(type)}
            <h3 class="text-lg font-semibold ml-3">${title}</h3>
          </div>
          <p class="text-gray-600 mb-6">${message}</p>
          <div class="flex justify-end">
            <button class="modal-ok px-4 py-2 bg-sp-primary text-white rounded-lg hover:bg-opacity-90 transition">
              ${buttonText}
            </button>
          </div>
        </div>
      </div>
    `;

    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById(modalId);

    return new Promise((resolve) => {
      // OKボタン
      modal.querySelector('.modal-ok').addEventListener('click', () => {
        this.close(modal);
        modal.remove();
        resolve();
      });

      // モーダルを開く
      this.open(modalId, {
        onClose: () => {
          modal.remove();
          resolve();
        }
      });
    });
  }

  /**
   * アイコンを取得
   * @param {string} type - タイプ
   * @returns {string} - アイコンHTML
   */
  getIcon(type) {
    const icons = {
      info: '<i class="fas fa-info-circle text-blue-500 text-2xl"></i>',
      warning: '<i class="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>',
      error: '<i class="fas fa-times-circle text-red-500 text-2xl"></i>',
      success: '<i class="fas fa-check-circle text-green-500 text-2xl"></i>'
    };
    return icons[type] || icons.info;
  }
}

// シングルトンインスタンスをエクスポート
export const modalManager = new ModalManager();

// デフォルトエクスポート
export default modalManager;