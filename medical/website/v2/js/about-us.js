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

      // Touch swipe support
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;
      let isDragging = false;

      tbody.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        currentY = startY;
        isDragging = true;
      }, { passive: true });

      tbody.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      }, { passive: true });

      tbody.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const diffY = Math.abs(startY - currentY);
        
        // 縦スクロールではなく横スワイプであることを確認
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
          if (diffX > 0) {
            // 左にスワイプ（次へ）
            if (currentIndex < cards.length - 1) {
              currentIndex++;
              updateCarousel();
            }
          } else {
            // 右にスワイプ（前へ）
            if (currentIndex > 0) {
              currentIndex--;
              updateCarousel();
            }
          }
        }
        
        // リセット
        startX = 0;
        startY = 0;
        currentX = 0;
        currentY = 0;
      }, { passive: true });
    }
  }
});
