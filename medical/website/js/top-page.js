// ===================================
// Top Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initWhySeedInteraction();
  initVideoControl();
  initVideoCrossfade();
});

// WHY SEED SECTION - Interactive option cards
function initWhySeedInteraction() {
  const optionCards = document.querySelectorAll('.option-card');
  const contentDetails = document.querySelectorAll('.content-details');
  
  if (!optionCards.length || !contentDetails.length) return;
  
  optionCards.forEach(card => {
    card.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      
      // Remove active class from all cards and update aria-selected
      optionCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      
      // Add active class to clicked card and update aria-selected
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      
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

// VIDEO BACKGROUND - Auto play/pause based on visibility
function initVideoControl() {
  const videoElements = document.querySelectorAll('.background-video');
  
  if (!videoElements.length) return;
  
  // Intersection Observer for performance
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const videos = entry.target.querySelectorAll('.background-video');
      
      if (entry.isIntersecting) {
        // Section is at least 50% visible
        videos.forEach(video => {
          if (video.classList.contains('active')) {
            video.play().catch(err => {
              console.log('Video autoplay prevented:', err);
            });
          }
        });
      } else {
        // Section is less than 50% visible
        videos.forEach(video => {
          video.pause();
        });
      }
    });
  }, observerOptions);
  
  const videoSection = document.querySelector('.global-units-section');
  if (videoSection) {
    observer.observe(videoSection);
  }
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', function() {
    videoElements.forEach(video => {
      if (document.hidden) {
        video.pause();
      } else {
        // Check if video section is in viewport before playing
        const section = video.closest('.global-units-section');
        if (section) {
          const rect = section.getBoundingClientRect();
          const isVisible = (
            rect.top < window.innerHeight &&
            rect.bottom > 0
          );
          
          if (isVisible && video.classList.contains('active')) {
            video.play().catch(err => {
              console.log('Video play prevented:', err);
            });
          }
        }
      }
    });
  });
}

// VIDEO CROSSFADE - Smooth loop transition
function initVideoCrossfade() {
  const video1 = document.getElementById('video1');
  const video2 = document.getElementById('video2');
  
  if (!video1 || !video2) return;
  
  let currentVideo = video1;
  let nextVideo = video2;
  
  // Crossfade duration (1.5 seconds before end)
  const crossfadeDuration = 1.5;
  
  function setupVideo(video) {
    video.currentTime = 0;
    video.load();
  }
  
  function crossfade() {
    // Start next video slightly before current ends
    const timeUntilEnd = currentVideo.duration - currentVideo.currentTime;
    
    if (timeUntilEnd <= crossfadeDuration) {
      // Start next video
      nextVideo.play().catch(err => console.log('Next video play prevented:', err));
      
      // Fade out current, fade in next
      currentVideo.classList.remove('active');
      nextVideo.classList.add('active');
      
      // Swap references
      const temp = currentVideo;
      currentVideo = nextVideo;
      nextVideo = temp;
      
      // Reset next video to beginning
      setTimeout(() => {
        setupVideo(nextVideo);
      }, 1500);
    }
  }
  
  // Monitor playback for crossfade timing
  video1.addEventListener('timeupdate', crossfade);
  video2.addEventListener('timeupdate', crossfade);
  
  // Start first video
  video1.play().catch(err => {
    console.log('Initial video autoplay prevented:', err);
    // Try to play on user interaction
    document.addEventListener('click', function playOnClick() {
      video1.play();
      document.removeEventListener('click', playOnClick);
    }, { once: true });
  });
  
  // Prepare second video
  setupVideo(video2);
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
