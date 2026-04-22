// Japan Fact Sheets page: render + filter + paginate
document.addEventListener('DOMContentLoaded', () => {
  // Hero video autoplay initialization
  const heroVideo = document.querySelector('.insights-hero-video');
  if (heroVideo) {
    // Force play on load
    heroVideo.play().catch(err => {
      console.log('Video autoplay prevented:', err);
      // Retry on user interaction
      document.addEventListener('click', function playOnClick() {
        heroVideo.play();
        document.removeEventListener('click', playOnClick);
      }, { once: true });
    });
  }

  const data = window.FACT_SHEETS || [];
  const reportSummaries = window.REPORT_SUMMARIES || [];

  const grid = document.getElementById('factSheetsGrid');
  const resultsCount = document.getElementById('resultsCount');

  const searchInput = document.getElementById('searchInput');
  const suggestionList = document.getElementById('suggestionList');

  const topicAreaMenu = document.getElementById('topicAreaMenu');
  const tagsMenu = document.getElementById('tagsMenu');

  const clearFiltersBtn = document.getElementById('clearFilters');

  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageNumbers = document.getElementById('pageNumbers');

  const perPage = 6;
  let currentPage = 1;

  // ---------- Helpers ----------
  const escapeHtml = (str) =>
    String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const normalize = (str) => String(str || '').toLowerCase();

  const uniqueSorted = (arr) => Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));

  // ---------- Build filter lists ----------
  const topicAreas = uniqueSorted(data.map((d) => d.topicArea).filter(Boolean));
  const allTags = uniqueSorted(
    data
      .flatMap((d) => (Array.isArray(d.tags) ? d.tags : []))
      .filter(Boolean)
  );

  const buildCheckboxList = (container, values, name) => {
    container.innerHTML = values
      .map(
        (v) => `
        <label class="checkbox-item">
          <input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(v)}">
          <span>${escapeHtml(v)}</span>
        </label>
      `
      )
      .join('');
  };

  buildCheckboxList(topicAreaMenu, topicAreas, 'topicArea');
  buildCheckboxList(tagsMenu, allTags, 'tags');

  // Mobile: Add click handlers for tag chips
  const isMobile = () => {
    // Check viewport width OR user agent for mobile devices
    return window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };
  
  const initTagChipInteractions = () => {
    if (isMobile()) {
      document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', function(e) {
          // Prevent default checkbox behavior
          if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
          }
          
          const checkbox = this.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            
            // Toggle active class for visual feedback
            if (checkbox.checked) {
              this.classList.add('active');
            } else {
              this.classList.remove('active');
            }
            
            // Trigger filter update
            applyFilters();
          }
        });
      });
    }
  };
  
  // Mobile: Add "see more" button to Topic Area (2 rows = 4 items) and Tags (2 rows = 6 items)
  const addSeeMoreButton = (menuId, visibleCount) => {
    if (!isMobile()) return;
    
    const menu = document.getElementById(menuId);
    if (!menu) return;
    
    const allItems = menu.querySelectorAll('.checkbox-item');
    if (allItems.length <= visibleCount) return; // No need for "see more" if all items fit
    
    // Create "see more" button
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.className = 'see-more-btn';
    seeMoreBtn.type = 'button';
    seeMoreBtn.innerHTML = 'see more <span class="arrow">▼</span>';
    
    // Insert after the dropdown menu
    menu.parentElement.insertBefore(seeMoreBtn, menu.nextSibling);
    
    // Toggle expansion on click
    seeMoreBtn.addEventListener('click', () => {
      const isExpanded = menu.classList.contains('expanded');
      
      if (isExpanded) {
        menu.classList.remove('expanded');
        seeMoreBtn.classList.remove('expanded');
        seeMoreBtn.innerHTML = 'see more <span class="arrow">▼</span>';
      } else {
        menu.classList.add('expanded');
        seeMoreBtn.classList.add('expanded');
        seeMoreBtn.innerHTML = 'see less <span class="arrow">▼</span>';
      }
    });
  };
  
  initTagChipInteractions();
  
  // Add "see more" buttons after checkbox lists are built
  addSeeMoreButton('topicAreaMenu', 4);  // Topic Area: 2 rows × 2 items = 4
  addSeeMoreButton('tagsMenu', 6);        // Tags: 2 rows × 3 items = 6

  const getSelected = (container) =>
    Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((i) => i.value);

  // ---------- Dropdown interactions ----------
  const dropdownToggles = Array.from(document.querySelectorAll('.dropdown-toggle'));

  const closeAllDropdowns = () => {
    dropdownToggles.forEach((btn) => {
      const id = btn.getAttribute('data-dropdown');
      const menu = document.getElementById(id);
      if (menu) menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });
  };

  dropdownToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-dropdown');
      const menu = document.getElementById(id);
      if (!menu) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns();
      if (!isOpen) {
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const withinFilter = e.target.closest('.filters');
    if (!withinFilter) closeAllDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // ---------- Filtering + Pagination ----------
  const matchesSearch = (item, query) => {
    if (!query) return true;
    const haystack = [
      item.title,
      item.subtitle,
      item.topicArea,
      ...(Array.isArray(item.tags) ? item.tags : [])
    ]
      .map(normalize)
      .join(' ');
    return haystack.includes(query);
  };

  const applyFilters = () => {
    const query = normalize(searchInput?.value || '').trim();
    const selectedTopics = getSelected(topicAreaMenu);
    const selectedTags = getSelected(tagsMenu);

    const filtered = data.filter((item) => {
      if (!matchesSearch(item, query)) return false;

      if (selectedTopics.length > 0 && !selectedTopics.includes(item.topicArea)) return false;

      if (selectedTags.length > 0) {
        const itemTags = Array.isArray(item.tags) ? item.tags : [];
        const hasAnyTag = selectedTags.some((t) => itemTags.includes(t));
        if (!hasAnyTag) return false;
      }

      return true;
    });

    return filtered;
  };

  const renderCards = (items) => {
    if (!grid) return;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="factsheet-empty">
          <p style="margin:0; font-family: var(--font-body); color: var(--primary-text);">
            No fact sheets match your filters. Try clearing filters or using a shorter search term.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items
      .map((item) => {
        const href = `fact-sheet.html?id=${encodeURIComponent(item.id)}`;
        const tags = (item.tags || []).slice(0, 3);
        const summary = item.subtitle || (item.keyPoints && item.keyPoints[0]) || '';
        return `
          <article class="factsheet-card">
            <a class="factsheet-link" href="${href}">
              <div class="factsheet-thumb">
                <img src="${escapeHtml(item.thumbnail)}" alt="">
              </div>
              <div class="factsheet-body">
                <p class="factsheet-topic">${escapeHtml(item.topicArea || '')}</p>
                <h3 class="factsheet-title">${escapeHtml(item.title || '')}</h3>
                <p class="factsheet-summary">${escapeHtml(summary)}</p>

                <div class="factsheet-tags">
                  ${tags.map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}
                </div>
              </div>
            </a>
          </article>
        `;
      })
      .join('');
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    if (currentPage > totalPages) currentPage = totalPages;

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    pageNumbers.innerHTML = '';

    const maxButtons = 7;
    let start = 1;
    let end = totalPages;

    if (totalPages > maxButtons) {
      const half = Math.floor(maxButtons / 2);
      start = Math.max(1, currentPage - half);
      end = Math.min(totalPages, start + maxButtons - 1);
      if (end - start < maxButtons - 1) {
        start = Math.max(1, end - maxButtons + 1);
      }
    }

    for (let p = start; p <= end; p++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'page-number' + (p === currentPage ? ' active' : '');
      btn.textContent = String(p);
      btn.addEventListener('click', () => {
        currentPage = p;
        update();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      pageNumbers.appendChild(btn);
    }
  };

  const update = () => {
    const filtered = applyFilters();
    const total = filtered.length;

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    currentPage = safePage;

    const start = (currentPage - 1) * perPage;
    const pageItems = filtered.slice(start, start + perPage);

    resultsCount.textContent = total === 0 ? '0 results' : `Showing ${start + 1}–${Math.min(start + perPage, total)} of ${total}`;

    renderCards(pageItems);
    renderPagination(total);
  };

  // ---------- Suggestions ----------
  const updateSuggestions = () => {
    const q = normalize(searchInput.value).trim();
    if (!q) {
      suggestionList.hidden = true;
      suggestionList.innerHTML = '';
      return;
    }

    const matches = data
      .filter((d) => normalize(d.title).includes(q))
      .slice(0, 6);

    if (matches.length === 0) {
      suggestionList.hidden = true;
      suggestionList.innerHTML = '';
      return;
    }

    suggestionList.innerHTML = matches
      .map((m) => `<div class="suggestion-item" role="button" tabindex="0">${escapeHtml(m.title)}</div>`)
      .join('');

    suggestionList.hidden = false;

    Array.from(suggestionList.querySelectorAll('.suggestion-item')).forEach((itemEl) => {
      const pick = () => {
        searchInput.value = itemEl.textContent || '';
        suggestionList.hidden = true;
        update();
      };

      itemEl.addEventListener('click', pick);
      itemEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') pick();
      });
    });
  };

  // ---------- Events ----------
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      updateSuggestions();
      update();
    });

    searchInput.addEventListener('focus', updateSuggestions);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap')) {
        suggestionList.hidden = true;
      }
    });
  }

  [topicAreaMenu, tagsMenu].forEach((menu) => {
    menu.addEventListener('change', () => {
      currentPage = 1;
      update();
    });
  });

  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    topicAreaMenu.querySelectorAll('input[type="checkbox"]').forEach((i) => (i.checked = false));
    tagsMenu.querySelectorAll('input[type="checkbox"]').forEach((i) => (i.checked = false));
    // Mobile: Remove active class from tag chips
    document.querySelectorAll('.checkbox-item').forEach(item => item.classList.remove('active'));
    // Mobile: Collapse "see more" sections
    if (isMobile()) {
      document.querySelectorAll('.see-more-btn.expanded').forEach(btn => {
        btn.classList.remove('expanded');
        btn.innerHTML = 'see more <span class="arrow">▼</span>';
      });
      topicAreaMenu.classList.remove('expanded');
      tagsMenu.classList.remove('expanded');
    }
    suggestionList.hidden = true;
    currentPage = 1;
    update();
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      update();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage += 1;
    update();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---------- Report carousel ----------
  const reportContainer = document.getElementById('reportCarouselContainer');
  if (reportContainer) {
    // Mobile: 1 card per slide; Desktop: 2 cards per slide
    const cardsPerSlide = isMobile() ? 1 : 2;
    const slides = [];
    
    for (let i = 0; i < reportSummaries.length; i += cardsPerSlide) {
      const cardsInSlide = reportSummaries.slice(i, i + cardsPerSlide);
      
      const cardsHtml = cardsInSlide.map(card => {
        const tags = (card.tags || []).map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('');
        return `
          <article class="report-card">
            <div class="report-meta">
              <span class="report-number">#${escapeHtml(card.number)}</span>
              <span class="report-date">${escapeHtml(card.date)}</span>
            </div>
            <h3 class="report-title">${escapeHtml(card.title)}</h3>
            <p class="report-summary">${escapeHtml(card.summary)}</p>
            <div class="report-tags">${tags}</div>
            <a href="#" class="btn-learn-more">Download</a>
          </article>
        `;
      }).join('');
      
      slides.push(`
        <div class="carousel-slide">
          ${cardsHtml}
        </div>
      `);
    }
    
    reportContainer.innerHTML = slides.join('');
  }

  // First render
  update();
});
