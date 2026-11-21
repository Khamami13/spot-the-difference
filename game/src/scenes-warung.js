// Scene 1: Warung Kopi Senja — a dusk coffee stall with string lights, a
// striped awning, a cat, and a bicycle. Panel B hides or recolors seven
// elements; the coordinates match levels.js (`warung` diffs).

import { circle, drawCat, ellipse, line, poly, rect, star, stringLights, text } from './scenes-common.js';

export function drawWarung(ctx, variant) {
  const B = variant === 'B';
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#7a4a8c');
  sky.addColorStop(0.55, '#e2703a');
  sky.addColorStop(1, '#f7b733');
  rect(ctx, 0, 0, 560, 260, '#000');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 260);

  // Dusk sun (diff: hidden in B).
  if (!B) {
    circle(ctx, 472, 66, 26, '#ffdf6b');
    circle(ctx, 472, 66, 34, 'rgba(255, 223, 107, 0.3)');
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 472 + Math.cos(a) * 32, 66 + Math.sin(a) * 32, 472 + Math.cos(a) * 42, 66 + Math.sin(a) * 42, '#ffdf6b', 3);
    }
  }
  star(ctx, 60, 48, 7, '#fff7e8');
  star(ctx, 150, 30, 5, '#fff7e8');
  star(ctx, 330, 42, 6, '#fff7e8');
  star(ctx, 250, 70, 4, '#fff7e8');

  // Distant rooftops.
  poly(ctx, [[0, 260], [0, 232], [60, 232], [80, 214], [140, 232], [200, 232], [200, 260]], '#5b3a52');
  poly(ctx, [[360, 260], [360, 236], [420, 236], [440, 218], [500, 236], [560, 236], [560, 260]], '#5b3a52');

  // Ground.
  rect(ctx, 0, 260, 560, 140, '#a9713f');
  rect(ctx, 0, 260, 560, 10, '#8a5a33');
  line(ctx, 0, 372, 560, 372, '#8a5a33', 3);

  stringLights(ctx, 16, 14, 544, 10);

  // Signboard.
  rect(ctx, 118, 102, 164, 34, '#5b2d1a');
  rect(ctx, 118, 102, 164, 34, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 3;
  ctx.strokeRect(118, 102, 164, 34);
  text(ctx, 'KOPI SENJA', 200, 120, 20, '#ffd166');

  // Awning: cream canvas with red stripes (diff: one stripe turns teal in B).
  rect(ctx, 60, 150, 280, 36, '#fff3d6');
  for (let i = 0; i < 10; i++) {
    const x = 60 + i * 28;
    const isDiffStripe = i === 3;
    rect(ctx, x, 150, 14, 36, isDiffStripe && B ? '#1f7a6d' : '#d94f3d');
  }
  rect(ctx, 60, 182, 280, 5, '#c98a4b');
  line(ctx, 70, 186, 70, 262, '#5b2d1a', 6);
  line(ctx, 330, 186, 330, 262, '#5b2d1a', 6);

  // Hanging lanterns (diff: the middle one is missing in B).
  const lanterns = [180, 240, 300];
  lanterns.forEach((x, i) => {
    if (B && i === 2) return;
    line(ctx, x, 186, x, 196, '#3a2a1a', 2);
    ellipse(ctx, x, 208, 11, 13, '#ff5d5d');
    ellipse(ctx, x, 208, 6, 13, '#ffb347');
    circle(ctx, x, 208, 3, '#fff7e8');
  });

  // Stall counter with jars and a menu board.
  rect(ctx, 70, 262, 270, 68, '#7a4a21');
  rect(ctx, 70, 262, 270, 10, '#a9713f');
  rect(ctx, 96, 236, 22, 26, '#c9e7ff');
  rect(ctx, 126, 236, 22, 26, '#ffd166');
  rect(ctx, 156, 236, 22, 26, '#ffb3c1');
  text(ctx, 'KOPI 5K · TEH 3K · GORENGAN 2K', 205, 286, 12, '#fff7e8');
  text(ctx, 'BUKA 16.00 — 23.00', 205, 308, 11, '#ffd166');

  // Potted plant (diff: its flower is red in A, yellow in B).
  poly(ctx, [[322, 330], [350, 330], [344, 306], [328, 306]], '#c96f4a');
  ellipse(ctx, 336, 300, 5, 16, '#2f9e5f');
  ellipse(ctx, 326, 302, 12, 5, '#2f9e5f');
  ellipse(ctx, 346, 302, 12, 5, '#2f9e5f');
  circle(ctx, 336, 292, 8, B ? '#ffd166' : '#e63946');
  circle(ctx, 336, 292, 3, '#fff7e8');

  // Table with two cups (diff: the right cup is missing in B).
  rect(ctx, 396, 288, 128, 10, '#6b4423');
  rect(ctx, 406, 298, 8, 46, '#6b4423');
  rect(ctx, 506, 298, 8, 46, '#6b4423');
  rect(ctx, 418, 274, 18, 16, '#fff7e8');
  ellipse(ctx, 427, 290, 13, 4, '#e8dcc8');
  if (!B) {
    rect(ctx, 442, 278, 20, 16, '#d94f3d');
    ellipse(ctx, 452, 296, 14, 4, '#e8dcc8');
    line(ctx, 462, 282, 468, 286, '#d94f3d', 3);
  }

  // Bicycle leaning by the table (diff: its front basket is missing in B).
  circle(ctx, 460, 350, 17, '#2b1d12');
  circle(ctx, 460, 350, 11, '#fff7e8');
  circle(ctx, 536, 350, 17, '#2b1d12');
  circle(ctx, 536, 350, 11, '#fff7e8');
  line(ctx, 460, 350, 502, 312, '#d94f3d', 4);
  line(ctx, 536, 350, 502, 312, '#d94f3d', 4);
  line(ctx, 502, 312, 526, 312, '#d94f3d', 4);
  line(ctx, 526, 312, 536, 350, '#d94f3d', 4);
  line(ctx, 526, 312, 540, 300, '#2b1d12', 4);
  if (!B) {
    rect(ctx, 492, 288, 32, 22, '#c98a4b');
    line(ctx, 492, 288, 524, 288, '#8a5a33', 3);
    line(ctx, 492, 299, 524, 299, '#8a5a33', 2);
  }

  // The stall cat, sitting on the open ground left of the stall
  // (diff: missing in B).
  if (!B) drawCat(ctx, 40, 345, '#e8912d');
}
