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
        // Calculate card width including margins (left + right)
        const containerWidth = tbody.parentElement.offsetWidth;
        const cardMargins = 40; // 20px left + 20px right
        const cardWidth = containerWidth - cardMargins;
        
        // Total width to slide = card width + margins
        const slideWidth = containerWidth;
        
        // Transform tbody to slide cards
        tbody.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
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

      // Touch swipe support - optimized for iOS (enhanced)
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      let isSwiping = false;
      let touchStartTime = 0;

      tbody.addEventListener('touchstart', (e) => {
        // Use touches[0] for better iOS compatibility
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
        touchStartTime = Date.now();
        isSwiping = true;
        tbody.style.transition = 'none'; // Disable transition during swipe
      }, { passive: true });

      tbody.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        const absDiffX = Math.abs(diffX);
        
        // Prevent vertical scroll if horizontal swipe is detected
        if (absDiffX > diffY && absDiffX > 10) {
          e.preventDefault();
        }
      }, { passive: false }); // passive: false to allow preventDefault

      tbody.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        tbody.style.transition = 'transform 0.3s ease'; // Re-enable transition
        
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        const absDiffX = Math.abs(diffX);
        const swipeTime = Date.now() - touchStartTime;
        
        // More sensitive swipe detection for iPhone
        // Accept if: moved > 40px OR fast swipe (< 300ms and > 20px)
        const isValidSwipe = (absDiffX > 40 && absDiffX > diffY) || 
                            (swipeTime < 300 && absDiffX > 20 && absDiffX > diffY);
        
        if (isValidSwipe) {
          if (diffX > 0) {
            // Left swipe (next)
            if (currentIndex < cards.length - 1) {
              currentIndex++;
              updateCarousel();
            }
          } else {
            // Right swipe (previous)
            if (currentIndex > 0) {
              currentIndex--;
              updateCarousel();
            }
          }
        }
        
        // Reset variables
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
        touchStartTime = 0;
      }, { passive: true });
    }
  }
});
