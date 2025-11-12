/* Med Research Quiz — by ウェインツ君 */
(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ---------- State ----------
  const state = {
    mode: "quant",           // "quant" or "qual"
    questions: [],           // active pool
    asked: [],               // records per question asked
    currentIndex: 0,
    score: 0,
    streak: 0,
    multiplier: 1.0,
    difficulty: 2,           // 1..5 adaptive
    progress: 0,             // 0..1
    timer: null,
    timeLeft: 0,
    totalQuestions: 12,
    startedAt: null,
  };

  // ---------- Helpers ----------
  const DIFF_POINTS = {1:100, 2:200, 3:350, 4:550, 5:800};

  function pickQuestions(mode, total=12) {
    const pool = QUESTIONS.filter(q => q.track === mode);
    // stratified by difficulty
    const byDiff = {1:[],2:[],3:[],4:[],5:[]};
    pool.forEach(q => byDiff[q.difficulty]?.push(q));
    // ensure variety: 2 easy, 3 med, 4 hard, 3 mixed
    const plan = [1,1,2,2,3,3,3,4,4,4,5,5];
    const selected = [];
    const usedIds = new Set();
    for (const d of plan.slice(0, total)) {
      const arr = byDiff[d];
      if (!arr || arr.length===0) continue;
      let tries = 0;
      while (tries < 20) {
        const cand = arr[Math.floor(Math.random()*arr.length)];
        if (!usedIds.has(cand.id)) { selected.push(structuredClone(cand)); usedIds.add(cand.id); break; }
        tries++;
      }
    }
    // shuffle
    for (let i=selected.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [selected[i],selected[j]]=[selected[j],selected[i]]; }
    return selected;
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return s + "s";
  }

  function computeMultiplier(streak) {
    if (streak >= 7) return 1.6;
    if (streak >= 5) return 1.4;
    if (streak >= 3) return 1.2;
    if (streak >= 2) return 1.1;
    return 1.0;
  }

  function confettiBurst(node) {
    const colors = ["#7a5ef8", "#3b7ddd", "#36d399", "#ffc857", "#ff6b6b"];
    for (let i=0;i<18;i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.width = piece.style.height = (6 + Math.random()*6) + "px";
      piece.style.left = (node.getBoundingClientRect().left + node.offsetWidth/2 + (Math.random()-0.5)*80) + "px";
      piece.style.top = (node.getBoundingClientRect().top) + "px";
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      piece.style.opacity = 0;
      piece.style.transform = "translateY(-20px)";
      piece.style.animation = `confetti ${600+Math.random()*700}ms ease-out forwards`;
      document.body.appendChild(piece);
      setTimeout(()=> piece.remove(), 1400);
    }
  }

  function saveBest(mode, score) {
    const key = `mrq_best_${mode}`;
    const best = Number(localStorage.getItem(key) || 0);
    if (score > best) localStorage.setItem(key, String(score));
  }
  function loadBest(mode) {
    const key = `mrq_best_${mode}`;
    return Number(localStorage.getItem(key) || 0);
  }

  // ---------- Screens ----------
  function renderHome() {
    state.startedAt = null;
    const bestQuant = loadBest("quant");
    const bestQual = loadBest("qual");
    $("#screen").innerHTML = `
      <section class="hero">
        <div class="left card">
          <h2>ようこそ、Yoshi。今日はどっちから攻める？</h2>
          <p class="lead">定量は「統計×設計」。定性は「洞察×会話術」。<br/>どちらからでも、“プロの目線”で楽しめる難しさにしてあるよ。</p>
          <div class="segment" role="group" aria-label="モード選択">
            <button class="primary" id="startQuant">定量で勝負（BEST: ${bestQuant}）</button>
            <button class="secondary" id="startQual">定性を深掘る（BEST: ${bestQual}）</button>
          </div>
          <div class="segment" style="margin-top:8px">
            <label for="qCount">ラウンド長：</label>
            <select id="qCount">
              <option value="8">短め（8問）</option>
              <option value="12" selected>標準（12問）</option>
              <option value="16">みっちり（16問）</option>
            </select>
            <span class="badge">連続正解で倍率UP、素早さでボーナス</span>
          </div>
        </div>
        <div class="right card">
          <div class="status">
            <span class="pill">🎯 アダプティブ難易度</span>
            <span class="pill">📈 STREAK倍率</span>
            <span class="pill">⏱ タイムボーナス</span>
            <span class="pill">💡 ヒント（-15%点）</span>
          </div>
          <p>こぼれ話：このクイズは、現場で役立つ<em>判断力</em>と<em>説明力</em>を鍛える設計。各問の「学び」で、意思決定の勘どころを短時間で復習できるよ。</p>
          <ul>
            <li>問題タイプ：単一選択・複数選択・並べ替え・マッチング・推定（レンジ）・ケーススタディ</li>
            <li>レビューで、弱点領域をタグ（例：KOL、eDTL、ペルソナ、サンプリング）で可視化</li>
            <li>JSONで結果を保存。学習ログとしてGitHubに置いてもOK</li>
          </ul>
        </div>
      </section>
    `;
    $("#startQuant").addEventListener("click", () => start("quant"));
    $("#startQual").addEventListener("click", () => start("qual"));
    $("#qCount").addEventListener("change", (e) => state.totalQuestions = Number(e.target.value));
  }

  function start(mode) {
    state.mode = mode;
    state.questions = pickQuestions(mode, state.totalQuestions);
    state.asked = [];
    state.currentIndex = 0;
    state.score = 0;
    state.streak = 0;
    state.multiplier = 1.0;
    state.difficulty = 2;
    state.progress = 0;
    state.startedAt = Date.now();
    renderQuestion();
  }

  function renderStatus() {
    const qNo = state.currentIndex + 1;
    const total = state.questions.length;
    const time = formatTime(state.timeLeft);
    return `
      <div class="status">
        <div class="pill">モード: <strong>${state.mode==="quant"?"定量":"定性"}</strong></div>
        <div class="pill">Q ${qNo}/${total}</div>
        <div class="pill">スコア: <strong>${Math.round(state.score)}</strong>（x${state.multiplier.toFixed(2)}）</div>
        <div class="pill">STREAK: <strong>${state.streak}</strong></div>
        <div class="pill">残り時間: <strong>${time}</strong></div>
        <div class="progress" style="flex:1; min-width: 160px;"><span style="width:${(qNo-1)/total*100}%"></span></div>
      </div>
    `;
  }

  function renderQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) return renderReview();

    state.timeLeft = q.timeLimit || 25;
    clearInterval(state.timer);
    state.timer = setInterval(() => {
      state.timeLeft -= 1;
      const timerPill = $$(".pill").find(p => p.textContent.includes("残り時間:"));
      if (timerPill) timerPill.innerHTML = `残り時間: <strong>${formatTime(state.timeLeft)}</strong>`;
      if (state.timeLeft <= 0) {
        clearInterval(state.timer);
        submitAnswer({ autoTimeout: true });
      }
    }, 1000);

    $("#screen").innerHTML = `
      ${renderStatus()}
      <section class="card qcard" data-qid="${q.id}">
        <div class="qmeta">
          <span class="badge">難易度: ${"★".repeat(q.difficulty)}${"☆".repeat(5-q.difficulty)}</span>
          <span class="badge">${q.type.toUpperCase()}</span>
          ${q.tags?.map(t => `<span class="badge">${t}</span>`).join("") ?? ""}
        </div>
        <h3 class="qtitle">${q.prompt}</h3>
        <div class="qbody">${renderBody(q)}</div>
        <div class="actions">
          ${q.hint ? `<button id="hintBtn" class="secondary inline">ヒントを見る <span class="badge warn">-15%</span></button>` : ""}
          <button id="submitBtn" class="primary">解答を送信</button>
          <button id="skipBtn" class="secondary">スキップ</button>
          <button id="switchBtn" class="ghost">モード切替</button>
        </div>
        <div id="feedback"></div>
      </section>
    `;

    // Wire up
    if (q.type === "mcq" || q.type === "ms") {
      $$(".choice").forEach(el => el.addEventListener("click", () => {
        if (q.type === "mcq") {
          $$(".choice").forEach(c => c.classList.remove("selected"));
          el.classList.add("selected");
        } else {
          el.classList.toggle("selected");
        }
      }));
    } else if (q.type === "estimate") {
      $("#numInput").addEventListener("keydown", (e) => { if (e.key==="Enter") $("#submitBtn").click(); });
    } else if (q.type === "order") {
      $$(".draggable").forEach(d => {
        d.draggable = true;
        d.addEventListener("dragstart", ev => ev.dataTransfer.setData("text/id", d.id));
      });
      $$(".drop-slot").forEach(slot => {
        slot.addEventListener("dragover", ev => ev.preventDefault());
        slot.addEventListener("drop", ev => {
          ev.preventDefault();
          const id = ev.dataTransfer.getData("text/id");
          const node = document.getElementById(id);
          slot.textContent = node.textContent;
          slot.dataset.value = node.dataset.value;
        });
      });
    } else if (q.type === "match") {
      // basic click-to-pair matching
      const lefts = $$(".match-left .choice");
      const rights = $$(".match-right .choice");
      lefts.forEach(l => l.addEventListener("click", () => {
        lefts.forEach(x => x.classList.remove("selected"));
        l.classList.add("selected");
      }));
      rights.forEach(r => r.addEventListener("click", () => {
        const sel = $(".match-left .choice.selected");
        if (sel) {
          r.dataset.paired = sel.dataset.value;
          r.classList.add("paired");
          sel.classList.add("paired");
        }
      }));
    }

    $("#submitBtn").addEventListener("click", () => submitAnswer({}));
    $("#skipBtn").addEventListener("click", () => submitAnswer({ skipped: true }));
    $("#switchBtn").addEventListener("click", () => {
      state.mode = (state.mode==="quant"?"qual":"quant");
      start(state.mode);
    });
    $("#hintBtn")?.addEventListener("click", showHint);

    // Keyboard shortcuts
    document.onkeydown = (e) => {
      if (["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) return;
      if (e.key === "Enter") $("#submitBtn").click();
      if (e.key.toLowerCase() === "h") $("#hintBtn")?.click();
      const n = Number(e.key);
      if (n>=1 && n<=9) {
        const el = $(`.choice[data-index="${n-1}"]`);
        el?.click();
      }
    };
  }

  function renderBody(q) {
    if (q.type === "mcq" || q.type === "ms") {
      return `<div class="choices">${q.choices.map((c,i) => `<button class="choice" data-index="${i}" data-value="${c.value}">${c.label}</button>`).join("")}</div>`;
    }
    if (q.type === "estimate") {
      return `<label>数値を入力（単位: ${q.unit || "件/％ 等"}）</label>
              <input id="numInput" type="number" step="${q.step ?? 1}" inputmode="decimal" placeholder="例: ${q.placeholder ?? 120}" />
              <p class="muted">許容誤差: ±${q.tolerance}${q.unit||""}（近いほど高得点）</p>`;
    }
    if (q.type === "order") {
      return `<div class="dd-container">
        <div>
          <div class="muted">カードを読み、右のスロットへ順番にドロップ</div>
          ${q.items.map((t,idx) => `<div class="draggable" id="drag${idx}" data-value="${idx}">${t}</div>`).join("")}
        </div>
        <div style="flex:1; min-width: 260px;">
          ${q.items.map((_,i)=> `<div class="drop-slot" data-index="${i}">ここに${i+1}番目</div>`).join("")}
        </div>
      </div>`;
    }
    if (q.type === "match") {
      return `<div class="dd-container">
        <div class="match-left" style="flex:1; min-width:260px;">
          <div class="muted">左：概念</div>
          ${q.pairs.map((p,i)=> `<div class="choice" data-value="${p.left}" data-index="${i}">${p.left}</div>`).join("")}
        </div>
        <div class="match-right" style="flex:1; min-width:260px;">
          <div class="muted">右：対応する説明（クリックで左とペア）</div>
          ${shuffle(q.pairs.map((p,i)=> ({...p, idx:i}))).map((p,i)=> `<div class="choice" data-index="${i}" data-key="${p.rightKey||p.left}">${p.right}</div>`).join("")}
        </div>
      </div>`;
    }
    return `<p>未対応のタイプです。</p>`;
  }

  function showHint() {
    const q = state.questions[state.currentIndex];
    if (!q || !q.hint) return;
    const fb = $("#feedback");
    const already = fb.dataset.hinted === "1";
    if (already) return;
    fb.dataset.hinted = "1";
    const hintNode = document.createElement("div");
    hintNode.className = "hint";
    hintNode.innerHTML = `<strong>ヒント：</strong>${q.hint}`;
    fb.appendChild(hintNode);
  }

  function getUserAnswer(q) {
    if (q.type === "mcq") {
      const sel = $(".choice.selected");
      if (!sel) return null;
      return sel.dataset.value;
    }
    if (q.type === "ms") {
      const sels = $$(".choice.selected").map(x => x.dataset.value);
      return sels;
    }
    if (q.type === "estimate") {
      const v = Number($("#numInput").value);
      return Number.isFinite(v) ? v : null;
    }
    if (q.type === "order") {
      const slots = $$(".drop-slot");
      if (!slots.every(s => s.dataset.value !== undefined)) return null;
      return slots.map(s => Number(s.dataset.value));
    }
    if (q.type === "match") {
      const rights = $$(".match-right .choice");
      return rights.map(r => ({ key: r.dataset.key, paired: r.dataset.paired || null }));
    }
    return null;
  }

  function evaluate(q, ans) {
    let correct = false;
    let base = DIFF_POINTS[q.difficulty] || 100;
    let detail = "";

    if (q.type === "mcq") {
      correct = ans === q.answer;
    } else if (q.type === "ms") {
      const a = new Set(ans || []);
      const c = new Set(q.answers);
      const ua = Array.from(a);
      const correctAll = ua.length === c.size && ua.every(x => c.has(x));
      // partial credit with penalty for false positives
      const tp = ua.filter(x => c.has(x)).length;
      const fp = ua.filter(x => !c.has(x)).length;
      correct = correctAll;
      const precision = tp / Math.max(1, tp + fp);
      const recall = tp / Math.max(1, c.size);
      const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
      base = base * f1; // 0..1
    } else if (q.type === "estimate") {
      const diff = Math.abs(ans - q.answer);
      if (diff <= q.tolerance) {
        correct = true;
        // scaled score: within tolerance => full, linearly decrease up to 2x tolerance
        const scale = 1 - Math.min(diff / (q.tolerance*2), 1);
        base = base * (0.6 + 0.4*scale);
        detail = `誤差 ${diff}${q.unit||""}`;
      } else {
        base = 0;
      }
    } else if (q.type === "order") {
      const ok = ans && ans.length === q.items.length && ans.every((v,i)=> v === i);
      correct = ok;
      // partial: Kendall tau-ish (simple)
      const inPlace = ans.filter((v,i)=> v===i).length;
      base = base * (inPlace / q.items.length);
    } else if (q.type === "match") {
      const total = q.pairs.length;
      let good = 0;
      (ans||[]).forEach(a => { if (a.key === a.paired) good++; });
      correct = good === total;
      base = base * (good / total);
    }

    return { correct, base, detail };
  }

  function adaptNext(correct, curDiff) {
    // Simple adaptive: try to bring a higher/lower difficulty question next
    const idx = state.currentIndex;
    const ahead = state.questions.slice(idx+1);
    if (ahead.length === 0) return;
    let targetIdx = -1;
    if (correct && curDiff < 5) {
      targetIdx = ahead.findIndex(q => q.difficulty >= Math.min(5, curDiff + 1));
    } else if (!correct && curDiff > 1) {
      targetIdx = ahead.findIndex(q => q.difficulty <= Math.max(1, curDiff - 1));
    }
    if (targetIdx >= 0) {
      const realIdx = idx + 1 + targetIdx;
      const tmp = state.questions[idx+1];
      state.questions[idx+1] = state.questions[realIdx];
      state.questions[realIdx] = tmp;
    }
  }

  function submitAnswer({ skipped=false, autoTimeout=false }) {
    const q = state.questions[state.currentIndex];
    clearInterval(state.timer);
    const fb = $("#feedback");
    let ans = null, ev=null;

    if (!skipped && !autoTimeout) {
      ans = getUserAnswer(q);
      if (ans === null) { fb.innerHTML = `<div class="hint">選択または入力してください。</div>`; return; }
      ev = evaluate(q, ans);
    } else {
      ev = { correct:false, base:0 };
    }

    // compute score with multiplier and time bonus & hint penalty
    let gained = ev.base;
    const hinted = fb.dataset.hinted === "1";
    if (hinted) gained *= 0.85;
    const timeBonus = Math.max(0, Math.min(1, state.timeLeft / (q.timeLimit || 25))) * 0.20; // up to +20%
    gained *= (1 + timeBonus);
    // streak
    if (ev.correct) state.streak++; else state.streak = 0;
    state.multiplier = computeMultiplier(state.streak);
    gained *= state.multiplier;

    state.score += gained;
    state.asked.push({
      id: q.id, prompt: q.prompt, type: q.type, difficulty: q.difficulty,
      userAnswer: ans, correct: ev.correct, points: Math.round(gained),
      maxPoints: DIFF_POINTS[q.difficulty], tags: q.tags || [],
      timeRemaining: state.timeLeft
    });

    // UI feedback
    const explain = q.explanation ? `<div class="takeaway"><strong>学び：</strong>${q.explanation}${q.reading ? `<br/><small>参考: ${q.reading.map(r=>`<a href="${r.url}" target="_blank" rel="noopener">${r.label}</a>`).join(" / ")}</small>`:""}</div>` : "";
    fb.innerHTML = `
      <div class="${ev.correct ? "badge good" : "badge bad"}">${ev.correct?"正解！":"不正解"}</div>
      <div>今回の獲得：<strong>${Math.round(gained)}</strong> 点 ${ev.detail?`<span class="muted">(${ev.detail})</span>`:""} ${hinted?`<span class="badge warn">ヒント使用</span>`:""} </div>
      ${explain}
    `;
    if (ev.correct) confettiBurst($("#submitBtn"));

    // adapt next sequence
    adaptNext(ev.correct, q.difficulty);

    // next
    setTimeout(() => {
      state.currentIndex++;
      if (state.currentIndex >= state.questions.length) return renderReview();
      renderQuestion();
    }, 700);
  }

  function renderReview() {
    saveBest(state.mode, state.score);
    const total = state.questions.length;
    const corrects = state.asked.filter(x => x.correct).length;
    const duration = Math.round((Date.now() - state.startedAt)/1000);

    $("#screen").innerHTML = `
      <section class="card">
        <h2>おつかれさま、Yoshi！</h2>
        <p>結果は <strong>${corrects}/${total}</strong> 正解、スコアは <strong>${Math.round(state.score)}</strong> 点。所要時間は約 <strong>${duration}s</strong> でした。</p>
        <div class="status">
          <div class="pill">モード: ${state.mode==="quant"?"定量":"定性"}</div>
          <div class="pill">BEST（保存済）: ${loadBest(state.mode)}</div>
          <div class="pill"><button id="downloadBtn" class="secondary">結果JSONをDL</button></div>
          <div class="pill"><button id="retryBtn" class="primary">もう一度</button></div>
          <div class="pill"><button id="homeBtn" class="ghost">ホームへ</button></div>
        </div>
        <h3>復習</h3>
        <div class="review-grid">
          ${state.asked.map(a => `
            <div class="review-item">
              <div class="qmeta">
                <span class="badge">${a.type.toUpperCase()}</span>
                <span class="badge">難易度${a.difficulty}</span>
                ${a.tags.map(t=> `<span class="badge">${t}</span>`).join("")}
                <span class="badge ${a.correct?"good":"bad"}">${a.correct?"正解":"不正解"}</span>
                <span class="badge">+${a.points}</span>
              </div>
              <div><strong>${a.prompt}</strong></div>
            </div>
          `).join("")}
        </div>
      </section>
    `;

    $("#downloadBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ meta:{
        when: new Date().toISOString(), mode: state.mode
      }, result: state.asked, score: Math.round(state.score) }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mrq_result_${state.mode}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
    $("#retryBtn").addEventListener("click", () => start(state.mode));
    $("#homeBtn").addEventListener("click", renderHome);
  }

  // ---------- Utilities ----------
  function shuffle(arr) { for (let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

  // ---------- Global UI ----------
  function wireGlobal() {
    $("#toggleDark").addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const pressed = document.body.classList.contains("dark");
      $("#toggleDark").setAttribute("aria-pressed", String(pressed));
    });
    $("#howToBtn").addEventListener("click", () => openModal());
    $("#aboutLink").addEventListener("click", (e) => {
      e.preventDefault();
      openModal("参考・クレジット", `
        <p>本アプリは、医療マーケティング実務に携わる方が「判断の勘所」を短時間で復習できるよう設計しました。</p>
        <ul>
          <li>問題の一部は、<em>Medinew [メディニュー]</em> の記事や概念を参考に作成しています。</li>
          <li>各問題の「参考」で記事リンクを掲載しています。詳細は元記事をご覧ください。</li>
        </ul>
        <p class="muted">クイズ内容は教育目的の一般的な情報であり、各社の規程・法令遵守ガイドの確認を優先してください。</p>
      `);
    });
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e)=> { if (e.target.id==="modal") closeModal(); });
  }
  function openModal(title, bodyHtml) {
    if (title) $("#modalTitle").textContent = title;
    if (bodyHtml) $("#modalBody").innerHTML = bodyHtml;
    $("#modal").setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    $("#modal").setAttribute("aria-hidden", "true");
  }

  // ---------- Boot ----------
  window.addEventListener("load", () => {
    wireGlobal();
    renderHome();
  });
})();
