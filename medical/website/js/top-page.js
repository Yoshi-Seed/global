// ===================================
// Top Page Interactive Features
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initHoverEffects();
  initVideoBackground();
});

// ===================================
// TABS FUNCTIONALITY
// ===================================

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// ===================================
// HOVER EFFECTS FOR "WHAT MAKES US DIFFERENT"
// ===================================

function initHoverEffects() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    // Create ripple effect on hover
    button.addEventListener('mouseenter', function(e) {
      const text = this.querySelector('.montserrat') || this;
      
      // Add subtle animation
      text.style.transition = 'transform 0.3s ease';
      text.style.transform = 'translateX(5px)';
    });
    
    button.addEventListener('mouseleave', function(e) {
      const text = this.querySelector('.montserrat') || this;
      text.style.transform = 'translateX(0)';
    });
  });
  
  // Info box hover effects
  const infoBoxes = document.querySelectorAll('.info-box');
  
  infoBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
      this.style.backgroundColor = 'rgba(115, 82, 64, 0.22)';
    });
    
    box.addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'rgba(115, 82, 64, 0.16)';
    });
  });
}

// ===================================
// VIDEO BACKGROUND OPTIMIZATION
// ===================================

function initVideoBackground() {
  const video = document.querySelector('.video-background video');
  
  if (!video) return;
  
  // Ensure video plays on mobile devices
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  
  // Play video when it's in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(err => {
          console.log('Video autoplay prevented:', err);
        });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(video);
  
  // Pause video on window blur (performance optimization)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.log('Video play prevented:', err);
      });
    }
  });
}

// ===================================
// SMOOTH SCROLL TO GLOBAL UNITS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const exploreBtn = document.querySelector('a[href="#global-units"]');
  
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetSection = document.getElementById('global-units');
      
      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
});

// ===================================
// FORM VALIDATION ENHANCEMENT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form form');
  
  if (!contactForm) return;
  
  // Add real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });
  
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
      isValid = false;
      showFieldError(field, 'This field is required');
    }
    // Email validation
    else if (field.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        showFieldError(field, 'Please enter a valid email address');
      }
    }
    
    if (isValid) {
      clearFieldError(field);
    }
    
    return isValid;
  }
  
  function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#d32f2f';
    
    let errorMsg = field.parentElement.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.style.cssText = 'color: #d32f2f; font-size: 0.85rem; margin-top: 0.25rem;';
      field.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }
  
  function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
  
  // Form submission validation
  contactForm.addEventListener('submit', function(e) {
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      e.preventDefault();
      
      // Scroll to first error
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
});

// ===================================
// UNIT CARD INTERACTIONS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const unitCards = document.querySelectorAll('.unit-card');
  
  unitCards.forEach(card => {
    // Add entrance animation when scrolling into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'all 0.6s ease-out';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(card);
  });
});
