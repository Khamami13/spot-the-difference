// Tiny sound effects made with the Web Audio API — no audio files, no
// network. Each effect is a short oscillator phrase; the context is created
// lazily on the first user gesture so browsers never block it.

let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function context() {
  if (!audioCtx) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, length, type, volume) {
  if (muted) return;
  const ctx = context();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + length);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + length + 0.05);
}

// A happy two-note chime when a difference is found.
export function playFound() {
  tone(660, 0, 0.14, 'sine', 0.22);
  tone(880, 0.09, 0.22, 'sine', 0.22);
  tone(1320, 0.18, 0.18, 'triangle', 0.12);
}

// A low buzz for a wrong click.
export function playWrong() {
  tone(160, 0, 0.22, 'sawtooth', 0.14);
  tone(110, 0.1, 0.25, 'sawtooth', 0.12);
}

// A soft ping for a hint.
export function playHint() {
  tone(520, 0, 0.12, 'sine', 0.16);
  tone(780, 0.1, 0.16, 'sine', 0.16);
}

// A little fanfare for clearing a level or the whole game.
export function playWin() {
  [523, 659, 784, 1047].forEach((freq, i) => tone(freq, i * 0.12, 0.3, 'triangle', 0.2));
  tone(1319, 0.5, 0.5, 'triangle', 0.18);
}

// A descending sigh when time runs out.
export function playLose() {
  [392, 330, 262, 196].forEach((freq, i) => tone(freq, i * 0.15, 0.3, 'sine', 0.16));
}
