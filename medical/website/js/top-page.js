// ===================================
// Top Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initWhySeedInteraction();
  initSmoothScroll();
  initVideoControl();
});

// WHY SEED SECTION - Interactive option cards
function initWhySeedInteraction() {
  const optionCards = document.querySelectorAll('.option-card');
  const contentDetails = document.querySelectorAll('.content-details');
  
  if (!optionCards.length || !contentDetails.length) return;
  
  optionCards.forEach(card => {
    card.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      
      // Remove active class from all cards
      optionCards.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked card
      this.classList.add('active');
      
      // Hide all content details
      contentDetails.forEach(content => content.classList.remove('active'));
      
      // Show target content with fade animation
      const targetContent = document.getElementById(`${target}-content`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
    
    // Keyboard accessibility
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// SMOOTH SCROLL - For anchor links
function initSmoothScroll() {
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// VIDEO BACKGROUND - Auto play/pause based on visibility
function initVideoControl() {
  const videoElements = document.querySelectorAll('.video-background video');
  
  if (!videoElements.length) return;
  
  // Intersection Observer for performance
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      
      if (entry.isIntersecting) {
        // Video is at least 50% visible
        video.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      } else {
        // Video is less than 50% visible
        video.pause();
      }
    });
  }, observerOptions);
  
  videoElements.forEach(video => {
    // Set video attributes for better mobile compatibility
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    
    // Observe the video
    observer.observe(video);
  });
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', function() {
    videoElements.forEach(video => {
      if (document.hidden) {
        video.pause();
      } else {
        // Check if video is in viewport before playing
        const rect = video.getBoundingClientRect();
        const isVisible = (
          rect.top < window.innerHeight &&
          rect.bottom > 0
        );
        
        if (isVisible) {
          video.play().catch(err => {
            console.log('Video play prevented:', err);
          });
        }
      }
    });
  });
}

// FORM HANDLING - Simple form submission (if contact form exists on page)
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Form data:', data);
    
    // Show success message (you can customize this)
    alert('Thank you for your inquiry. We will contact you soon.');
    
    // Reset form
    this.reset();
  });
}
