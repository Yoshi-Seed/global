/**
 * Project Tracker - ページネーションモジュール
 * 
 * リストのページ分割と表示制御を管理
 */

class ProjectPagination {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.totalItems = 0;
    this.totalPages = 0;
    
    this.itemsPerPageOptions = [10, 20, 50, 100];
    
    this.callbacks = {
      onPageChange: null,
      onItemsPerPageChange: null
    };
  }

  /**
   * 初期化
   */
  initialize(config = {}) {
    this.callbacks = config.callbacks || {};
    this.itemsPerPage = config.itemsPerPage || 20;
    
    // URLパラメータから読み込み
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const perPage = params.get('perPage');
    
    if (page) {
      this.currentPage = parseInt(page);
    }
    if (perPage) {
      this.itemsPerPage = parseInt(perPage);
    }
    
    this.attachEventListeners();
  }

  /**
   * 総アイテム数を設定
   */
  setTotalItems(count) {
    this.totalItems = count;
    this.totalPages = Math.ceil(count / this.itemsPerPage);
    
    // 現在のページが範囲外の場合は修正
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    
    this.render();
  }

  /**
   * 現在のページのアイテム範囲を取得
   */
  getCurrentRange() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(start + this.itemsPerPage, this.totalItems);
    
    return {
      start,
      end,
      count: end - start
    };
  }

  /**
   * ページを変更
   */
  goToPage(page) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    
    this.currentPage = page;
    this.updateURL();
    
    if (this.callbacks.onPageChange) {
      this.callbacks.onPageChange(this.currentPage);
    }
    
    this.render();
  }

  /**
   * 次のページへ
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * 前のページへ
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * 最初のページへ
   */
  firstPage() {
    this.goToPage(1);
  }

  /**
   * 最後のページへ
   */
  lastPage() {
    this.goToPage(this.totalPages);
  }

  /**
   * 1ページあたりのアイテム数を変更
   */
  setItemsPerPage(count) {
    const oldItemsPerPage = this.itemsPerPage;
    this.itemsPerPage = count;
    
    // ページ数を再計算
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // 現在表示中のアイテムが含まれるページを計算
    const currentItemIndex = (this.currentPage - 1) * oldItemsPerPage;
    this.currentPage = Math.floor(currentItemIndex / this.itemsPerPage) + 1;
    
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    
    this.updateURL();
    
    if (this.callbacks.onItemsPerPageChange) {
      this.callbacks.onItemsPerPageChange(this.itemsPerPage);
    }
    
    this.render();
  }

  /**
   * URLパラメータを更新
   */
  updateURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (this.currentPage > 1) {
      params.set('page', this.currentPage);
    } else {
      params.delete('page');
    }
    
    if (this.itemsPerPage !== 20) {
      params.set('perPage', this.itemsPerPage);
    } else {
      params.delete('perPage');
    }
    
    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newURL);
  }

  /**
   * イベントリスナーのアタッチ
   */
  attachEventListeners() {
    // ページボタン
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-page]')) {
        const page = parseInt(e.target.dataset.page);
        this.goToPage(page);
        e.preventDefault();
      }
      
      if (e.target.matches('[data-page-action]')) {
        const action = e.target.dataset.pageAction;
        switch (action) {
          case 'first':
            this.firstPage();
            break;
          case 'previous':
            this.previousPage();
            break;
          case 'next':
            this.nextPage();
            break;
          case 'last':
            this.lastPage();
            break;
        }
        e.preventDefault();
      }
    });
    
    // アイテム数変更
    const perPageSelect = document.getElementById('itemsPerPageSelect');
    if (perPageSelect) {
      perPageSelect.addEventListener('change', (e) => {
        this.setItemsPerPage(parseInt(e.target.value));
      });
    }
  }

  /**
   * ページネーションUIをレンダリング
   */
  render() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    
    if (this.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }
    
    let html = '<nav aria-label="Pagination" class="flex items-center justify-between">';
    html += '<div class="flex items-center space-x-2">';
    
    // 最初のページボタン
    html += `
      <button data-page-action="first" 
              class="px-3 py-2 text-sm border rounded-md ${this.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}"
              ${this.currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-angle-double-left"></i>
      </button>
    `;
    
    // 前のページボタン
    html += `
      <button data-page-action="previous"
              class="px-3 py-2 text-sm border rounded-md ${this.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}"
              ${this.currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-angle-left"></i>
      </button>
    `;
    
    // ページ番号ボタン
    const pageNumbers = this.getPageNumbers();
    pageNumbers.forEach(page => {
      if (page === '...') {
        html += '<span class="px-3 py-2 text-sm text-gray-500">...</span>';
      } else {
        const isActive = page === this.currentPage;
        html += `
          <button data-page="${page}"
                  class="px-3 py-2 text-sm border rounded-md ${isActive ? 'bg-sp-primary text-white' : 'bg-white hover:bg-gray-50'}">
            ${page}
          </button>
        `;
      }
    });
    
    // 次のページボタン
    html += `
      <button data-page-action="next"
              class="px-3 py-2 text-sm border rounded-md ${this.currentPage === this.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}"
              ${this.currentPage === this.totalPages ? 'disabled' : ''}>
        <i class="fas fa-angle-right"></i>
      </button>
    `;
    
    // 最後のページボタン
    html += `
      <button data-page-action="last"
              class="px-3 py-2 text-sm border rounded-md ${this.currentPage === this.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}"
              ${this.currentPage === this.totalPages ? 'disabled' : ''}>
        <i class="fas fa-angle-double-right"></i>
      </button>
    `;
    
    html += '</div>';
    
    // ページ情報
    const range = this.getCurrentRange();
    html += `
      <div class="text-sm text-gray-600">
        ${range.start + 1} - ${range.end} / ${this.totalItems}件
      </div>
    `;
    
    html += '</nav>';
    
    container.innerHTML = html;
    
    // 別の場所の情報表示も更新
    this.updateInfoDisplays();
  }

  /**
   * ページ番号のリストを生成
   */
  getPageNumbers() {
    const pages = [];
    const maxVisible = 7; // 表示する最大ページ数
    
    if (this.totalPages <= maxVisible) {
      // すべてのページを表示
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 省略表示
      if (this.currentPage <= 4) {
        // 最初の方のページ
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        // 最後の方のページ
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 中間のページ
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  /**
   * 情報表示を更新
   */
  updateInfoDisplays() {
    // 上部のページ情報
    const topInfo = document.getElementById('paginationInfo');
    if (topInfo) {
      const range = this.getCurrentRange();
      topInfo.textContent = `${range.start + 1}-${range.end} / ${this.totalItems}件`;
    }
    
    // 下部のページ情報
    const bottomInfo = document.getElementById('paginationInfoBottom');
    if (bottomInfo) {
      const range = this.getCurrentRange();
      bottomInfo.textContent = `${range.start + 1}-${range.end} / ${this.totalItems}件`;
    }
    
    // アイテム数セレクト
    const perPageSelect = document.getElementById('itemsPerPageSelect');
    if (perPageSelect) {
      perPageSelect.value = this.itemsPerPage;
    }
  }

  /**
   * リセット
   */
  reset() {
    this.currentPage = 1;
    this.updateURL();
    this.render();
  }

  /**
   * 現在の状態を取得
   */
  getState() {
    return {
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      totalItems: this.totalItems,
      totalPages: this.totalPages
    };
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.ProjectPagination = ProjectPagination;
}