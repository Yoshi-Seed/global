// Microsites Toggle
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('microsites-trigger');
  const content = document.getElementById('microsites-content');

  if (trigger && content) {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      trigger.setAttribute('aria-expanded', !isExpanded);
      
      if (isExpanded) {
        content.setAttribute('hidden', '');
      } else {
        content.removeAttribute('hidden');
      }
    });
  }
});
