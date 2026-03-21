// How We Work Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initTipsCarousel();
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
  
  // Auto-advance every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
  }, 5000);
  
  // Recalculate on resize
  window.addEventListener('resize', () => {
    goToSlide(currentIndex);
  });
}
