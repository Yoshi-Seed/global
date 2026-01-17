/**
 * UIコンポーネントモジュール
 * @module ui-components
 */

/**
 * ローディングスピナーを表示
 * @param {string|HTMLElement} container - コンテナ要素またはセレクタ
 * @param {string} message - メッセージ
 */
export function showLoading(container, message = '読み込み中...') {
  const element = typeof container === 'string' 
    ? document.querySelector(container)
    : container;
    
  if (!element) return;
  
  element.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sp-primary"></div>
      <p class="text-gray-500 mt-4">${message}</p>
    </div>
  `;
}

/**
 * 空の状態を表示
 * @param {string|HTMLElement} container - コンテナ要素またはセレクタ
 * @param {Object} options - オプション
 */
export function showEmptyState(container, options = {}) {
  const {
    icon = 'fa-inbox',
    title = 'データがありません',
    message = '条件に一致するデータが見つかりませんでした。',
    actionText = '',
    actionHandler = null
  } = options;
  
  const element = typeof container === 'string' 
    ? document.querySelector(container)
    : container;
    
  if (!element) return;
  
  let actionHtml = '';
  if (actionText && actionHandler) {
    actionHtml = `
      <button class="mt-4 px-4 py-2 bg-sp-primary text-white rounded-lg hover:bg-opacity-90 transition"
              id="empty-state-action">
        ${actionText}
      </button>
    `;
  }
  
  element.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
      <i class="fas ${icon} text-gray-300 text-6xl mb-4"></i>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">${title}</h3>
      <p class="text-gray-500 max-w-md">${message}</p>
      ${actionHtml}
    </div>
  `;
  
  if (actionText && actionHandler) {
    const button = document.getElementById('empty-state-action');
    if (button) {
      button.addEventListener('click', actionHandler);
    }
  }
}

/**
 * トースト通知を表示
 * @param {string} message - メッセージ
 * @param {Object} options - オプション
 */
export function showToast(message, options = {}) {
  const {
    type = 'info',
    duration = 3000,
    position = 'top-right'
  } = options;
  
  // タイプに応じたアイコンと色
  const types = {
    success: { icon: 'fa-check-circle', bg: 'bg-green-500' },
    error: { icon: 'fa-times-circle', bg: 'bg-red-500' },
    warning: { icon: 'fa-exclamation-triangle', bg: 'bg-yellow-500' },
    info: { icon: 'fa-info-circle', bg: 'bg-blue-500' }
  };
  
  const typeConfig = types[type] || types.info;
  
  // トーストコンテナの取得または作成
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = `fixed z-50 flex flex-col gap-2 ${getPositionClass(position)}`;
    document.body.appendChild(container);
  }
  
  // トースト要素の作成
  const toast = document.createElement('div');
  toast.className = `${typeConfig.bg} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md transform transition-all duration-300 translate-x-full`;
  toast.innerHTML = `
    <i class="fas ${typeConfig.icon} text-xl"></i>
    <p class="flex-1">${message}</p>
    <button class="hover:opacity-70 transition">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  // アニメーション開始
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full');
    toast.classList.add('translate-x-0');
  });
  
  // 閉じるボタン
  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => removeToast(toast));
  
  // 自動削除
  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }
  
  function removeToast(element) {
    element.classList.add('translate-x-full');
    setTimeout(() => {
      element.remove();
      // コンテナが空になったら削除
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }
  
  function getPositionClass(pos) {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };
    return positions[pos] || positions['top-right'];
  }
}

/**
 * プログレスバーを表示
 * @param {number} value - 現在の値
 * @param {number} max - 最大値
 * @param {string|HTMLElement} container - コンテナ要素またはセレクタ
 */
export function showProgressBar(value, max, container) {
  const element = typeof container === 'string' 
    ? document.querySelector(container)
    : container;
    
  if (!element) return;
  
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  element.innerHTML = `
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div class="bg-sp-primary h-2.5 rounded-full transition-all duration-300" 
           style="width: ${percentage}%"></div>
    </div>
    <div class="flex justify-between text-sm text-gray-600 mt-1">
      <span>${value} / ${max}</span>
      <span>${percentage.toFixed(0)}%</span>
    </div>
  `;
}

/**
 * バッジコンポーネントを作成
 * @param {string} text - テキスト
 * @param {string} type - タイプ
 * @returns {string} - HTML文字列
 */
export function createBadge(text, type = 'default') {
  const badges = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  };
  
  const className = badges[type] || badges.default;
  
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}">
    ${text}
  </span>`;
}

/**
 * スケルトンローダーを表示
 * @param {string|HTMLElement} container - コンテナ要素またはセレクタ
 * @param {number} count - 表示数
 */
export function showSkeletonLoader(container, count = 3) {
  const element = typeof container === 'string' 
    ? document.querySelector(container)
    : container;
    
  if (!element) return;
  
  const skeletons = [];
  for (let i = 0; i < count; i++) {
    skeletons.push(`
      <div class="bg-white rounded-lg p-4 shadow-sm animate-pulse">
        <div class="flex items-center justify-between mb-3">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    `);
  }
  
  element.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${skeletons.join('')}
    </div>
  `;
}

/**
 * ツールチップを初期化
 * @param {string} selector - セレクタ
 */
export function initTooltips(selector = '[data-tooltip]') {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    const text = element.getAttribute('data-tooltip');
    const position = element.getAttribute('data-tooltip-position') || 'top';
    
    let tooltip = null;
    
    element.addEventListener('mouseenter', (e) => {
      tooltip = document.createElement('div');
      tooltip.className = 'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200 opacity-0';
      tooltip.textContent = text;
      document.body.appendChild(tooltip);
      
      positionTooltip(tooltip, element, position);
      
      requestAnimationFrame(() => {
        tooltip.classList.remove('opacity-0');
      });
    });
    
    element.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.classList.add('opacity-0');
        setTimeout(() => {
          tooltip.remove();
          tooltip = null;
        }, 200);
      }
    });
  });
  
  function positionTooltip(tooltip, target, position) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top, left;
    
    switch(position) {
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
      default: // top
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
    }
    
    // 画面端の調整
    const margin = 10;
    if (left < margin) left = margin;
    if (left + tooltipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - tooltipRect.width - margin;
    }
    if (top < margin) top = rect.bottom + 8;
    if (top + tooltipRect.height > window.innerHeight - margin) {
      top = rect.top - tooltipRect.height - 8;
    }
    
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left + window.scrollX}px`;
  }
}

/**
 * ドロップダウンメニューを初期化
 * @param {string} triggerSelector - トリガーセレクタ
 */
export function initDropdowns(triggerSelector = '[data-dropdown-trigger]') {
  const triggers = document.querySelectorAll(triggerSelector);
  
  triggers.forEach(trigger => {
    const menuId = trigger.getAttribute('data-dropdown-trigger');
    const menu = document.getElementById(menuId);
    
    if (!menu) return;
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(menu);
    });
    
    // メニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        closeDropdown(menu);
      }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown(menu);
      }
    });
  });
  
  function toggleDropdown(menu) {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      openDropdown(menu);
    } else {
      closeDropdown(menu);
    }
  }
  
  function openDropdown(menu) {
    menu.classList.remove('hidden');
    menu.classList.add('animate-fade-in');
  }
  
  function closeDropdown(menu) {
    menu.classList.add('hidden');
    menu.classList.remove('animate-fade-in');
  }
}

// エクスポート
export default {
  showLoading,
  showEmptyState,
  showToast,
  showProgressBar,
  createBadge,
  showSkeletonLoader,
  initTooltips,
  initDropdowns
};