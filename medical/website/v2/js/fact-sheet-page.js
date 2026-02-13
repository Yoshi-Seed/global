// Fact Sheet detail page: hydrate template from window.FACT_SHEETS data
document.addEventListener('DOMContentLoaded', () => {
  const data = window.FACT_SHEETS || [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const byId = (x) => document.getElementById(x);

  const topicEl = byId('fsTopic');
  const titleEl = byId('fsTitle');
  const subtitleEl = byId('fsSubtitle');
  const tagsEl = byId('fsTags');
  const imgEl = byId('fsHeroImage');
  const keyPointsEl = byId('fsKeyPoints');
  const questionsEl = byId('fsQuestions');
  const dlTop = byId('fsDownloadTop');
  const dlBottom = byId('fsDownloadBottom');
  const relatedGrid = byId('relatedGrid');

  const escapeHtml = (str) =>
    String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const current = data.find((d) => d.id === id) || null;

  const showError = () => {
    titleEl.textContent = 'Fact sheet not found';
    subtitleEl.textContent = 'Please return to the Japan fact sheets page and select a fact sheet again.';
    dlTop.style.display = 'none';
    dlBottom.style.display = 'none';
    keyPointsEl.innerHTML = '';
    questionsEl.innerHTML = '';
    relatedGrid.innerHTML = '';
  };

  if (!current) {
    showError();
    return;
  }

  // Update page title
  document.title = `${current.title} | Japan Fact Sheet | Seed Planning`;

  topicEl.textContent = current.topicArea || 'Topic area';
  titleEl.innerHTML = current.title || '';
  subtitleEl.textContent = current.subtitle || '';

  // Tags
  const tags = Array.isArray(current.tags) ? current.tags : [];
  tagsEl.innerHTML = tags.map((t) => `<span class="hero-tag">${escapeHtml(t)}</span>`).join('');

  // Image
  if (current.thumbnail) {
    imgEl.src = current.thumbnail;
  }

  // Download links
  dlTop.href = current.pdf;
  dlBottom.href = current.pdf;

  // Lists
  const keyPoints = Array.isArray(current.keyPoints) ? current.keyPoints : [];
  const questions = Array.isArray(current.suggestedQuestions) ? current.suggestedQuestions : [];

  keyPointsEl.innerHTML = keyPoints.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  questionsEl.innerHTML = questions.map((q) => `<li>${escapeHtml(q)}</li>`).join('');

  // Related
  const relatedIds = Array.isArray(current.related) ? current.related : [];
  let relatedItems = relatedIds
    .map((rid) => data.find((d) => d.id === rid))
    .filter(Boolean);

  if (relatedItems.length < 3) {
    // Fill from same topic area
    const sameTopic = data.filter((d) => d.id !== current.id && d.topicArea === current.topicArea);
    for (const item of sameTopic) {
      if (relatedItems.length >= 3) break;
      if (!relatedItems.find((x) => x.id === item.id)) relatedItems.push(item);
    }
  }

  if (relatedItems.length < 3) {
    // Fill from any remaining
    const remaining = data.filter((d) => d.id !== current.id && !relatedItems.find((x) => x.id === d.id));
    for (const item of remaining) {
      if (relatedItems.length >= 3) break;
      relatedItems.push(item);
    }
  }

  relatedItems = relatedItems.slice(0, 3);

  relatedGrid.innerHTML = relatedItems
    .map((item) => {
      const href = `fact-sheet.html?id=${encodeURIComponent(item.id)}`;
      return `
        <a class="related-card" href="${href}">
          <div class="related-thumb">
            <img src="${escapeHtml(item.thumbnail)}" alt="">
          </div>
          <div class="related-body">
            <p class="related-topic">${escapeHtml(item.topicArea || '')}</p>
            <h3 class="related-title-text">${escapeHtml(item.title || '')}</h3>
            <p class="related-subtitle">${escapeHtml(item.subtitle || '')}</p>
          </div>
        </a>
      `;
    })
    .join('');
});
