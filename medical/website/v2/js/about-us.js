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
        
        // Initialize carousel after content is visible (for mobile)
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            initMobileCarousel();
          }, 100);
        }
      }
    });
  }

  // Mobile: Moderators carousel initialization
  function initMobileCarousel() {
    const tbody = document.querySelector('.moderators-table tbody');
    const dotsContainer = document.getElementById('moderatorsDots');
    
    if (!tbody || !dotsContainer) return;
    
    // Clear existing dots if any
    dotsContainer.innerHTML = '';
    
    const cards = tbody.querySelectorAll('tr');
    if (cards.length === 0) return;
    
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
      // Get the actual width of the table wrap container
      const tableWrap = tbody.closest('.moderators-table-wrap');
      if (!tableWrap) return;
      
      const containerWidth = tableWrap.offsetWidth;
      
      // Each card takes full container width (including its margins)
      // The card itself is calc(100% - 40px) with 20px margin on each side
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

    // Touch swipe support - optimized for iOS
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      isSwiping = true;
      
      // Disable transition during swipe for smooth dragging
      tbody.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      
      const diffX = Math.abs(touchCurrentX - touchStartX);
      const diffY = Math.abs(touchCurrentY - touchStartY);
      
      // If horizontal movement is greater than vertical, prevent default (vertical scroll)
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      // Re-enable transition
      tbody.style.transition = 'transform 0.3s ease';
      
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);
      const absDiffX = Math.abs(diffX);
      const swipeTime = Date.now() - touchStartTime;
      
      // Swipe detection: moved > 50px OR fast swipe (< 300ms and > 30px)
      // Must be more horizontal than vertical
      const isValidSwipe = (absDiffX > 50 && absDiffX > diffY * 1.5) || 
                          (swipeTime < 300 && absDiffX > 30 && absDiffX > diffY * 1.5);
      
      if (isValidSwipe) {
        if (diffX > 0) {
          // Left swipe (next card)
          if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateCarousel();
          }
        } else {
          // Right swipe (previous card)
          if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
          }
        }
      }
      
      // Reset swipe state
      isSwiping = false;
      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
    };

    // Remove old event listeners if they exist
    tbody.removeEventListener('touchstart', handleTouchStart);
    tbody.removeEventListener('touchmove', handleTouchMove);
    tbody.removeEventListener('touchend', handleTouchEnd);
    
    // Add event listeners
    tbody.addEventListener('touchstart', handleTouchStart, { passive: true });
    tbody.addEventListener('touchmove', handleTouchMove, { passive: false });
    tbody.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Initial carousel state
    updateCarousel();
  }

  // Initialize carousel on page load if mobile and content is visible
  if (window.innerWidth <= 768 && content && !content.hidden) {
    setTimeout(() => {
      initMobileCarousel();
    }, 100);
  }
});
