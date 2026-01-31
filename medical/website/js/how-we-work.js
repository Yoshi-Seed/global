// ===================================
// How We Work Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  initHowWorkAccordion();
  initTimelineModal();
});

// HOW WE WORK ACCORDION - PPT準拠（常に1つだけ開く）
function initHowWorkAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (!accordionItems.length) return;
  
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    
    if (!trigger || !panel) return;
    
    // クリックハンドラー
    trigger.addEventListener('click', function() {
      const isCurrentlyActive = item.classList.contains('active');
      
      // すべてのアコーディオンを閉じる
      closeAllAccordions();
      
      // クリックした項目が閉じていた場合は開く
      if (!isCurrentlyActive) {
        openAccordion(item);
      }
    });
  });
  
  // すべて閉じる関数
  function closeAllAccordions() {
    accordionItems.forEach(item => {
      item.classList.remove('active');
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
      if (panel) {
        panel.setAttribute('hidden', '');
      }
    });
  }
  
  // 開く関数
  function openAccordion(item) {
    item.classList.add('active');
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
    }
    if (panel) {
      panel.removeAttribute('hidden');
    }
  }
}

// TIMELINE MODAL - 画像拡大表示（スマホ対応）
function initTimelineModal() {
  const timelineImg = document.getElementById('timeline-img');
  const zoomBtn = document.querySelector('.zoom-btn');
  const modal = document.getElementById('timeline-modal');
  
  if (!timelineImg || !zoomBtn || !modal) return;
  
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalClose = modal.querySelector('.modal-close');
  
  // 画像クリックでモーダル表示
  timelineImg.addEventListener('click', openModal);
  
  // ズームボタンクリックでモーダル表示
  zoomBtn.addEventListener('click', openModal);
  
  // モーダルを閉じる
  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  
  // ESCキーで閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
  
  function openModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // スクロール防止
  }
  
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = ''; // スクロール復元
  }
}
