// ===================================
// About Us Page - Moderator Table Expansion
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  initModeratorAccordion();
});

function initModeratorAccordion() {
  const trigger = document.getElementById('moderators-trigger');
  const content = document.getElementById('moderators-content');
  const arrow = trigger?.querySelector('.accordion-arrow');
  
  if (!trigger || !content) return;
  
  trigger.addEventListener('click', function() {
    const isActive = content.classList.contains('active');
    
    if (isActive) {
      // Close
      content.classList.remove('active');
      arrow.classList.remove('active');
      content.style.maxHeight = '0';
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      // Open
      content.classList.add('active');
      arrow.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
      
      // Smooth scroll to view table
      setTimeout(() => {
        content.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 300);
    }
  });
  
  // Keyboard support
  trigger.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
  
  // Make trigger focusable and add ARIA attributes
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'moderators-content');
}

// ===================================
// Download Button Handlers
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const downloadButtons = document.querySelectorAll('.download-buttons .btn');
  
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // In production, this would trigger actual file download
      // For now, show confirmation
      const fileName = this.textContent.trim();
      
      // Add visual feedback
      const originalText = this.textContent;
      this.textContent = 'Downloading...';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = '✓ Downloaded';
        
        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
        }, 2000);
      }, 1000);
      
      console.log(`Download initiated: ${fileName}`);
      
      // In production, replace with:
      // window.location.href = '/path/to/file.pdf';
      // or use fetch API to download
    });
  });
});
