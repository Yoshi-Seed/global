// ===================================
// Filter Component for Insights Page
// ===================================

class InsightsFilter {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    
    this.searchInput = this.container.querySelector('#search-input');
    this.topicAreaSelect = this.container.querySelector('#topic-area-filter');
    this.tagsContainer = this.container.querySelector('#tags-container');
    this.clearBtn = this.container.querySelector('#clear-filters');
    this.insightCards = document.querySelectorAll('.insight-card');
    
    this.selectedTopics = [];
    this.selectedTags = [];
    this.searchTerm = '';
    
    this.init();
  }
  
  init() {
    // Search input handler with debounce
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.debounce(() => {
        this.searchTerm = this.searchInput.value.toLowerCase();
        this.filterInsights();
      }, 300));
    }
    
    // Topic area filter handler
    if (this.topicAreaSelect) {
      this.topicAreaSelect.addEventListener('change', () => {
        this.handleTopicChange();
      });
    }
    
    // Clear filters button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
    
    // Tag click handlers
    this.initTagFilters();
  }
  
  initTagFilters() {
    const tagButtons = this.container.querySelectorAll('.filter-tag');
    
    tagButtons.forEach(tag => {
      tag.addEventListener('click', () => {
        const tagName = tag.dataset.tag;
        
        if (tag.classList.contains('active')) {
          tag.classList.remove('active');
          this.selectedTags = this.selectedTags.filter(t => t !== tagName);
        } else {
          tag.classList.add('active');
          this.selectedTags.push(tagName);
        }
        
        this.filterInsights();
      });
    });
  }
  
  handleTopicChange() {
    const selectedOptions = Array.from(this.topicAreaSelect.selectedOptions);
    this.selectedTopics = selectedOptions.map(opt => opt.value).filter(v => v !== '');
    this.filterInsights();
  }
  
  filterInsights() {
    let visibleCount = 0;
    
    this.insightCards.forEach(card => {
      const cardData = {
        title: card.dataset.title?.toLowerCase() || '',
        topic: card.dataset.topic?.toLowerCase() || '',
        tags: (card.dataset.tags?.toLowerCase() || '').split(',').map(t => t.trim()),
        content: card.textContent.toLowerCase()
      };
      
      let shouldShow = true;
      
      // Search filter
      if (this.searchTerm && !cardData.content.includes(this.searchTerm)) {
        shouldShow = false;
      }
      
      // Topic area filter
      if (this.selectedTopics.length > 0 && 
          !this.selectedTopics.some(topic => cardData.topic.includes(topic.toLowerCase()))) {
        shouldShow = false;
      }
      
      // Tags filter
      if (this.selectedTags.length > 0 && 
          !this.selectedTags.some(tag => cardData.tags.includes(tag.toLowerCase()))) {
        shouldShow = false;
      }
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease-out';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    this.updateResultsCount(visibleCount);
  }
  
  updateResultsCount(count) {
    const resultsCounter = document.querySelector('#results-count');
    if (resultsCounter) {
      resultsCounter.textContent = `Showing ${count} of ${this.insightCards.length} fact sheets`;
    }
  }
  
  clearAllFilters() {
    this.searchTerm = '';
    this.selectedTopics = [];
    this.selectedTags = [];
    
    if (this.searchInput) this.searchInput.value = '';
    if (this.topicAreaSelect) this.topicAreaSelect.selectedIndex = 0;
    
    const activeTags = this.container.querySelectorAll('.filter-tag.active');
    activeTags.forEach(tag => tag.classList.remove('active'));
    
    this.filterInsights();
  }
  
  debounce(func, wait) {
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
}

// Search suggestions
function initSearchSuggestions() {
  const searchInput = document.querySelector('#search-input');
  if (!searchInput) return;
  
  const suggestions = [
    'Patient recruitment',
    'HCP interviews',
    'Pricing & reimbursement',
    'Market access',
    'Annual health check-up',
    'Japan vs US',
    'Oncology',
    'Privacy / APPI',
    'Fieldwork timeline'
  ];
  
  const suggestionsList = document.createElement('div');
  suggestionsList.className = 'search-suggestions';
  suggestionsList.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid rgba(91, 26, 6, 0.2);
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    display: none;
    z-index: 100;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  `;
  
  searchInput.parentElement.style.position = 'relative';
  searchInput.parentElement.appendChild(suggestionsList);
  
  searchInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    
    if (value.length < 2) {
      suggestionsList.style.display = 'none';
      return;
    }
    
    const matches = suggestions.filter(s => s.toLowerCase().includes(value));
    
    if (matches.length > 0) {
      suggestionsList.innerHTML = matches.map(match => 
        `<div class="suggestion-item" style="padding: 0.5rem 1rem; cursor: pointer; transition: background-color 0.2s;">${match}</div>`
      ).join('');
      
      suggestionsList.style.display = 'block';
      
      // Add click handlers
      suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
          this.style.backgroundColor = 'rgba(181, 191, 132, 0.2)';
        });
        item.addEventListener('mouseleave', function() {
          this.style.backgroundColor = 'transparent';
        });
        item.addEventListener('click', function() {
          searchInput.value = this.textContent;
          suggestionsList.style.display = 'none';
          searchInput.dispatchEvent(new Event('input'));
        });
      });
    } else {
      suggestionsList.style.display = 'none';
    }
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
      suggestionsList.style.display = 'none';
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new InsightsFilter('.filter-panel');
    initSearchSuggestions();
  });
} else {
  new InsightsFilter('.filter-panel');
  initSearchSuggestions();
}

// Export for manual initialization
window.InsightsFilter = InsightsFilter;
