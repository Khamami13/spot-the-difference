// Game state and rules for Warung Senja — Cari Bedanya.
// One job: own the state machine (menu / play / level-done / won / lost),
// scoring, the timer, hints, and painting the two panels (scene + markers).
// Scene art lives in scenes-*.js; level data in levels.js; sound in audio.js.

import { LEVELS, SCENE_HEIGHT, SCENE_WIDTH } from './levels.js';
import { drawWarung } from './scenes-warung.js';
import { drawPasar } from './scenes-pasar.js';
import { drawPantai } from './scenes-pantai.js';
import { isMuted, playFound, playHint, playLose, playWin, playWrong, setMuted } from './audio.js';

const PAINTERS = { warung: drawWarung, pasar: drawPasar, pantai: drawPantai };
const WRONG_PENALTY_SECONDS = 5;
const FIND_POINTS = 100;
const COMBO_STEP = 10;
const HINT_COST = 25;
const HINT_PULSE_MS = 2600;
const BEST_KEY = 'warung-senja-best';

export const SCREEN_MENU = 'menu';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_WON = 'won';
export const SCREEN_LOST = 'lost';

export function createGame(elements) {
  const { canvasA, canvasB, scoreEl, remainEl, timerBar, timerText, hintLeftEl,
    messageEl, statusEl, overlayMenu, overlayEnd, endEmoji, endTitle, endText,
    endScore, endPrimary, endSecondary, hintBtn, soundBtn } = elements;
  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');

  const state = {
    screen: SCREEN_MENU,
    levelIndex: 0,
    found: new Set(),
    score: 0,
    combo: 0,
    hintsLeft: 3,
    timeLeft: LEVELS[0].timeLimit,
    lastTick: 0,
    hintPulse: null, // { diff, until }
    bursts: [], // { x, y, born } expanding rings on a find
    wrongMarks: [], // { x, y, born } red X flashes on a miss
    shakeUntil: 0,
    unlocked: 1, // how many levels the player may open (menu buttons stay open anyway)
  };

  function level() {
    return LEVELS[state.levelIndex];
  }

  function readBest() {
    try {
      return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
    } catch {
      return 0;
    }
  }

  function saveBest(value) {
    try {
      window.localStorage.setItem(BEST_KEY, String(value));
    } catch {
      // Storage can be off: the best score then lasts this visit only.
    }
  }

  function fmtTime(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function setMessage(html, kind) {
    messageEl.innerHTML = html;
    messageEl.className = kind ?? '';
  }

  function announce(text) {
    statusEl.textContent = text;
  }

  function syncHud() {
    scoreEl.textContent = String(state.score);
    remainEl.textContent = String(level().diffs.length - state.found.size);
    hintLeftEl.textContent = String(state.hintsLeft);
    const frac = Math.max(0, state.timeLeft / level().timeLimit);
    timerBar.style.width = `${frac * 100}%`;
    timerBar.classList.toggle('low', state.timeLeft <= 30);
    timerText.textContent = `⏱ ${fmtTime(state.timeLeft)}`;
    soundBtn.textContent = isMuted() ? '🔇 Suara: Mati — M' : '🔊 Suara: Nyala — M';
    document.querySelectorAll('#levelBtns button').forEach((btn, i) => {
      btn.classList.toggle('active', i === state.levelIndex);
      btn.classList.toggle('locked', i >= state.unlocked && state.screen === SCREEN_MENU);
    });
  }

  // ---- markers -----------------------------------------------------------
  function drawMarkers(ctx, now) {
    for (const diff of level().diffs) {
      if (!state.found.has(diff.id)) continue;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.r + 7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 166, 35, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '700 20px "Trebuchet MS", sans-serif';
      ctx.fillStyle = '#f5a623';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#7a4a21';
      ctx.lineWidth = 4;
      ctx.strokeText('✓', diff.x, diff.y + 1);
      ctx.fillText('✓', diff.x, diff.y + 1);
    }
    // Expanding gold rings where a difference was just found.
    state.bursts = state.bursts.filter((burst) => now - burst.born < 700);
    for (const burst of state.bursts) {
      const t = (now - burst.born) / 700;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, 10 + t * 34, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 166, 35, ${1 - t})`;
      ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.stroke();
    }
    // Red X flashes where the player clicked wrongly.
    state.wrongMarks = state.wrongMarks.filter((mark) => now - mark.born < 600);
    for (const mark of state.wrongMarks) {
      const t = (now - mark.born) / 600;
      ctx.strokeStyle = `rgba(217, 79, 61, ${1 - t})`;
      ctx.lineWidth = 5;
      const s = 12;
      ctx.beginPath();
      ctx.moveTo(mark.x - s, mark.y - s);
      ctx.lineTo(mark.x + s, mark.y + s);
      ctx.moveTo(mark.x + s, mark.y - s);
      ctx.lineTo(mark.x - s, mark.y + s);
      ctx.stroke();
    }
    // Hint pulse: a breathing ring around one unfound difference.
    if (state.hintPulse && now < state.hintPulse.until) {
      const d = state.hintPulse.diff;
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      ctx.beginPath();
      ctx.arc(d.x, d.y, (d.r + 8) * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = '#6ec6ff';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '700 13px "Trebuchet MS", sans-serif';
      ctx.fillStyle = '#6ec6ff';
      ctx.textAlign = 'center';
      ctx.fillText('DI SINI!', d.x, d.y - d.r - 14);
    }
  }

  function paint(now) {
    const painter = PAINTERS[level().id];
    const shake = now < state.shakeUntil ? (Math.random() - 0.5) * 8 : 0;
    for (const [ctx, variant] of [[ctxA, 'A'], [ctxB, 'B']]) {
      ctx.save();
      ctx.translate(shake, 0);
      painter(ctx, variant);
      drawMarkers(ctx, now);
      ctx.restore();
    }
  }

  // ---- flow --------------------------------------------------------------
  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.combo = 0;
    state.hintsLeft = level().hints;
    state.timeLeft = level().timeLimit;
    state.hintPulse = null;
    state.bursts = [];
    state.wrongMarks = [];
    state.screen = SCREEN_PLAY;
    state.lastTick = performance.now();
    overlayMenu.classList.remove('show');
    overlayEnd.classList.remove('show');
    setMessage(`Level ${index + 1} · ${level().name} — ${level().blurb}`);
    announce(`Level ${index + 1}, ${level().name}. ${level().diffs.length} perbedaan.`);
    syncHud();
  }

  function showEnd({ emoji, title, text, scoreLine, primary, onPrimary, onSecondary }) {
    state.screen = primary === 'Lanjut ke Level Berikutnya' ? SCREEN_LEVEL_DONE
      : primary === 'Main Lagi' ? SCREEN_WON : SCREEN_LOST;
    endEmoji.textContent = emoji;
    endTitle.textContent = title;
    endText.textContent = text;
    endScore.textContent = scoreLine;
    endPrimary.textContent = primary;
    overlayEnd.classList.add('show');
    endPrimary.onclick = onPrimary;
    endSecondary.onclick = onSecondary ?? (() => showMenu());
  }

  function showMenu() {
    state.screen = SCREEN_MENU;
    overlayEnd.classList.remove('show');
    overlayMenu.classList.add('show');
    syncHud();
  }

  function finishLevel() {
    const bonus = Math.round(state.timeLeft) * 5;
    state.score += bonus;
    state.unlocked = Math.max(state.unlocked, state.levelIndex + 2);
    playWin();
    syncHud();
    if (state.levelIndex + 1 < LEVELS.length) {
      const next = LEVELS[state.levelIndex + 1];
      showEnd({
        emoji: '🎉',
        title: `Level ${state.levelIndex + 1} Selesai!`,
        text: `Semua ${level().diffs.length} perbedaan di ${level().name} ketemu. Bonus waktu: +${bonus} poin. Selanjutnya: ${next.name} — ${next.diffs.length} perbedaan, ${fmtTime(next.timeLimit)} saja.`,
        scoreLine: `Skor: ${state.score}`,
        primary: 'Lanjut ke Level Berikutnya',
        onPrimary: () => startLevel(state.levelIndex + 1),
      });
    } else {
      const best = Math.max(readBest(), state.score);
      saveBest(best);
      showEnd({
        emoji: '🏆',
        title: 'Kamu Menang — Semua Level Selesai!',
        text: `Tiga adegan, ${LEVELS.reduce((n, l) => n + l.diffs.length, 0)} perbedaan, semuanya ketemu. Kamu benar-benar mata elang! Bonus waktu terakhir: +${bonus} poin.`,
        scoreLine: `Skor akhir: ${state.score} · Skor terbaik: ${best}`,
        primary: 'Main Lagi',
        onPrimary: () => startLevel(0),
      });
    }
  }

  function loseLevel() {
    playLose();
    const remaining = level().diffs.length - state.found.size;
    showEnd({
      emoji: '⏰',
      title: 'Waktu Habis!',
      text: `Sayang sekali — masih ${remaining} perbedaan tersembunyi di ${level().name}. Coba lagi, kali ini lebih cepat!`,
      scoreLine: `Skor: ${state.score}`,
      primary: 'Coba Lagi',
      onPrimary: () => startLevel(state.levelIndex),
    });
  }

  // ---- actions -----------------------------------------------------------
  function handleClick(event, canvas) {
    if (state.screen !== SCREEN_PLAY) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT;
    const now = performance.now();
    const hit = level().diffs.find((d) => !state.found.has(d.id)
      && Math.hypot(x - d.x, y - d.y) <= d.r + 6);
    if (hit) {
      state.found.add(hit.id);
      state.combo += 1;
      const gained = FIND_POINTS + (state.combo - 1) * COMBO_STEP;
      state.score += gained;
      state.bursts.push({ x: hit.x, y: hit.y, born: now });
      playFound();
      const left = level().diffs.length - state.found.size;
      setMessage(`<span class="good">✓ Ketemu: ${hit.label}! +${gained} poin</span> ${left === 0 ? '' : `— sisa ${left} lagi.`}`, 'good');
      announce(`Ketemu ${hit.label}. Sisa ${left}.`);
      syncHud();
      if (left === 0) finishLevel();
      return;
    }
    state.combo = 0;
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY_SECONDS);
    state.wrongMarks.push({ x, y, born: now });
    state.shakeUntil = now + 220;
    playWrong();
    setMessage(`<span class="bad">✗ Bukan di situ — waktu −${WRONG_PENALTY_SECONDS} detik!</span> Perhatikan baik-baik…`, 'bad');
    announce('Bukan perbedaan. Waktu berkurang lima detik.');
    syncHud();
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY) return;
    const remaining = level().diffs.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return;
    if (state.hintsLeft <= 0) {
      setMessage('<span class="bad">Petunjuk habis untuk level ini.</span>');
      return;
    }
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - HINT_COST);
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintPulse = { diff: pick, until: performance.now() + HINT_PULSE_MS };
    playHint();
    setMessage(`<span class="good">💡 Petunjuk: lihat lingkaran biru berdenyut… (−${HINT_COST} poin)</span>`);
    syncHud();
  }

  function toggleSound() {
    setMuted(!isMuted());
    syncHud();
  }

  // ---- main loop ---------------------------------------------------------
  function tick(now) {
    if (state.screen === SCREEN_PLAY) {
      const dt = Math.min(0.5, (now - state.lastTick) / 1000);
      state.lastTick = now;
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        syncHud();
        paint(now);
        loseLevel();
        requestAnimationFrame(tick);
        return;
      }
      syncHud();
    }
    paint(now);
    requestAnimationFrame(tick);
  }

  canvasA.addEventListener('click', (e) => handleClick(e, canvasA));
  canvasB.addEventListener('click', (e) => handleClick(e, canvasB));
  hintBtn.addEventListener('click', useHint);
  soundBtn.addEventListener('click', toggleSound);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') useHint();
    if (e.key === 'r' || e.key === 'R') startLevel(state.levelIndex);
    if (e.key === 'm' || e.key === 'M') toggleSound();
    if (e.key === 'Enter' && state.screen === SCREEN_MENU) startLevel(0);
  });

  return {
    state,
    startLevel,
    showMenu,
    useHint,
    toggleSound,
    syncHud,
    finishLevel,
    run() {
      state.lastTick = performance.now();
      syncHud();
      requestAnimationFrame(tick);
    },
  };
}
