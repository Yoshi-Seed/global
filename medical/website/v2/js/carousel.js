// ===================================
// Carousel Component
// ===================================

class Carousel {
  constructor(element, options = {}) {
    this.carousel = element;
    this.container = element.querySelector('.carousel-container');
    this.slides = element.querySelectorAll('.carousel-slide');
    this.currentIndex = 0;
    
    // Options
    this.options = {
      autoPlay: options.autoPlay || false,
      autoPlayInterval: options.autoPlayInterval || 5000,
      loop: options.loop !== undefined ? options.loop : true,
      showDots: options.showDots !== undefined ? options.showDots : true,
      showControls: options.showControls !== undefined ? options.showControls : true
    };
    
    this.init();
  }
  
  init() {
    if (this.slides.length <= 1) return;
    
    // Create controls
    if (this.options.showControls) {
      this.createControls();
    }
    
    // Create dots
    if (this.options.showDots) {
      this.createDots();
    }
    
    // Auto play
    if (this.options.autoPlay) {
      this.startAutoPlay();
      
      // Pause on hover
      this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    // Touch support
    this.initTouchSupport();
  }
  
  createControls() {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-prev';
    prevBtn.innerHTML = '←';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.addEventListener('click', () => this.prev());
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-next';
    nextBtn.innerHTML = '→';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.addEventListener('click', () => this.next());
    
    wrapper.appendChild(prevBtn);
    this.controlsWrapper = wrapper;
    this.nextBtn = nextBtn;
    this.carousel.appendChild(wrapper);
  }
  
  createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      
      if (index === 0) {
        dot.classList.add('active');
      }
      
      dot.addEventListener('click', () => this.goTo(index));
      dotsContainer.appendChild(dot);
    });
    
    this.controlsWrapper.appendChild(dotsContainer);
    this.controlsWrapper.appendChild(this.nextBtn);
    this.dots = dotsContainer.querySelectorAll('.carousel-dot');
  }
  
  goTo(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    this.currentIndex = index;
    const offset = -100 * index;
    this.container.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    if (this.dots) {
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }
  
  next() {
    let nextIndex = this.currentIndex + 1;
    
    if (nextIndex >= this.slides.length) {
      nextIndex = this.options.loop ? 0 : this.currentIndex;
    }
    
    this.goTo(nextIndex);
  }
  
  prev() {
    let prevIndex = this.currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = this.options.loop ? this.slides.length - 1 : 0;
    }
    
    this.goTo(prevIndex);
  }
  
  startAutoPlay() {
    this.autoPlayTimer = setInterval(() => this.next(), this.options.autoPlayInterval);
  }
  
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }
  
  initTouchSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    this.carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });
    
    this.carousel.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const diff = startX - currentX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      isDragging = false;
    });
  }
}

// Initialize all carousels
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const autoPlay = carousel.dataset.autoplay === 'true';
    const interval = parseInt(carousel.dataset.interval) || 5000;
    
    new Carousel(carousel, {
      autoPlay: autoPlay,
      autoPlayInterval: interval,
      loop: true,
      showDots: true,
      showControls: true
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}

// Export for manual initialization
window.Carousel = Carousel;
