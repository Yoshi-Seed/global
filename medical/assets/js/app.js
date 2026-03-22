
(() => {
  const LEVEL_META = {
    intermediate: {
      label: '中級',
      english: 'Intermediate',
      subtitle: '基本原則・同意・匿名性・リクルートの土台',
      bullets: [
        '市場調査と販促の分離',
        '同意・プライバシー通知・保存方針',
        'オプトアウト、スクリーナー、再連絡',
        '謝礼・Eメール・子ども調査の基本'
      ]
    },
    advanced: {
      label: '上級',
      english: 'Advanced',
      subtitle: '例外判断・観察・ToV開示・デジタル調査の実戦',
      bullets: [
        'クライアント観察・録画・国際転送',
        '患者/HCPリクルートとToV開示',
        'ソーシャルメディア、AE報告、アプリ/追跡',
        '製品テスト、KOL、子ども調査の場面判断'
      ]
    }
  };

  const STORAGE_KEY = 'ephmra_quiz_stats_v1';
  const QUESTION_COUNT = 8;
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const state = {
    level: null,
    round: [],
    currentIndex: 0,
    correctCount: 0,
    currentQuestion: null,
    currentScreen: 'screen-home',
    learnerName: '',
    certificateId: '',
    answerLocked: false
  };

  const els = {
    screenHome: document.getElementById('screen-home'),
    screenQuiz: document.getElementById('screen-quiz'),
    screenFeedback: document.getElementById('screen-feedback'),
    screenFail: document.getElementById('screen-fail'),
    screenSuccess: document.getElementById('screen-success'),
    learnerName: document.getElementById('learnerName'),
    statsSummary: document.getElementById('statsSummary'),
    levelGrid: document.getElementById('levelGrid'),
    progressFill: document.getElementById('progressFill'),
    questionCounter: document.getElementById('questionCounter'),
    streakCounter: document.getElementById('streakCounter'),
    levelChip: document.getElementById('levelChip'),
    topicChip: document.getElementById('topicChip'),
    choiceChip: document.getElementById('choiceChip'),
    scenarioBox: document.getElementById('scenarioBox'),
    scenarioText: document.getElementById('scenarioText'),
    questionText: document.getElementById('questionText'),
    optionsContainer: document.getElementById('optionsContainer'),
    feedbackQuestion: document.getElementById('feedbackQuestion'),
    feedbackCorrect: document.getElementById('feedbackCorrect'),
    feedbackExplanation: document.getElementById('feedbackExplanation'),
    feedbackReference: document.getElementById('feedbackReference'),
    failSelected: document.getElementById('failSelected'),
    failCorrect: document.getElementById('failCorrect'),
    failExplanation: document.getElementById('failExplanation'),
    failReference: document.getElementById('failReference'),
    failLevelLabel: document.getElementById('failLevelLabel'),
    failScoreLabel: document.getElementById('failScoreLabel'),
    failBestRunLabel: document.getElementById('failBestRunLabel'),
    certificateName: document.getElementById('certificateName'),
    certificateLevel: document.getElementById('certificateLevel'),
    certificateDate: document.getElementById('certificateDate'),
    certificateId: document.getElementById('certificateId'),
    successStats: document.getElementById('successStats'),
    confettiField: document.getElementById('confettiField')
  };

  function defaultStats() {
    return {
      intermediate: { attempts: 0, perfectClears: 0, bestRun: 0 },
      advanced: { attempts: 0, perfectClears: 0, bestRun: 0 }
    };
  }

  function loadStats() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultStats();
      const parsed = JSON.parse(raw);
      return {
        intermediate: { ...defaultStats().intermediate, ...(parsed.intermediate || {}) },
        advanced: { ...defaultStats().advanced, ...(parsed.advanced || {}) }
      };
    } catch (error) {
      return defaultStats();
    }
  }

  function saveStats(stats) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  function totalQuestionCount() {
    return Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK.length : 0;
  }

  function questionCountByLevel(level) {
    return window.QUESTION_BANK.filter((q) => q.level === level).length;
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function groupByTopic(level) {
    const bank = window.QUESTION_BANK.filter((q) => q.level === level);
    const grouped = {};
    bank.forEach((question) => {
      if (!grouped[question.topic]) grouped[question.topic] = [];
      grouped[question.topic].push(question);
    });
    return grouped;
  }

  function prepareQuestion(question) {
    const prepared = JSON.parse(JSON.stringify(question));
    prepared.options = shuffle(prepared.options);
    return prepared;
  }

  function buildRound(level) {
    const grouped = groupByTopic(level);
    const topics = shuffle(Object.keys(grouped));
    const selected = [];
    const used = new Set();

    topics.forEach((topic) => {
      if (selected.length >= QUESTION_COUNT) return;
      const candidates = shuffle(grouped[topic]).filter((q) => !used.has(q.id));
      if (candidates[0]) {
        selected.push(candidates[0]);
        used.add(candidates[0].id);
      }
    });

    const allRemaining = shuffle(window.QUESTION_BANK.filter((q) => q.level === level && !used.has(q.id)));
    while (selected.length < QUESTION_COUNT && allRemaining.length) {
      const next = allRemaining.shift();
      if (!used.has(next.id)) {
        selected.push(next);
        used.add(next.id);
      }
    }

    return shuffle(selected).slice(0, QUESTION_COUNT).map(prepareQuestion);
  }

  function setActiveScreen(screenId) {
    document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    state.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderStatsSummary() {
    const stats = loadStats();
    const totalAttempts = stats.intermediate.attempts + stats.advanced.attempts;
    const totalPerfects = stats.intermediate.perfectClears + stats.advanced.perfectClears;

    els.statsSummary.innerHTML = [
      {
        title: 'Question bank',
        value: `${totalQuestionCount()} questions`,
        sub: `${questionCountByLevel('intermediate')} mid / ${questionCountByLevel('advanced')} adv`
      },
      {
        title: 'Attempts',
        value: String(totalAttempts),
        sub: 'local browser stats'
      },
      {
        title: 'Perfect clears',
        value: String(totalPerfects),
        sub: `${stats.intermediate.perfectClears} mid / ${stats.advanced.perfectClears} adv`
      },
      {
        title: 'Best run',
        value: `${Math.max(stats.intermediate.bestRun, stats.advanced.bestRun)} / ${QUESTION_COUNT}`,
        sub: `mid ${stats.intermediate.bestRun} / adv ${stats.advanced.bestRun}`
      }
    ].map((card) => `
      <div class="stats-card">
        <strong>${card.title}</strong>
        <div>${card.value}</div>
        <span>${card.sub}</span>
      </div>
    `).join('');
  }

  function renderLevelCards() {
    const stats = loadStats();
    els.levelGrid.innerHTML = ['intermediate', 'advanced'].map((level) => {
      const meta = LEVEL_META[level];
      const count = questionCountByLevel(level);
      const levelStats = stats[level];
      return `
        <article class="level-card">
          <div class="level-head">
            <div>
              <div class="level-badge ${level === 'advanced' ? 'advanced' : ''}">${meta.label} / ${meta.english}</div>
              <h3>${meta.label}</h3>
            </div>
            <div class="level-metrics">
              <span class="level-meta">Bank: ${count}問</span>
              <span class="level-meta">Best: ${levelStats.bestRun} / ${QUESTION_COUNT}</span>
              <span class="level-meta">Perfect: ${levelStats.perfectClears}</span>
            </div>
          </div>
          <p>${meta.subtitle}</p>
          <ul class="level-list">
            ${meta.bullets.map((item) => `<li>${item}</li>`).join('')}
          </ul>
          <button class="level-start" type="button" data-start-level="${level}">${meta.label}で挑戦する</button>
        </article>
      `;
    }).join('');
  }

  function renderHome() {
    renderStatsSummary();
    renderLevelCards();
    setActiveScreen('screen-home');
  }

  function updateStatsForAttempt(level) {
    const stats = loadStats();
    stats[level].attempts += 1;
    saveStats(stats);
  }

  function finalizeStats(level, correctCount, perfect) {
    const stats = loadStats();
    stats[level].bestRun = Math.max(stats[level].bestRun, correctCount);
    if (perfect) stats[level].perfectClears += 1;
    saveStats(stats);
    return stats[level];
  }

  function startGame(level) {
    state.level = level;
    state.round = buildRound(level);
    state.currentIndex = 0;
    state.correctCount = 0;
    state.currentQuestion = state.round[0];
    state.answerLocked = false;
    state.learnerName = (els.learnerName.value || '').trim();
    updateStatsForAttempt(level);
    renderQuestion();
    setActiveScreen('screen-quiz');
  }

  function renderQuestion() {
    const question = state.round[state.currentIndex];
    state.currentQuestion = question;
    state.answerLocked = false;

    const levelLabel = LEVEL_META[state.level].label;
    els.levelChip.textContent = levelLabel;
    els.topicChip.textContent = question.topic;
    els.choiceChip.textContent = question.options.length === 2 ? '2択' : '4択';
    els.questionCounter.textContent = `Q ${state.currentIndex + 1} / ${QUESTION_COUNT}`;
    els.streakCounter.textContent = `Perfect streak: ${state.correctCount}`;
    els.progressFill.style.width = `${((state.currentIndex + 1) / QUESTION_COUNT) * 100}%`;
    els.questionText.textContent = question.prompt;

    if (question.scenario) {
      els.scenarioText.textContent = question.scenario;
      els.scenarioBox.classList.remove('hidden');
    } else {
      els.scenarioText.textContent = '';
      els.scenarioBox.classList.add('hidden');
    }

    els.optionsContainer.className = `options-grid ${question.options.length === 2 ? 'two-choice' : ''}`;
    els.optionsContainer.innerHTML = question.options.map((option, index) => `
      <button class="option-button" type="button" data-option-index="${index}">
        <span class="option-letter">${LETTERS[index]}</span>
        <span class="option-text">${option.text}</span>
      </button>
    `).join('');
  }

  function handleAnswer(index) {
    if (state.answerLocked) return;
    state.answerLocked = true;

    const question = state.currentQuestion;
    const chosen = question.options[index];
    const correctOption = question.options.find((option) => option.correct);

    if (chosen.correct) {
      state.correctCount += 1;
      els.feedbackQuestion.textContent = question.prompt;
      els.feedbackCorrect.textContent = correctOption.text;
      els.feedbackExplanation.textContent = question.explanation;
      els.feedbackReference.textContent = `Reference: ${question.reference}`;
      setActiveScreen('screen-feedback');
      return;
    }

    const levelStats = finalizeStats(state.level, state.correctCount, false);
    els.failSelected.textContent = chosen.text;
    els.failCorrect.textContent = correctOption.text;
    els.failExplanation.textContent = question.explanation;
    els.failReference.textContent = `Reference: ${question.reference}`;
    els.failLevelLabel.textContent = `${LEVEL_META[state.level].label} challenge`;
    els.failScoreLabel.textContent = `${state.correctCount} / ${QUESTION_COUNT}問正解`;
    els.failBestRunLabel.textContent = `${levelStats.bestRun} / ${QUESTION_COUNT}`;
    setActiveScreen('screen-fail');
  }

  function goNextQuestion() {
    if (state.currentIndex >= QUESTION_COUNT - 1) {
      completeGame();
      return;
    }
    state.currentIndex += 1;
    renderQuestion();
    setActiveScreen('screen-quiz');
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  function generateCertificateId(level) {
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `EPH-${level.slice(0, 3).toUpperCase()}-${stamp}-${suffix}`;
  }

  function buildSuccessStats(levelStats) {
    return [
      { title: 'This run', value: `${QUESTION_COUNT} / ${QUESTION_COUNT}`, sub: 'perfect clear' },
      { title: 'Best run', value: `${levelStats.bestRun} / ${QUESTION_COUNT}`, sub: 'local best' },
      { title: 'Perfect clears', value: String(levelStats.perfectClears), sub: LEVEL_META[state.level].label }
    ].map((card) => `
      <div class="stats-card">
        <strong>${card.title}</strong>
        <div>${card.value}</div>
        <span>${card.sub}</span>
      </div>
    `).join('');
  }

  function createConfetti() {
    els.confettiField.innerHTML = '';
    const colors = ['#24c5b4', '#65b8ff', '#ffd36d', '#ff6f7d', '#8ce4d9'];
    for (let i = 0; i < 34; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.9}s`;
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
      piece.style.setProperty('--spin', `${Math.floor(Math.random() * 1080)}deg`);
      els.confettiField.appendChild(piece);
    }
  }

  function completeGame() {
    const levelStats = finalizeStats(state.level, QUESTION_COUNT, true);
    const learner = state.learnerName || 'Learner';
    const now = new Date();
    state.certificateId = generateCertificateId(state.level);

    els.certificateName.textContent = learner;
    els.certificateLevel.textContent = LEVEL_META[state.level].english;
    els.certificateDate.textContent = formatDate(now);
    els.certificateId.textContent = state.certificateId;
    els.successStats.innerHTML = buildSuccessStats(levelStats);
    createConfetti();
    setActiveScreen('screen-success');
  }

  function downloadCertificate() {
    const learner = state.learnerName || 'Learner';
    const levelText = LEVEL_META[state.level].english;
    const dateText = els.certificateDate.textContent;
    const idText = state.certificateId || generateCertificateId(state.level || 'int');

    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, 1800, 1200);
    bg.addColorStop(0, '#f7fbff');
    bg.addColorStop(1, '#eef7ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glow = ctx.createRadialGradient(1500, 140, 60, 1500, 140, 340);
    glow.addColorStop(0, 'rgba(36,197,180,0.22)');
    glow.addColorStop(1, 'rgba(36,197,180,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(36, 64, 142, 0.18)';
    ctx.lineWidth = 22;
    ctx.strokeRect(66, 66, canvas.width - 132, canvas.height - 132);

    ctx.fillStyle = '#24408e';
    ctx.font = '700 26px Inter, Arial, sans-serif';
    ctx.fillText('Certificate of Completion', 120, 150);

    ctx.fillStyle = '#10203b';
    ctx.font = '700 76px Inter, Arial, sans-serif';
    ctx.fillText('EPHMRA Code Challenge', 120, 260);

    ctx.font = '600 54px Inter, Arial, sans-serif';
    ctx.fillText(learner, 120, 410);

    ctx.fillStyle = '#4f657f';
    ctx.font = '400 32px Inter, Arial, sans-serif';
    ctx.fillText('has completed the EPHMRA Code Challenge with a perfect score.', 120, 478);
    ctx.fillText('You have answered all questions correctly!!', 120, 530);

    ctx.fillStyle = '#10203b';
    ctx.font = '600 28px Inter, Arial, sans-serif';
    ctx.fillText(`Level: ${levelText}`, 120, 660);
    ctx.fillText(`Date: ${dateText}`, 120, 720);
    ctx.fillText(`Certificate ID: ${idText}`, 120, 780);

    ctx.fillStyle = '#24c5b4';
    ctx.fillRect(120, 860, 560, 6);

    ctx.fillStyle = '#24408e';
    ctx.font = '700 24px Inter, Arial, sans-serif';
    ctx.fillText('Healthcare Market Research Ethics Quiz', 120, 920);

    ctx.beginPath();
    ctx.arc(1505, 310, 145, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd36d';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(36,64,142,0.16)';
    ctx.stroke();

    ctx.fillStyle = '#10203b';
    ctx.textAlign = 'center';
    ctx.font = '800 34px Inter, Arial, sans-serif';
    ctx.fillText('PERFECT', 1505, 288);
    ctx.font = '800 48px Inter, Arial, sans-serif';
    ctx.fillText('8 / 8', 1505, 348);
    ctx.textAlign = 'start';

    const link = document.createElement('a');
    link.download = `ephmra-certificate-${idText}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function clearStats() {
    const confirmed = window.confirm('Reset local attempt stats for this browser?');
    if (!confirmed) return;
    saveStats(defaultStats());
    renderHome();
  }

  function handleDocumentClick(event) {
    const levelButton = event.target.closest('[data-start-level]');
    if (levelButton) {
      startGame(levelButton.dataset.startLevel);
      return;
    }

    const optionButton = event.target.closest('[data-option-index]');
    if (optionButton && state.currentScreen === 'screen-quiz') {
      handleAnswer(Number(optionButton.dataset.optionIndex));
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    if (action === 'home') {
      renderHome();
    } else if (action === 'next-question') {
      goNextQuestion();
    } else if (action === 'retry-same' && state.level) {
      startGame(state.level);
    } else if (action === 'download-certificate') {
      downloadCertificate();
    } else if (action === 'clear-stats') {
      clearStats();
    }
  }

  function init() {
    renderHome();
    document.addEventListener('click', handleDocumentClick);
  }

  init();
})();
