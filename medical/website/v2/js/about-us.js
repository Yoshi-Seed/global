// About Team page interactions
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('moderators-trigger');
  const content = document.getElementById('moderators-content');

  if (trigger && content) {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isExpanded));

      if (isExpanded) {
        content.hidden = true;
      } else {
        content.hidden = false;
        // Optional: bring content into view smoothly (with minimal scroll)
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Mobile: Moderators carousel
  const isMobile = () => window.innerWidth <= 768;
  
  if (isMobile()) {
    const tbody = document.querySelector('.moderators-table tbody');
    const dotsContainer = document.getElementById('moderatorsDots');
    
    if (tbody && dotsContainer) {
      const cards = tbody.querySelectorAll('tr');
      let currentIndex = 0;

      // Create dots
      cards.forEach((card, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Show moderator ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        
        dotsContainer.appendChild(dot);
      });

      const updateCarousel = () => {
        // Transform tbody to slide cards
        tbody.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
          if (index === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      };

      // Touch swipe support - improved for iOS
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      let isSwiping = false;

      const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
      };

      const handleTouchMove = (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
      };

      const handleTouchEnd = () => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        const absDiffX = Math.abs(diffX);
        
        // 横スワイプの判定：50px以上かつ横方向が縦方向より大きい
        if (absDiffX > 50 && absDiffX > diffY) {
          if (diffX > 0) {
            // 左にスワイプ（次へ）
            if (currentIndex < cards.length - 1) {
              currentIndex++;
              updateCarousel();
            }
          } else if (diffX < 0) {
            // 右にスワイプ（前へ）
            if (currentIndex > 0) {
              currentIndex--;
              updateCarousel();
            }
          }
        }
        
        // 変数をリセット
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
      };

      tbody.addEventListener('touchstart', handleTouchStart, { passive: true });
      tbody.addEventListener('touchmove', handleTouchMove, { passive: true });
      tbody.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }
});
