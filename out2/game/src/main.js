// Bootstrap for Warung Senja — Cari Bedanya: wires the DOM to the game
// state machine and stages fixed scenes for screenshots.
// ?shot=start  menu over level 1, nothing found yet
// ?shot=play   level 1 mid-game: 3 differences found, 4 still hidden
// ?shot=pasar  level 2 mid-game: 4 found, a hint ring pulsing on one more
// ?shot=end    the win screen after all three levels
// After staging, window.__shotReady is set so a screenshot can be taken.

import { createGame, SCREEN_MENU } from './game.js';
import { LEVELS } from './levels.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const elements = {
  canvasA: document.getElementById('canvasA'),
  canvasB: document.getElementById('canvasB'),
  scoreEl: document.getElementById('score'),
  remainEl: document.getElementById('remain'),
  timerBar: document.getElementById('timerBar'),
  timerText: document.getElementById('timerText'),
  hintLeftEl: document.getElementById('hintLeft'),
  messageEl: document.getElementById('message'),
  statusEl: document.getElementById('status'),
  overlayMenu: document.getElementById('overlayMenu'),
  overlayEnd: document.getElementById('overlayEnd'),
  endEmoji: document.getElementById('endEmoji'),
  endTitle: document.getElementById('endTitle'),
  endText: document.getElementById('endText'),
  endScore: document.getElementById('endScore'),
  endPrimary: document.getElementById('endPrimary'),
  endSecondary: document.getElementById('endSecondary'),
  hintBtn: document.getElementById('hintBtn'),
  soundBtn: document.getElementById('soundBtn'),
};

const game = createGame(elements);
window.__game = game;

document.getElementById('playBtn').addEventListener('click', () => game.startLevel(0));
document.getElementById('restartBtn').addEventListener('click', () => game.startLevel(game.state.levelIndex));
document.querySelectorAll('#overlayMenu .levelsRow button').forEach((btn) => {
  btn.addEventListener('click', () => game.startLevel(Number(btn.dataset.level)));
});
document.querySelectorAll('#levelBtns button').forEach((btn) => {
  btn.addEventListener('click', () => game.startLevel(Number(btn.dataset.level)));
});
elements.endSecondary.addEventListener('click', () => game.showMenu());

function stageShot() {
  const state = game.state;
  if (shot === 'play') {
    game.startLevel(0);
    state.found = new Set(['sun', 'lantern', 'cat']);
    state.score = 340;
    state.combo = 3;
    state.timeLeft = 132;
    game.syncHud();
  } else if (shot === 'pasar') {
    game.startLevel(1);
    state.found = new Set(['moon', 'kite', 'hat', 'wheel']);
    state.score = 560;
    state.combo = 2;
    state.timeLeft = 87;
    state.hintsLeft = 2;
    const target = LEVELS[1].diffs.find((d) => d.id === 'balloon');
    state.hintPulse = { diff: target, until: performance.now() + 60000 };
    game.syncHud();
  } else if (shot === 'end') {
    game.startLevel(2);
    state.found = new Set(LEVELS[2].diffs.map((d) => d.id));
    state.score = 2450;
    state.timeLeft = 41;
    game.finishLevel();
    game.syncHud();
  } else {
    // Default (and ?shot=start): the menu over a fresh level 1.
    game.state.screen = SCREEN_MENU;
    game.syncHud();
  }
}

game.run();
stageShot();
// Let two frames paint before signalling readiness.
requestAnimationFrame(() => requestAnimationFrame(() => {
  window.__shotReady = true;
}));
