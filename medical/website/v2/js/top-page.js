// ===================================
// Top Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initWhySeedTabs();
  initVideoControl();
  initVideoCrossfade();
  initSmoothScroll(); // START HEREボタン用スムーススクロール
  initGbuSubtitleAnimation(); // GBUサブタイトルのスクロールアニメーション
  initStatsCounter(); // 統計数字のルーレットアニメーション
});

// WHY SEED SECTION - Tab-based interface (PPT準拠)
function initWhySeedTabs() {
  const tabs = document.querySelectorAll('.tab-item');
  const panels = document.querySelectorAll('.panel-content');
  const panelsContainer = document.querySelector('.why-seed-panels');
  
  if (!tabs.length || !panels.length) return;
  
  // モバイル版：スワイプ機能
  let touchStartX = 0;
  let touchEndX = 0;
  let currentIndex = 0;
  
  if (panelsContainer && window.innerWidth <= 768) {
    panelsContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    panelsContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < swipeThreshold) return;
    
    if (diff > 0) {
      // 左スワイプ：次のタブ
      currentIndex = Math.min(currentIndex + 1, tabs.length - 1);
    } else {
      // 右スワイプ：前のタブ
      currentIndex = Math.max(currentIndex - 1, 0);
    }
    
    activateTab(currentIndex);
    scrollTabIntoView(currentIndex);
  }
  
  tabs.forEach((tab, index) => {
    // Click handler
    tab.addEventListener('click', function() {
      currentIndex = index;
      activateTab(index);
      scrollTabIntoView(index);
    });
    
    // Keyboard navigation
    tab.addEventListener('keydown', function(e) {
      let newIndex = index;
      
      // Enter or Space - activate tab
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentIndex = index;
        activateTab(index);
      }
      // Arrow keys - navigate between tabs
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        currentIndex = newIndex;
        tabs[newIndex].focus();
        activateTab(newIndex);
        scrollTabIntoView(newIndex);
      }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        currentIndex = newIndex;
        tabs[newIndex].focus();
        activateTab(newIndex);
        scrollTabIntoView(newIndex);
      }
    });
  });
  
  function activateTab(index) {
    // Deactivate all tabs
    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    
    // Hide all panels with fade out
    panels.forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Activate selected tab
    tabs[index].classList.add('active');
    tabs[index].setAttribute('aria-selected', 'true');
    
    // Show corresponding panel with fade in
    setTimeout(() => {
      panels[index].classList.add('active');
    }, 10);
  }
  
  function scrollTabIntoView(index) {
    if (window.innerWidth <= 768) {
      const tabsContainer = document.querySelector('.why-seed-tabs');
      const activeTab = tabs[index];
      
      if (tabsContainer && activeTab) {
        const containerWidth = tabsContainer.offsetWidth;
        const tabLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;
        const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
        
        tabsContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
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

// SMOOTH SCROLL - START HEREボタン用（固定ヘッダーのオフセット対応）
function initSmoothScroll() {
  const startButton = document.querySelector('.btn-start-here');
  
  if (!startButton) return;
  
  startButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1); // "#global-units" → "global-units"
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// GBU SUBTITLE ANIMATION - Scroll-triggered animation
function initGbuSubtitleAnimation() {
  const gbuSubtitle = document.querySelector('.gbu-subtitle');
  
  if (!gbuSubtitle) return;
  
  const observerOptions = {
    threshold: 0.3, // セクションが30%表示されたらトリガー
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // セクションが表示されたらアニメーション開始
        entry.target.classList.add('animated');
        // 一度アニメーションしたら監視を停止
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  observer.observe(gbuSubtitle);
}

// STATS COUNTER - Roulette animation for statistics numbers
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (!statNumbers.length) return;
  
  const observerOptions = {
    threshold: 0.5, // 50%表示されたらトリガー
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent);
        
        // アニメーション開始
        animateCounter(target, finalValue);
        
        // 一度アニメーションしたら監視を停止
        observer.unobserve(target);
      }
    });
  }, observerOptions);
  
  // 各数字要素を監視
  statNumbers.forEach(element => {
    observer.observe(element);
  });
}

function animateCounter(element, finalValue) {
  const duration = 2000; // 2秒間
  const startTime = performance.now();
  const startValue = 0;
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // イージング関数（徐々に減速）
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // 最終値を確実に設定
      element.textContent = finalValue;
    }
  }
  
  requestAnimationFrame(updateCounter);
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
