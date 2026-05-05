// How We Work Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initTipsCarousel();
  initTestimonialCarousel();
});

// TIPS CAROUSEL - Horizontal sliding carousel
function initTipsCarousel() {
  const track = document.querySelector('.tips-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  const cards = document.querySelectorAll('.tip-card');
  
  if (!track || !dotsContainer || !cards.length) return;
  
  let currentIndex = 0;
  const totalCards = cards.length;
  const cardsPerView = window.innerWidth > 1024 ? 2 : 1;
  const totalSlides = Math.ceil(totalCards / cardsPerView);
  
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  
  function goToSlide(index) {
    currentIndex = index;
    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const offset = -(cardWidth + gap) * index * cardsPerView;
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }
  
  // Touch/Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - go to next slide
        if (currentIndex < totalSlides - 1) {
          goToSlide(currentIndex + 1);
        }
      } else {
        // Swipe right - go to previous slide
        if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
        }
      }
    }
  }
  
  // Auto-advance disabled
  // setInterval(() => {
  //   currentIndex = (currentIndex + 1) % totalSlides;
  //   goToSlide(currentIndex);
  // }, 5000);
  
  // Recalculate on resize
  window.addEventListener('resize', () => {
    goToSlide(currentIndex);
  });
}

// TESTIMONIAL CAROUSEL - Mobile only
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (!track || !dotsContainer) return;
  
  // Only initialize on mobile
  if (window.innerWidth > 768) return;
  
  // Get only cards within the carousel (mobile version)
  const cards = track.querySelectorAll('.testimonial-card');
  
  if (!cards.length) return;
  
  let currentIndex = 0;
  const totalCards = cards.length;
  
  // Create dots
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot';
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => goToTestimonial(i));
    dotsContainer.appendChild(dot);
  }
  
  const dots = dotsContainer.querySelectorAll('.testimonial-dot');
  
  function goToTestimonial(index) {
    // インデックスの境界チェック
    if (index < 0 || index >= totalCards) {
      return;
    }
    
    currentIndex = index;
    const card = cards[index];
    
    if (card) {
      // カードの左端位置を取得
      const cardLeft = card.offsetLeft;
      const trackWidth = track.offsetWidth;
      const cardWidth = card.offsetWidth;
      const padding = trackWidth * 0.05;
      
      // カードを中央に配置するためのスクロール位置を計算
      const scrollPosition = cardLeft - (trackWidth - cardWidth) / 2;
      
      track.scrollTo({
        left: Math.max(0, scrollPosition), // 負の値を防ぐ
        behavior: 'smooth'
      });
    }
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
      dots[index].classList.add('active');
    }
  }
  
  // Scroll snap support - update dots based on scroll position
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    // デバウンス処理：スクロールが停止してから実行
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = track.scrollLeft;
      const trackWidth = track.offsetWidth;
      const padding = trackWidth * 0.05;
      
      // 各カードの中心位置を計算して、最も近いものを選択
      let closestIndex = 0;
      let minDistance = Infinity;
      
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 - padding;
        const viewportCenter = scrollLeft + trackWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });
      
      if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
          dots[currentIndex].classList.add('active');
        }
      }
    }, 100);
  }, { passive: true });
  
  // Recalculate on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      goToTestimonial(currentIndex);
    }
  });
}
