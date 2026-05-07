// About Team page interactions
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('moderators-trigger');
  const content = document.getElementById('moderators-content');

  console.log('DOM loaded', { trigger, content });

  if (trigger && content) {
    console.log('Trigger and content found, adding click listener');
    
    trigger.addEventListener('click', (e) => {
      console.log('Trigger clicked!', e);
      
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isExpanded));

      console.log('Toggle expansion:', { isExpanded, newState: !isExpanded });

      if (isExpanded) {
        content.hidden = true;
      } else {
        content.hidden = false;
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Initialize mobile carousel after content is visible
        if (window.innerWidth <= 768) {
          console.log('Mobile detected, initializing carousel');
          setTimeout(() => {
            initMobileCarousel();
          }, 100);
        }
      }
    });
  } else {
    console.error('Trigger or content not found!', { trigger, content });
  }

  // Mobile: Create moderator carousel from table data
  function initMobileCarousel() {
    if (window.innerWidth > 768) return; // Only for mobile
    
    const tableWrap = document.querySelector('.moderators-table-wrap');
    const table = document.querySelector('.moderators-table');
    
    if (!tableWrap || !table) {
      console.error('Table wrap or table not found!');
      return;
    }
    
    // Check if carousel already exists
    if (document.getElementById('moderatorsCarousel')) {
      console.log('Carousel already initialized');
      return;
    }
    
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
    
    console.log('Moderators data:', moderators);
    
    if (moderators.length === 0) {
      console.error('No moderators data found!');
      return;
    }
    
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
        <div class="moderators-carousel-dots" id="moderatorsDots"></div>
      </div>
    `;
    
    // Replace table with carousel
    tableWrap.innerHTML = carouselHTML;
    
    console.log('Carousel HTML inserted');
    
    // Wait for DOM update
    setTimeout(() => {
      // Re-query elements after HTML replacement
      const carousel = document.getElementById('moderatorsCarousel');
      const newDotsContainer = document.getElementById('moderatorsDots');
      
      if (!carousel || !newDotsContainer) {
        console.error('Carousel or dots container not found after insertion!');
        return;
      }
      
      const cards = carousel.querySelectorAll('.moderator-card');
      let currentIndex = 0;
      
      console.log('Carousel elements found:', { carousel, cards: cards.length, dots: newDotsContainer });
      
      const updateCarousel = () => {
        // Get the width of a single card (not the carousel wrapper)
        const card = cards[0];
        const cardWidth = card ? card.offsetWidth : carousel.offsetWidth;
        const translateX = currentIndex * cardWidth;
        carousel.style.transform = `translateX(-${translateX}px)`;
        console.log('Update carousel:', { currentIndex, cardWidth, translateX, carouselWidth: carousel.offsetWidth });
        
        // Update dots
        const dots = newDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      };
      
      // Clear and recreate dots
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
    }, 100); // Close setTimeout
  }

  // Initialize on page load if content is visible and mobile
  if (window.innerWidth <= 768 && content && !content.hidden) {
    setTimeout(() => {
      initMobileCarousel();
    }, 100);
  }
});
