// Scene 2: Pasar Malam — a night market with two stalls, a balloon seller,
// a kite, and a food cart. Panel B hides or recolors eight elements;
// coordinates match levels.js (`pasar` diffs).

import { circle, drawCat, ellipse, line, poly, rect, star, stringLights, text } from './scenes-common.js';

function stripedCanopy(ctx, x, y, w, h, colorA, colorB) {
  rect(ctx, x, y, w, h, colorA);
  const stripes = Math.floor(w / 26);
  for (let i = 0; i < stripes; i += 2) rect(ctx, x + i * 26, y, 13, h, colorB);
  rect(ctx, x, y + h - 4, w, 4, 'rgba(0,0,0,0.25)');
}

export function drawPasar(ctx, variant) {
  const B = variant === 'B';
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#0d1b3e');
  sky.addColorStop(0.6, '#274b8f');
  sky.addColorStop(1, '#e2703a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 280);

  // Full moon (diff: missing in B).
  if (!B) {
    circle(ctx, 88, 58, 22, '#fff3c4');
    circle(ctx, 88, 58, 30, 'rgba(255, 243, 196, 0.25)');
    circle(ctx, 80, 52, 4, '#e8d9a0');
    circle(ctx, 96, 64, 5, '#e8d9a0');
  }
  star(ctx, 180, 40, 5, '#fff7e8');
  star(ctx, 260, 70, 4, '#fff7e8');
  star(ctx, 440, 36, 5, '#fff7e8');
  star(ctx, 520, 90, 4, '#fff7e8');
  star(ctx, 40, 130, 4, '#fff7e8');

  // Kite with a tail (diff: missing in B).
  if (!B) {
    poly(ctx, [[352, 58], [372, 78], [352, 98], [332, 78]], '#ff5d5d');
    line(ctx, 352, 78, 372, 58, '#fff7e8', 2);
    line(ctx, 352, 78, 332, 58, '#fff7e8', 2);
    line(ctx, 352, 98, 344, 130, '#fff7e8', 2);
    poly(ctx, [[344, 112], [350, 118], [344, 124]], '#ffd166');
    poly(ctx, [[342, 128], [348, 134], [342, 140]], '#7bd389');
  }

  // Hanging bulb on the right (diff: missing in B).
  if (!B) {
    line(ctx, 472, 0, 472, 110, '#3a2a1a', 2);
    circle(ctx, 472, 118, 8, '#ffd166');
    circle(ctx, 472, 118, 15, 'rgba(255, 209, 102, 0.3)');
  }

  stringLights(ctx, 20, 96, 300, 88);

  // Street.
  rect(ctx, 0, 280, 560, 120, '#4a3b52');
  rect(ctx, 0, 280, 560, 8, '#372a3d');
  line(ctx, 0, 330, 560, 330, '#ffd166', 2);

  // Stall A (left): sate.
  stripedCanopy(ctx, 56, 148, 208, 34, '#fff3d6', '#d94f3d');
  line(ctx, 64, 182, 64, 330, '#5b2d1a', 6);
  line(ctx, 256, 182, 256, 330, '#5b2d1a', 6);
  rect(ctx, 56, 258, 208, 72, '#7a4a21');
  rect(ctx, 56, 258, 208, 10, '#a9713f');
  text(ctx, 'SATE AYAM 10K', 160, 282, 14, '#fff7e8');
  rect(ctx, 76, 226, 30, 32, '#c9e7ff');
  rect(ctx, 112, 226, 30, 32, '#ffd166');
  rect(ctx, 210, 226, 34, 32, '#8a5a33');
  // Star ornament hanging under the awning (diff: missing in B).
  if (!B) star(ctx, 148, 182, 13, '#ffd166');

  // Stall B (right): es & gorengan.
  stripedCanopy(ctx, 316, 148, 208, 34, '#fff3d6', '#1f7a6d');
  line(ctx, 324, 182, 324, 330, '#5b2d1a', 6);
  line(ctx, 516, 182, 516, 330, '#5b2d1a', 6);
  rect(ctx, 316, 258, 208, 72, '#5b3a52');
  rect(ctx, 316, 258, 208, 10, '#8a6aa0');
  text(ctx, 'ES TEH · GORENGAN', 420, 272, 14, '#fff7e8');
  circle(ctx, 350, 240, 12, '#ffb3c1');
  circle(ctx, 382, 240, 12, '#ffd166');
  circle(ctx, 414, 240, 12, '#7bd389');
  // Cat perched on the stall front (diff: missing in B).
  if (!B) drawCat(ctx, 402, 188, '#3a3a3a');

  // Vendor in front of stall A (diff: his cap is red in A, green in B).
  rect(ctx, 216, 292, 28, 52, '#2f6fb2');
  circle(ctx, 230, 274, 14, '#f2c89b');
  poly(ctx, [[214, 262], [246, 262], [230, 244]], B ? '#2f9e5f' : '#d94f3d');
  rect(ctx, 210, 260, 40, 5, B ? '#2f9e5f' : '#d94f3d');
  circle(ctx, 225, 274, 2, '#2b1d12');
  circle(ctx, 235, 274, 2, '#2b1d12');
  line(ctx, 224, 282, 236, 282, '#2b1d12', 2);

  // Balloons (diff: the middle balloon is red in A, blue in B).
  line(ctx, 282, 160, 262, 118, '#fff7e8', 1.5);
  line(ctx, 282, 160, 282, 126, '#fff7e8', 1.5);
  line(ctx, 282, 160, 302, 118, '#fff7e8', 1.5);
  ellipse(ctx, 262, 100, 14, 18, '#6ec6ff');
  ellipse(ctx, 282, 108, 14, 18, B ? '#6ec6ff' : '#ff5d5d');
  ellipse(ctx, 302, 100, 14, 18, '#ffd166');
  poly(ctx, [[262, 118], [258, 126], [266, 126]], '#6ec6ff');
  poly(ctx, [[282, 126], [278, 134], [286, 134]], B ? '#6ec6ff' : '#ff5d5d');
  poly(ctx, [[302, 118], [298, 126], [306, 126]], '#ffd166');

  // Food cart (diff: its left wheel is missing in B).
  rect(ctx, 380, 310, 120, 42, '#8e44ad');
  rect(ctx, 380, 310, 120, 10, '#b678d6');
  text(ctx, 'CILOK 5K', 440, 332, 14, '#fff7e8');
  line(ctx, 396, 310, 396, 296, '#3a2a1a', 3);
  line(ctx, 484, 310, 484, 296, '#3a2a1a', 3);
  rect(ctx, 388, 284, 104, 12, '#d94f3d');
  if (!B) {
    circle(ctx, 424, 362, 14, '#2b1d12');
    circle(ctx, 424, 362, 7, '#fff7e8');
  }
  circle(ctx, 482, 362, 14, '#2b1d12');
  circle(ctx, 482, 362, 7, '#fff7e8');
}
