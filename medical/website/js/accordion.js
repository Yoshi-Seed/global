// ===================================
// Accordion Component
// ===================================

class Accordion {
  constructor(element) {
    this.accordion = element;
    this.items = element.querySelectorAll('.accordion-item');
    this.allowMultiple = element.dataset.multiple === 'true';
    
    this.init();
  }
  
  init() {
    this.items.forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');
      
      if (!header || !content) return;
      
      // Set unique IDs for accessibility
      const itemId = `accordion-item-${Date.now()}-${index}`;
      header.setAttribute('id', `${itemId}-header`);
      content.setAttribute('id', `${itemId}-content`);
      
      // ARIA attributes
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', `${itemId}-content`);
      content.setAttribute('aria-labelledby', `${itemId}-header`);
      
      // Click handler
      header.addEventListener('click', () => {
        this.toggle(item);
      });
      
      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(item);
        }
      });
      
      // Make header focusable
      header.setAttribute('tabindex', '0');
    });
  }
  
  toggle(item) {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    const isActive = content.classList.contains('active');
    
    // Close all items if multiple not allowed
    if (!this.allowMultiple && !isActive) {
      this.closeAll();
    }
    
    // Toggle current item
    if (isActive) {
      this.close(item);
    } else {
      this.open(item);
    }
  }
  
  open(item) {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    
    content.classList.add('active');
    if (icon) icon.classList.add('active');
    
    header.setAttribute('aria-expanded', 'true');
    
    // Smooth animation
    content.style.maxHeight = content.scrollHeight + 'px';
  }
  
  close(item) {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    
    content.classList.remove('active');
    if (icon) icon.classList.remove('active');
    
    header.setAttribute('aria-expanded', 'false');
    
    content.style.maxHeight = '0';
  }
  
  closeAll() {
    this.items.forEach(item => {
      this.close(item);
    });
  }
  
  openAll() {
    this.items.forEach(item => {
      this.open(item);
    });
  }
}

// Initialize all accordions
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    new Accordion(accordion);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}

// Export for manual initialization
window.Accordion = Accordion;
