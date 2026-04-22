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
      let currentX = 0;

      tbody.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });

      tbody.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
      });

      tbody.addEventListener('touchend', () => {
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 50) {
          if (diffX > 0 && currentIndex < cards.length - 1) {
            currentIndex++;
          } else if (diffX < 0 && currentIndex > 0) {
            currentIndex--;
          }
          updateCarousel();
        }
      });
    }
  }
});
