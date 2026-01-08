(() => {
  const $ = (sel) => document.querySelector(sel);

  const state = {
    diseases: [],
    messages: [],
    socialNotes: {},
    selected: null,
    mode: "jp+en", // or "en"
  };

  const els = {
    body: document.body,
    searchView: $("#searchView"),
    detailView: $("#detailView"),
    searchInput: $("#searchInput"),
    suggestions: $("#suggestions"),
    hint: $("#hint"),
    modeToggle: $("#modeToggle"),
    backBtn: $("#backBtn"),

    icdPill: $("#icdPill"),
    diseaseJp: $("#diseaseJp"),
    diseaseEn: $("#diseaseEn"),
    patientsTotal: $("#patientsTotal"),
    recruitable: $("#recruitable"),

    messageBox: $("#messageBox"),
    recommendedN: $("#recommendedN"),
    msgJp: $("#msgJp"),
    msgEn: $("#msgEn"),
    copyEnBtn: $("#copyEnBtn"),
    copyToast: $("#copyToast"),

    socialNote: $("#socialNote"),
    socialTag: $("#socialTag"),
    socialJp: $("#socialJp"),
    socialEn: $("#socialEn"),

    coefRecruit: $("#coefRecruit"),
    coefDifficulty: $("#coefDifficulty"),
    coefSocial: $("#coefSocial"),
    coefSNS: $("#coefSNS"),
    resetCoefBtn: $("#resetCoefBtn"),
  };

  const fmtJa = new Intl.NumberFormat("ja-JP");
  const fmtEn = new Intl.NumberFormat("en-US");

  function clamp01(x) {
    if (Number.isNaN(x)) return 1;
    return Math.max(0, Math.min(1, x));
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/　/g, "")
      .trim();
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === "en") {
      els.body.classList.add("mode-en-only");
      els.modeToggle.textContent = "EN only";
    } else {
      els.body.classList.remove("mode-en-only");
      els.modeToggle.textContent = "JP+EN";
    }
  }

  function showSearch() {
    els.searchView.classList.remove("hidden");
    els.detailView.classList.add("hidden");
    els.searchInput.focus({ preventScroll: true });
  }

  function showDetail() {
    els.searchView.classList.add("hidden");
    els.detailView.classList.remove("hidden");
  }

  function pickMessage(n) {
    for (const m of state.messages) {
      const min = (m.min ?? -Infinity);
      const max = (m.max ?? Infinity);
      if (n >= min && n < max) return m;
    }
    return state.messages[state.messages.length - 1];
  }

  function computeRecruitable(total, coefs) {
    const product = coefs.recruit * coefs.difficulty * coefs.social * coefs.sns;
    return Math.max(0, Math.round(total * product));
  }

  function currentCoefs() {
    return {
      recruit: clamp01(parseFloat(els.coefRecruit.value)),
      difficulty: clamp01(parseFloat(els.coefDifficulty.value)),
      social: clamp01(parseFloat(els.coefSocial.value)),
      sns: clamp01(parseFloat(els.coefSNS.value)),
    };
  }

  function defaultCoefsForDisease(d) {
    return {
      recruit: (typeof d.recruit_coef === "number") ? clamp01(d.recruit_coef) : 1,
      difficulty: (typeof d.difficulty_coef === "number") ? clamp01(d.difficulty_coef) : 1,
      social: (typeof d.social_coef === "number") ? clamp01(d.social_coef) : 1,
      sns: (typeof d.sns_coef === "number") ? clamp01(d.sns_coef) : 1,
    };
  }

  function setCoefInputs(coefs) {
    els.coefRecruit.value = coefs.recruit.toFixed(2);
    els.coefDifficulty.value = coefs.difficulty.toFixed(2);
    els.coefSocial.value = coefs.social.toFixed(2);
    els.coefSNS.value = coefs.sns.toFixed(2);
  }

  function detectSocialNote(d) {
    // 1) Exact match by ICD10 (preferred; editable by you)
    const explicit = state.socialNotes[d.icd10];
    if (explicit) return explicit;

    // 2) Fallback keyword detection (lightweight)
    const keyword = `${d.jp} ${d.en}`.toLowerCase();
    const isSensitive =
      /hiv|aids/.test(keyword) ||
      /syphilis|gonococcal|chlamydia/.test(keyword) ||
      /淋菌|クラミジア|梅毒|hiv|エイズ/.test(d.jp);

    if (!isSensitive) return null;

    return {
      tag: { jp: "センシティブ", en: "Sensitive" },
      jp: "社会的にセンシティブな領域の可能性があります。自己申告ベースのパネルでは難航することがあるため、医師紹介やコミュニティ経由など複数チャネルを検討してください。",
      en: "This condition may be socially sensitive. Self-report panel recruitment can be difficult; consider multi-channel approaches (physician referral, community outreach, etc.)."
    };
  }

  function renderSocialNote(d) {
    const note = detectSocialNote(d);
    if (!note) {
      els.socialNote.classList.add("hidden");
      els.socialTag.textContent = "";
      els.socialJp.textContent = "";
      els.socialEn.textContent = "";
      return;
    }

    els.socialNote.classList.remove("hidden");
    els.socialTag.textContent = (state.mode === "en") ? (note.tag?.en || "Note") : (note.tag?.jp || "注意");
    els.socialJp.textContent = note.jp || "";
    els.socialEn.textContent = note.en || "";
  }

  function renderDetail(d) {
    state.selected = d;
    showDetail();

    els.icdPill.textContent = `ICD10: ${d.icd10}`;
    els.diseaseJp.textContent = d.jp;
    els.diseaseEn.textContent = d.en;

    const total = d.patients_estimated ?? 0;
    els.patientsTotal.textContent = `${fmtJa.format(total)} 人`;

    // coefficients: default -> inputs -> computed
    const defaults = defaultCoefsForDisease(d);
    setCoefInputs(defaults);

    updateComputed();
    renderSocialNote(d);
  }

  function updateComputed() {
    if (!state.selected) return;

    const d = state.selected;
    const total = d.patients_estimated ?? 0;
    const coefs = currentCoefs();

    // Clamp + write back to inputs in case user typed out-of-range
    setCoefInputs(coefs);

    const r = computeRecruitable(total, coefs);

    els.recruitable.textContent = `${fmtJa.format(r)} 人`;

    const msg = pickMessage(r);

    // Message styling
    els.messageBox.classList.remove("level-critical","level-warning","level-caution","level-good","level-goodplus");
    els.messageBox.classList.add(`level-${msg.level}`);

    els.recommendedN.textContent = (state.mode === "en") ? (msg.recommended?.en || "—") : (msg.recommended?.jp || "—");
    els.msgJp.textContent = msg.jp || "";
    els.msgEn.textContent = msg.en || "";
  }

  function renderSuggestions(items) {
    els.suggestions.innerHTML = "";

    if (!items.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="sugg-title">該当なし</div><div class="sugg-sub">別のキーワードでも試してみてください。</div>`;
      li.style.cursor = "default";
      els.suggestions.appendChild(li);
      return;
    }

    for (const d of items) {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      const total = d.patients_estimated ?? 0;
      li.innerHTML = `
        <div class="sugg-title">${escapeHtml(d.jp)}</div>
        <div class="sugg-sub">${escapeHtml(d.en)} • ICD10: ${escapeHtml(d.icd10)} • 約${fmtJa.format(total)}人</div>
      `;
      li.addEventListener("click", () => {
        window.location.hash = `#${encodeURIComponent(d.icd10)}`;
        renderDetail(d);
      });
      els.suggestions.appendChild(li);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function onSearchInput() {
    const q = normalize(els.searchInput.value);

    if (!q) {
      els.suggestions.innerHTML = "";
      return;
    }

    const results = [];
    for (const d of state.diseases) {
      if (d._key.includes(q)) results.push(d);
      if (results.length >= 10) break;
    }
    renderSuggestions(results);
  }

  function findDiseaseByIcd(icd) {
    const target = String(icd || "").toUpperCase().trim();
    return state.diseases.find(d => d.icd10.toUpperCase() === target) || null;
  }

  async function loadAll() {
    const [diseases, messages, socialNotes] = await Promise.all([
      fetch("./data/diseases.json").then(r => r.json()),
      fetch("./data/messages.json").then(r => r.json()),
      fetch("./data/social_notes.json").then(r => r.json()),
    ]);

    // Precompute search keys
    state.diseases = diseases.map(d => ({
      ...d,
      _key: normalize(`${d.jp} ${d.en} ${d.icd10}`)
    }));

    state.messages = messages;
    state.socialNotes = socialNotes || {};

    // If URL has #ICD10, open detail directly
    const hash = decodeURIComponent((window.location.hash || "").replace("#","")).trim();
    if (hash) {
      const d = findDiseaseByIcd(hash);
      if (d) {
        renderDetail(d);
        return;
      }
    }
    showSearch();
  }

  function buildEnglishCopyText() {
    if (!state.selected) return "";

    const d = state.selected;
    const total = d.patients_estimated ?? 0;
    const coefs = currentCoefs();
    const r = computeRecruitable(total, coefs);
    const msg = pickMessage(r);
    const note = detectSocialNote(d);

    const lines = [];
    lines.push(`${d.en} (ICD-10: ${d.icd10})`);
    lines.push(`Estimated patient population (Japan): ${fmtEn.format(total)}`);
    lines.push(`Estimated recruitable population (after adjustments): ${fmtEn.format(r)}`);
    if (msg?.recommended?.en) lines.push(`Suggested achievable interviews: ${msg.recommended.en}`);
    if (msg?.en) lines.push(`Feasibility note: ${msg.en}`);
    if (note?.en) lines.push(`Additional caution: ${note.en}`);

    return lines.join("\n");
  }

  async function copyEnglish() {
    try {
      const text = buildEnglishCopyText();
      await navigator.clipboard.writeText(text);
      els.copyToast.textContent = "Copied!";
      setTimeout(() => { els.copyToast.textContent = ""; }, 1200);
    } catch (e) {
      els.copyToast.textContent = "Copy failed (browser permission).";
      setTimeout(() => { els.copyToast.textContent = ""; }, 1600);
    }
  }

  // Events
  els.searchInput.addEventListener("input", onSearchInput);

  els.modeToggle.addEventListener("click", () => {
    setMode(state.mode === "en" ? "jp+en" : "en");
    updateComputed();
    if (state.selected) renderSocialNote(state.selected);
  });

  els.backBtn.addEventListener("click", () => {
    window.location.hash = "";
    showSearch();
  });

  for (const el of [els.coefRecruit, els.coefDifficulty, els.coefSocial, els.coefSNS]) {
    el.addEventListener("input", updateComputed);
    el.addEventListener("change", updateComputed);
  }

  els.resetCoefBtn.addEventListener("click", () => {
    if (!state.selected) return;
    const defaults = defaultCoefsForDisease(state.selected);
    setCoefInputs(defaults);
    updateComputed();
  });

  els.copyEnBtn.addEventListener("click", copyEnglish);

  // react to hash change (shareable links)
  window.addEventListener("hashchange", () => {
    const hash = decodeURIComponent((window.location.hash || "").replace("#","")).trim();
    if (!hash) {
      showSearch();
      return;
    }
    const d = findDiseaseByIcd(hash);
    if (d) renderDetail(d);
  });

  // init
  setMode("jp+en");
  loadAll().catch((e) => {
    console.error(e);
    els.hint.textContent = "データの読み込みに失敗しました。GitHub Pagesの場合は、HTTPS配下で開いているか確認してください。";
  });
})();
