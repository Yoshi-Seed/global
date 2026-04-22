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
    currentIndex = index;
    const cardWidth = cards[0].offsetWidth;
    const gap = 16;
    const containerPadding = window.innerWidth * 0.05;
    const offset = -(cardWidth + gap) * index;
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }
  
  // Scroll snap support
  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 16;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
      }
    }
  });
  
  // Recalculate on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      goToTestimonial(currentIndex);
    }
  });
}
