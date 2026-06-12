/* =====================================================================
   Kids Jeopardy! — game logic & state machine
   Relies on QUESTION_POOL (js/questions.js), Tailwind, canvas-confetti,
   and the browser's speechSynthesis API.
   ===================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  Constants                                                         */
  /* ------------------------------------------------------------------ */
  const POINT_TIERS = [10, 20, 50, 100];
  const CATEGORIES_PER_GAME = 5;
  const MAX_PLAYERS = 6;
  const MIN_PLAYERS = 1;

  // Distinct, kid-friendly colors for up to 6 players.
  const PLAYER_COLORS = [
    "#E53935", // red
    "#1E88E5", // blue
    "#43A047", // green
    "#FB8C00", // orange
    "#8E24AA", // purple
    "#00ACC1", // teal
  ];

  // Words <-> digits, both directions, for numeric leniency.
  const NUMBER_WORDS = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
    "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
    "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
    "18": "eighteen", "19": "nineteen", "20": "twenty", "30": "thirty",
    "40": "forty", "50": "fifty", "60": "sixty", "70": "seventy",
    "80": "eighty", "90": "ninety", "100": "one hundred",
  };
  // Reverse map: word -> digit.
  const WORD_TO_DIGIT = Object.fromEntries(
    Object.entries(NUMBER_WORDS).map(([digit, word]) => [word, digit])
  );

  /* ------------------------------------------------------------------ */
  /*  Game state                                                        */
  /* ------------------------------------------------------------------ */
  const state = {
    players: [],        // [{ name, score }]
    board: [],          // [{ category, tiles: { 10:{q,used}, ... } }]
    active: null,       // { catIndex, points, question, tried:Set, currentPlayer }
    remainingTiles: 0,
  };

  /* ------------------------------------------------------------------ */
  /*  Tiny DOM helpers                                                  */
  /* ------------------------------------------------------------------ */
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  };

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
    $(id).classList.remove("hidden");
  }

  /* ------------------------------------------------------------------ */
  /*  Utilities                                                         */
  /* ------------------------------------------------------------------ */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ------------------------------------------------------------------ */
  /*  Read-aloud (Web Speech API)                                       */
  /* ------------------------------------------------------------------ */
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92;   // a touch slower for young listeners
      u.pitch = 1.05;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* speech is a nice-to-have; ignore failures */
    }
  }
  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  /* ------------------------------------------------------------------ */
  /*  Confetti                                                          */
  /* ------------------------------------------------------------------ */
  function celebrate(big) {
    if (typeof confetti !== "function") return;
    if (big) {
      const end = Date.now() + 1200;
      (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 } });
        confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
    } else {
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.65 } });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Answer matching (the leniency requirement)                        */
  /* ------------------------------------------------------------------ */

  // Lowercase, strip punctuation, drop Jeopardy phrasing & articles.
  function normalize(str) {
    let s = (str || "").toLowerCase().trim();
    s = s.replace(/[^a-z0-9\s]/g, " ");          // drop punctuation
    s = s.replace(/\s+/g, " ").trim();
    // Remove leading "what is / whats / who is / where is / it is / its / the answer is"
    s = s.replace(/^(the answer is|what is|whats|what are|who is|whos|where is|wheres|it is|its)\s+/i, "");
    s = s.replace(/\s+/g, " ").trim();
    return s;
  }

  // Drop leading articles from a single token-string.
  function stripArticles(s) {
    return s.replace(/^(a|an|the)\s+/i, "").trim();
  }

  // Convert every number token to its digit form so "3" and "three" match.
  function numbersToDigits(s) {
    // Whole-string match first (handles multi-word words like "one hundred").
    if (WORD_TO_DIGIT[s] !== undefined) return WORD_TO_DIGIT[s];
    return s
      .split(" ")
      .map((tok) => (WORD_TO_DIGIT[tok] !== undefined ? WORD_TO_DIGIT[tok] : tok))
      .join(" ");
  }

  // Classic Levenshtein edit distance.
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => i);
    for (let j = 1; j <= n; j++) {
      let prev = dp[0];
      dp[0] = j;
      for (let i = 1; i <= m; i++) {
        const temp = dp[i];
        dp[i] = Math.min(
          dp[i] + 1,            // deletion
          dp[i - 1] + 1,        // insertion
          prev + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
        );
        prev = temp;
      }
    }
    return dp[m];
  }

  // Allowed edit distance grows with word length (more leniency for long words).
  function allowedDistance(len) {
    if (len <= 3) return 1;
    if (len <= 6) return 2;
    return 3;
  }

  // Is the player's typed input close enough to the correct answer?
  function isCorrect(input, answer) {
    let a = stripArticles(normalize(input));
    let b = stripArticles(normalize(answer));
    if (!a) return false;

    // Exact match after normalization.
    if (a === b) return true;

    // Numeric equivalence: "3" == "three", "forty" == "40". Numbers must match
    // EXACTLY (no fuzzy distance) — otherwise "5" and "4" would count as equal.
    const aNum = numbersToDigits(a);
    const bNum = numbersToDigits(b);
    if (aNum === bNum) return true;

    // If the answer is stored as bare digits (e.g. "3"), don't fuzzy-match —
    // single digits are too close together for edit distance to be safe
    // ("4" would match "3"). Spelled-out number words still get leniency below.
    if (/^[0-9]+$/.test(b)) return false;

    // Whole-string fuzzy match (handles multi-word answers like "ice cream").
    if (levenshtein(a, b) <= allowedDistance(b.length)) return true;

    // If the answer is a single word, also accept it appearing (fuzzily) as
    // any single word the child typed (e.g. they added an extra word).
    if (!b.includes(" ")) {
      const tokens = a.split(" ");
      for (const tok of tokens) {
        if (tok === b) return true;
        if (levenshtein(tok, b) <= allowedDistance(b.length)) return true;
      }
    }
    return false;
  }

  /* ================================================================== */
  /*  SETUP SCREEN                                                      */
  /* ================================================================== */
  function addPlayerRow(name) {
    const container = $("player-inputs");
    if (container.children.length >= MAX_PLAYERS) return;

    const row = el("div", "player-row flex items-center gap-2");
    const idx = container.children.length;

    const dot = el("span", "w-4 h-4 rounded-full flex-shrink-0");
    dot.style.background = PLAYER_COLORS[idx % PLAYER_COLORS.length];

    const input = el("input");
    input.type = "text";
    input.maxLength = 14;
    input.placeholder = "Player " + (idx + 1) + " name";
    input.value = name || "";
    input.className =
      "flex-1 rounded-xl px-3 py-2 text-lg text-jeopardy-navy font-semibold " +
      "focus:outline-none focus:ring-4 focus:ring-jeopardy-gold";
    input.addEventListener("input", refreshSetupState);

    const removeBtn = el("button", "text-red-300 hover:text-red-500 text-2xl px-2 leading-none");
    removeBtn.textContent = "✕";
    removeBtn.title = "Remove player";
    removeBtn.addEventListener("click", () => {
      row.remove();
      relabelPlayerRows();
      refreshSetupState();
    });

    row.append(dot, input, removeBtn);
    container.appendChild(row);
    relabelPlayerRows();
    refreshSetupState();
  }

  function relabelPlayerRows() {
    const rows = $("player-inputs").children;
    Array.from(rows).forEach((row, i) => {
      const dot = row.querySelector("span");
      const input = row.querySelector("input");
      if (dot) dot.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];
      if (input && !input.value) input.placeholder = "Player " + (i + 1) + " name";
      // Hide the remove button when only one row remains.
      const removeBtn = row.querySelector("button");
      if (removeBtn) removeBtn.style.visibility = rows.length > MIN_PLAYERS ? "visible" : "hidden";
    });
  }

  function getEnteredNames() {
    return Array.from($("player-inputs").querySelectorAll("input"))
      .map((i) => i.value.trim())
      .filter((n) => n.length > 0);
  }

  function refreshSetupState() {
    const names = getEnteredNames();
    const rows = $("player-inputs").children.length;
    const startBtn = $("start-btn");
    startBtn.disabled = names.length < 1;

    const hint = $("setup-hint");
    if (names.length < 1) hint.textContent = "Type at least one player name to start.";
    else hint.textContent = "";

    $("add-player-btn").disabled = rows >= MAX_PLAYERS;
    $("add-player-btn").classList.toggle("opacity-40", rows >= MAX_PLAYERS);
    $("add-player-btn").classList.toggle("cursor-not-allowed", rows >= MAX_PLAYERS);
  }

  /* ================================================================== */
  /*  BUILD A GAME                                                      */
  /* ================================================================== */
  function buildGame() {
    // Choose 5 categories from the pool, randomly.
    const chosen = shuffle(QUESTION_POOL).slice(0, CATEGORIES_PER_GAME);

    state.board = chosen.map((cat) => {
      const tiles = {};
      POINT_TIERS.forEach((pts) => {
        const candidates = (cat.tiers && cat.tiers[pts]) || [];
        const q = candidates.length ? pickRandom(candidates) : null;
        tiles[pts] = { q, used: q === null }; // if no question, treat as already used
      });
      return { category: cat.category, tiles };
    });

    state.remainingTiles = state.board.reduce(
      (n, cat) => n + POINT_TIERS.filter((p) => !cat.tiles[p].used).length,
      0
    );
    state.active = null;
  }

  /* ================================================================== */
  /*  BOARD SCREEN                                                      */
  /* ================================================================== */
  function renderScoreboard() {
    const sb = $("scoreboard");
    sb.innerHTML = "";
    state.players.forEach((p, i) => {
      const chip = el("span", "score-chip");
      chip.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];
      chip.textContent = p.name + ": " + p.score;
      sb.appendChild(chip);
    });
  }

  function renderBoard() {
    renderScoreboard();
    const grid = $("board-grid");
    grid.innerHTML = "";

    // Row 1: category headers.
    state.board.forEach((cat) => {
      const h = el("div", "category-header");
      h.textContent = cat.category;
      grid.appendChild(h);
    });

    // Rows 2-5: one row per point tier, column-major visual order.
    POINT_TIERS.forEach((pts) => {
      state.board.forEach((cat, catIndex) => {
        const tile = el("div", "tile");
        const cell = cat.tiles[pts];
        if (cell.used) {
          tile.classList.add("used");
        } else {
          tile.textContent = pts;
          tile.addEventListener("click", () => openClue(catIndex, pts));
        }
        grid.appendChild(tile);
      });
    });

    showScreen("board-screen");
  }

  /* ================================================================== */
  /*  CLUE MODAL                                                        */
  /* ================================================================== */
  function openClue(catIndex, points) {
    const cell = state.board[catIndex].tiles[points];
    if (!cell || cell.used || !cell.q) return;

    state.active = {
      catIndex,
      points,
      question: cell.q,
      tried: new Set(),       // player indexes that already missed this clue
      currentPlayer: null,
      resolved: false,        // true once correct/skip locks the clue
    };

    // Header
    $("clue-category").textContent = state.board[catIndex].category;
    $("clue-points").textContent = points;

    // Clue text
    const clueEl = $("clue-text");
    clueEl.textContent = cell.q.clue;
    clueEl.classList.remove("pop-in");
    void clueEl.offsetWidth; // reflow to restart animation
    clueEl.classList.add("pop-in");

    // Reset answer area (and re-enable any controls locked by the last clue)
    hideAnswerArea();
    $("answer-feedback").textContent = "";
    $("answer-input").value = "";
    $("answer-input").disabled = false;
    $("submit-answer-btn").disabled = false;

    // Buzz buttons
    renderBuzzButtons();

    showScreen("clue-modal");
    speak(cell.q.clue);
  }

  function renderBuzzButtons() {
    const wrap = $("buzz-buttons");
    wrap.innerHTML = "";
    state.players.forEach((p, i) => {
      const btn = el("button", "buzz-btn");
      btn.textContent = p.name;
      btn.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];
      if (state.active.tried.has(i)) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => buzz(i));
      }
      wrap.appendChild(btn);
    });

    // Update prompt depending on whether anyone is left to answer.
    const remaining = state.players.length - state.active.tried.size;
    $("buzz-prompt").textContent =
      remaining > 0
        ? "Press your button to answer!"
        : "Nobody got it — press Skip to see the answer.";
  }

  function buzz(playerIndex) {
    if (!state.active || state.active.resolved) return;
    if (state.active.tried.has(playerIndex)) return;
    stopSpeaking();
    state.active.currentPlayer = playerIndex;

    $("answering-name").textContent = state.players[playerIndex].name;
    showAnswerArea();

    // Reset input/choice widgets each buzz.
    $("answer-input").value = "";
    $("answer-feedback").textContent = "";
    $("answer-feedback").className = "mt-4 text-2xl font-display h-8";
    $("choices-wrap").classList.add("hidden");
    $("text-input-wrap").classList.remove("hidden");
    $("show-choices-btn").classList.remove("hidden");
    renderChoices();

    setTimeout(() => $("answer-input").focus(), 50);
  }

  function showAnswerArea() {
    const area = $("answer-area");
    area.classList.remove("hidden");
    area.classList.remove("pop-in");
    void area.offsetWidth;
    area.classList.add("pop-in");
  }
  function hideAnswerArea() {
    $("answer-area").classList.add("hidden");
  }

  function renderChoices() {
    const wrap = $("choices-wrap");
    wrap.innerHTML = "";
    const q = state.active.question;
    const choices = shuffle(q.choices || []);
    choices.forEach((choice) => {
      const btn = el("button", "choice-btn");
      btn.textContent = choice;
      btn.addEventListener("click", () => handleAnswer(choice, btn));
      wrap.appendChild(btn);
    });
  }

  function submitTypedAnswer() {
    const val = $("answer-input").value;
    if (!val.trim()) return;
    handleAnswer(val, null);
  }

  // Central answer handler for both typed and multiple-choice answers.
  function handleAnswer(value, choiceBtn) {
    if (!state.active || state.active.resolved) return;
    if (state.active.currentPlayer === null) return;
    const q = state.active.question;
    const correct = isCorrect(value, q.answer);

    if (correct) {
      markCorrect();
    } else {
      markWrong(choiceBtn);
    }
  }

  function markCorrect() {
    state.active.resolved = true;
    const pIndex = state.active.currentPlayer;
    state.players[pIndex].score += state.active.points;

    const fb = $("answer-feedback");
    fb.textContent = "✅ Correct! +" + state.active.points;
    fb.className = "mt-4 text-2xl font-display h-8 feedback-correct";

    stopSpeaking();
    celebrate(false);

    // Mark tile used and move on after a short beat.
    finishClue(true);
  }

  function markWrong(choiceBtn) {
    const pIndex = state.active.currentPlayer;
    state.active.tried.add(pIndex);

    const fb = $("answer-feedback");
    fb.textContent = "❌ Not quite! Another player can try.";
    fb.className = "mt-4 text-2xl font-display h-8 feedback-wrong";

    if (choiceBtn) choiceBtn.disabled = true;

    // Reset to buzz state so someone else can jump in.
    state.active.currentPlayer = null;
    hideAnswerArea();
    renderBuzzButtons();

    // If everyone has now tried, nudge toward Skip.
    const remaining = state.players.length - state.active.tried.size;
    if (remaining <= 0) {
      $("buzz-prompt").textContent =
        "Nobody got it — press Skip to see the answer.";
    }
  }

  function skipClue() {
    if (!state.active || state.active.resolved) return;
    state.active.resolved = true;
    // Briefly reveal the correct answer, then move on.
    const ans = state.active.question.answer;
    const fb = $("answer-feedback");
    showAnswerArea();
    $("answering-name").textContent = "The answer was";
    $("text-input-wrap").classList.add("hidden");
    $("show-choices-btn").classList.add("hidden");
    $("choices-wrap").classList.add("hidden");
    fb.textContent = "👉 " + ans;
    fb.className = "mt-4 text-2xl font-display h-8 feedback-correct";
    stopSpeaking();
    speak("The answer was " + ans);
    finishClue(false);
  }

  // Mark the active tile used, close the modal, advance the game.
  function finishClue(wasCorrect) {
    const { catIndex, points } = state.active;
    const cell = state.board[catIndex].tiles[points];
    if (!cell.used) {
      cell.used = true;
      state.remainingTiles -= 1;
    }

    const delay = wasCorrect ? 1400 : 1600;
    // Disable further interaction during the reveal beat.
    $("buzz-buttons").querySelectorAll("button").forEach((b) => (b.disabled = true));
    $("choices-wrap").querySelectorAll("button").forEach((b) => (b.disabled = true));
    $("submit-answer-btn").disabled = true;
    $("answer-input").disabled = true;
    $("skip-btn").disabled = true;

    setTimeout(() => {
      $("skip-btn").disabled = false;
      state.active = null;
      stopSpeaking();
      if (state.remainingTiles <= 0) {
        showEndScreen();
      } else {
        renderBoard();
      }
    }, delay);
  }

  /* ================================================================== */
  /*  END SCREEN                                                        */
  /* ================================================================== */
  function showEndScreen() {
    const sorted = state.players
      .map((p, i) => ({ ...p, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }))
      .sort((a, b) => b.score - a.score);

    const topScore = sorted[0].score;
    const winners = sorted.filter((p) => p.score === topScore);

    const winnerEl = $("winner-name");
    if (winners.length === 1) {
      winnerEl.textContent = winners[0].name + "!";
    } else {
      winnerEl.textContent = "It's a tie! " + winners.map((w) => w.name).join(" & ");
    }

    const list = $("final-scores");
    list.innerHTML = "";
    sorted.forEach((p, rank) => {
      const row = el("div", "flex items-center justify-between bg-jeopardy-navy/70 rounded-xl px-4 py-2");
      const left = el("div", "flex items-center gap-3");
      const medal = el("span", "text-2xl w-8 text-center");
      medal.textContent = rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : "⭐";
      const dot = el("span", "w-4 h-4 rounded-full inline-block");
      dot.style.background = p.color;
      const name = el("span", "text-xl font-semibold");
      name.textContent = p.name;
      left.append(medal, dot, name);

      const score = el("span", "font-display text-2xl text-jeopardy-gold");
      score.textContent = p.score;
      row.append(left, score);
      list.appendChild(row);
    });

    showScreen("end-screen");
    celebrate(true);
    speak(
      winners.length === 1
        ? "The winner is " + winners[0].name + "! Great job everyone!"
        : "It's a tie! Great job everyone!"
    );
  }

  /* ================================================================== */
  /*  START / RESET                                                     */
  /* ================================================================== */
  function startGame() {
    const names = getEnteredNames();
    if (names.length < 1) return;
    state.players = names.slice(0, MAX_PLAYERS).map((name) => ({ name, score: 0 }));
    buildGame();
    renderBoard();
  }

  function resetGame() {
    stopSpeaking();
    state.players = [];
    state.board = [];
    state.active = null;
    state.remainingTiles = 0;
    // Rebuild the setup screen with a single empty row.
    $("player-inputs").innerHTML = "";
    addPlayerRow("");
    refreshSetupState();
    showScreen("setup-screen");
  }

  /* ================================================================== */
  /*  WIRING                                                            */
  /* ================================================================== */
  function init() {
    // Setup screen
    addPlayerRow(""); // start with one row
    $("add-player-btn").addEventListener("click", () => addPlayerRow(""));
    $("start-btn").addEventListener("click", startGame);

    // Clue modal
    $("submit-answer-btn").addEventListener("click", submitTypedAnswer);
    $("answer-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitTypedAnswer();
    });
    $("show-choices-btn").addEventListener("click", () => {
      $("choices-wrap").classList.toggle("hidden");
    });
    $("speak-btn").addEventListener("click", () => {
      if (state.active) speak(state.active.question.clue);
    });
    $("skip-btn").addEventListener("click", skipClue);

    // End screen
    $("replay-btn").addEventListener("click", resetGame);

    refreshSetupState();
    showScreen("setup-screen");
  }

  // Some browsers need a nudge to load voices before first speak.
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
