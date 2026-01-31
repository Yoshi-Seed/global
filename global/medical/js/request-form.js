// ===================================
// Request Form Handler
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('request-form');
  const submitBtn = document.getElementById('submit-btn');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  if (!form) return;
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Disable submit button and show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Submitting...';
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Success scenario
      handleSuccess();
      
      // For actual implementation, use:
      // submitFormData(data)
      //   .then(handleSuccess)
      //   .catch(handleError);
    }, 1500);
  });
  
  // Real-time validation
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Clear error on input
      if (this.parentElement.classList.contains('error')) {
        this.parentElement.classList.remove('error');
        const errorText = this.parentElement.querySelector('.error-text');
        if (errorText) errorText.remove();
      }
    });
  });
  
  function validateForm() {
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstError.querySelector('input, select, textarea');
        if (input) input.focus();
      }
    }
    
    return isValid;
  }
  
  function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.parentElement;
    let isValid = true;
    let errorMsg = '';
    
    // Clear previous errors
    fieldGroup.classList.remove('error');
    const existingError = fieldGroup.querySelector('.error-text');
    if (existingError) existingError.remove();
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
      isValid = false;
      errorMsg = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
      }
    }
    // Phone validation (basic)
    else if (field.type === 'tel' && value !== '') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid phone number';
      }
    }
    
    if (!isValid) {
      fieldGroup.classList.add('error');
      const errorText = document.createElement('span');
      errorText.className = 'error-text';
      errorText.textContent = errorMsg;
      fieldGroup.appendChild(errorText);
    }
    
    return isValid;
  }
  
  function handleSuccess() {
    // Hide form
    form.style.display = 'none';
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset form (for "Submit Another Request" button)
    form.reset();
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Submit Request';
    
    // Send confirmation email notification (pseudo-code)
    console.log('Form submitted successfully');
  }
  
  function handleError(error) {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Submit Request';
    
    // Show error message
    errorMessage.style.display = 'block';
    
    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    console.error('Form submission error:', error);
  }
  
  // Actual API submission function (to be implemented)
  async function submitFormData(data) {
    // Example implementation:
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Submission failed');
    // }
    // 
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }
});

// ===================================
// Prevent double submission
// ===================================

window.addEventListener('beforeunload', function(e) {
  const form = document.getElementById('request-form');
  const submitBtn = document.getElementById('submit-btn');
  
  if (form && submitBtn && submitBtn.disabled) {
    e.preventDefault();
    e.returnValue = 'Your form is being submitted. Are you sure you want to leave?';
  }
});
