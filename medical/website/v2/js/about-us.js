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
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Initialize mobile carousel after content is visible
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            initMobileCarousel();
          }, 100);
        }
      }
    });
  }

  // Mobile: Create moderator carousel from table data
  function initMobileCarousel() {
    if (window.innerWidth > 768) return; // Only for mobile
    
    const tableWrap = document.querySelector('.moderators-table-wrap');
    const table = document.querySelector('.moderators-table');
    const dotsContainer = document.getElementById('moderatorsDots');
    
    if (!tableWrap || !table) return;
    
    // Get moderator data from table
    const rows = table.querySelectorAll('tbody tr');
    const moderators = [];
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 5) {
        moderators.push({
          name: cells[0].textContent.trim(),
          languages: cells[1].textContent.trim(),
          strengths: cells[2].textContent.trim(),
          focus: cells[3].textContent.trim(),
          highlights: cells[4].textContent.trim()
        });
      }
    });
    
    if (moderators.length === 0) return;
    
    // Create carousel HTML
    const carouselHTML = `
      <div class="moderators-carousel-container">
        <div class="moderators-carousel-wrapper" id="moderatorsCarousel">
          ${moderators.map(mod => `
            <div class="moderator-card">
              <div class="moderator-card-inner">
                <div class="moderator-field">
                  <span class="moderator-label">Name</span>
                  <div class="moderator-value">${mod.name}</div>
                </div>
                <div class="moderator-field">
                  <span class="moderator-label">Languages</span>
                  <div class="moderator-value">${mod.languages}</div>
                </div>
                <div class="moderator-field">
                  <span class="moderator-label">Core Strengths & Expertise</span>
                  <div class="moderator-value">${mod.strengths}</div>
                </div>
                <div class="moderator-field">
                  <span class="moderator-label">Therapeutic / Target Area Focus</span>
                  <div class="moderator-value">${mod.focus}</div>
                </div>
                <div class="moderator-field">
                  <span class="moderator-label">Highlights</span>
                  <div class="moderator-value">${mod.highlights}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="moderators-carousel-dots" id="moderatorsDots"></div>
    `;
    
    // Replace table with carousel
    tableWrap.innerHTML = carouselHTML;
    
    // Re-query dots container after HTML replacement
    const newDotsContainer = document.getElementById('moderatorsDots');
    
    // Clear and recreate dots
    if (newDotsContainer) {
      newDotsContainer.innerHTML = '';
      moderators.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Show moderator ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        newDotsContainer.appendChild(dot);
      });
    }
    
    // Initialize carousel functionality
    const carousel = document.getElementById('moderatorsCarousel');
    const cards = carousel.querySelectorAll('.moderator-card');
    let currentIndex = 0;
    
    const updateCarousel = () => {
      const cardWidth = carousel.offsetWidth;
      carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      
      // Update dots - use newDotsContainer reference
      const dotsElement = document.getElementById('moderatorsDots');
      if (dotsElement) {
        const dots = dotsElement.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }
    };
    
    // Touch swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      isSwiping = true;
      carousel.style.transition = 'none';
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      
      const diffX = Math.abs(touchCurrentX - touchStartX);
      const diffY = Math.abs(touchCurrentY - touchStartY);
      
      // Prevent vertical scroll if horizontal swipe detected
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      carousel.style.transition = 'transform 0.3s ease';
      
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);
      const absDiffX = Math.abs(diffX);
      const swipeTime = Date.now() - touchStartTime;
      
      // Swipe detection
      const isValidSwipe = (absDiffX > 50 && absDiffX > diffY * 1.5) || 
                          (swipeTime < 300 && absDiffX > 30 && absDiffX > diffY * 1.5);
      
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
      
      isSwiping = false;
      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
    }, { passive: true });
    
    // Initial state
    updateCarousel();
  }

  // Initialize on page load if content is visible and mobile
  if (window.innerWidth <= 768 && content && !content.hidden) {
    setTimeout(() => {
      initMobileCarousel();
    }, 100);
  }
});
