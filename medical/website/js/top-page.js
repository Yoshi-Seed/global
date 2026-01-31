// ===================================
// Top Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initWhySeedTabs();
  initVideoControl();
  initVideoCrossfade();
});

// WHY SEED SECTION - Tab-based interface (PPT準拠)
function initWhySeedTabs() {
  const tabs = document.querySelectorAll('.tab-item');
  const panels = document.querySelectorAll('.panel-content');
  
  if (!tabs.length || !panels.length) return;
  
  tabs.forEach((tab, index) => {
    // Click handler
    tab.addEventListener('click', function() {
      activateTab(index);
    });
    
    // Keyboard navigation
    tab.addEventListener('keydown', function(e) {
      let newIndex = index;
      
      // Enter or Space - activate tab
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(index);
      }
      // Arrow keys - navigate between tabs
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        tabs[newIndex].focus();
        activateTab(newIndex);
      }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        tabs[newIndex].focus();
        activateTab(newIndex);
      }
    });
  });
  
  function activateTab(index) {
    // Deactivate all tabs
    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    
    // Hide all panels
    panels.forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Activate selected tab
    tabs[index].classList.add('active');
    tabs[index].setAttribute('aria-selected', 'true');
    
    // Show corresponding panel
    panels[index].classList.add('active');
  }
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
