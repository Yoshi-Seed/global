// ===================================
// Global Medical Website - Main JavaScript
// ===================================

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initScrollEffects();
  initSmoothScroll();
  initForms();
});

// ===================================
// MOBILE MENU
// ===================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      
      // Animate hamburger icon
      this.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// ===================================
// SCROLL EFFECTS
// ===================================

function initScrollEffects() {
  const header = document.querySelector('.site-header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===================================
// FORM HANDLING
// ===================================

function initForms() {
  const forms = document.querySelectorAll('form[data-ajax]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit(this);
    });
  });
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');

  // Preserve original label so each form can have its own wording
  const originalBtnLabel = submitBtn ? submitBtn.textContent.trim() : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Opening...';
  }

  const mailtoLink = buildMailtoFromForm(form, formData);

  // Reset early (the user is about to jump into their email app)
  form.reset();

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnLabel || 'Submit';
  }

  if (mailtoLink) {
    showNotification('Opening your email draft…', 'success');
    window.location.href = mailtoLink;
  } else {
    showNotification('Please email us at medb3@seedplanning.co.jp', 'info');
  }
}

// ===================================
// MAILTO HELPERS (static-site friendly)
// ===================================

const DEFAULT_CONTACT_EMAIL = 'medb3@seedplanning.co.jp';

function buildMailtoFromForm(form, formData) {
  try {
    const to = form.dataset.mailtoTo || DEFAULT_CONTACT_EMAIL;
    const subject = form.dataset.mailtoSubject || buildDefaultSubject(formData);
    const body = buildEmailBodyFromForm(form, formData);
    return buildMailtoLink(to, subject, body);
  } catch (err) {
    console.error('Failed to build mailto link:', err);
    return '';
  }
}

function buildDefaultSubject(formData) {
  const company = (formData.get('company') || formData.get('company-name') || '').toString().trim();
  const name = (formData.get('name') || formData.get('full-name') || '').toString().trim();
  const parts = ['Website inquiry — Global Medical'];
  const who = [company, name].filter(Boolean).join(' / ');
  if (who) parts.push(`(${who})`);
  return parts.join(' ');
}

function buildEmailBodyFromForm(form, formData) {
  const lines = [];
  const fields = form.querySelectorAll('input, select, textarea');

  fields.forEach((field) => {
    if (!field.name) return;
    const rawValue = formData.get(field.name);
    const value = (rawValue ?? '').toString().trim();
    if (!value) return;

    const labelText = getLabelTextForField(form, field);
    lines.push(`${labelText}: ${value}`);
  });

  lines.push('');
  lines.push(`Page: ${window.location.href}`);

  return lines.join('\n');
}

function getLabelTextForField(form, field) {
  const fallback = field.name.replace(/[-_]/g, ' ').trim();
  if (!field.id) return fallback;
  const label = form.querySelector(`label[for="${field.id}"]`);
  if (!label) return fallback;
  return label.textContent.replace('*', '').trim() || fallback;
}

function buildMailtoLink(to, subject, body) {
  const encTo = encodeURIComponent(to).replace(/%40/g, '@'); // keep email readable
  const params = new URLSearchParams({
    subject: subject || '',
    body: body || ''
  });
  return `mailto:${encTo}?${params.toString()}`;
}

// ===================================
// NOTIFICATIONS
// ===================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 2rem;
    background-color: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for use in other scripts
window.MedicalSite = {
  showNotification,
  debounce,
  throttle,
  buildMailtoFromForm,
  DEFAULT_CONTACT_EMAIL
};
