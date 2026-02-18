// Japan Fact Sheets page: render + filter + paginate
document.addEventListener('DOMContentLoaded', () => {
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
    // Group reports into pairs (2 cards per slide)
    const slides = [];
    for (let i = 0; i < reportSummaries.length; i += 2) {
      const card1 = reportSummaries[i];
      const card2 = reportSummaries[i + 1];
      
      const tags1 = (card1.tags || []).map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('');
      const card1Html = `
        <article class="report-card">
          <div class="report-meta">
            <span class="report-number">#${escapeHtml(card1.number)}</span>
            <span class="report-date">${escapeHtml(card1.date)}</span>
          </div>
          <h3 class="report-title">${escapeHtml(card1.title)}</h3>
          <p class="report-summary">${escapeHtml(card1.summary)}</p>
          <div class="report-tags">${tags1}</div>
          <a href="#" class="btn-learn-more">Download</a>
        </article>
      `;
      
      let card2Html = '';
      if (card2) {
        const tags2 = (card2.tags || []).map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('');
        card2Html = `
          <article class="report-card">
            <div class="report-meta">
              <span class="report-number">#${escapeHtml(card2.number)}</span>
              <span class="report-date">${escapeHtml(card2.date)}</span>
            </div>
            <h3 class="report-title">${escapeHtml(card2.title)}</h3>
            <p class="report-summary">${escapeHtml(card2.summary)}</p>
            <div class="report-tags">${tags2}</div>
            <a href="#" class="btn-learn-more">Download</a>
          </article>
        `;
      }
      
      slides.push(`
        <div class="carousel-slide">
          ${card1Html}
          ${card2Html}
        </div>
      `);
    }
    
    reportContainer.innerHTML = slides.join('');
  }

  // First render
  update();
});
