// Scene 3: Pantai Tropis — a tropical beach with palms, a sailboat, an
// umbrella and a sandcastle. Panel B hides or recolors ten elements;
// coordinates match levels.js (`pantai` diffs).

import { circle, drawPalm, ellipse, line, poly, rect, star, text } from './scenes-common.js';

function drawCloud(ctx, x, y) {
  circle(ctx, x - 22, y + 4, 14, '#ffffff');
  circle(ctx, x, y - 6, 18, '#ffffff');
  circle(ctx, x + 22, y + 4, 14, '#ffffff');
  ellipse(ctx, x, y + 8, 34, 10, '#ffffff');
}

function drawCrab(ctx, x, y) {
  ellipse(ctx, x, y, 14, 10, '#e63946');
  circle(ctx, x - 12, y - 8, 6, '#e63946');
  circle(ctx, x + 12, y - 8, 6, '#e63946');
  circle(ctx, x - 5, y - 10, 2, '#2b1d12');
  circle(ctx, x + 5, y - 10, 2, '#2b1d12');
  line(ctx, x - 14, y + 4, x - 24, y + 10, '#e63946', 3);
  line(ctx, x + 14, y + 4, x + 24, y + 10, '#e63946', 3);
  line(ctx, x - 12, y + 8, x - 20, y + 16, '#e63946', 3);
  line(ctx, x + 12, y + 8, x + 20, y + 16, '#e63946', 3);
}

export function drawPantai(ctx, variant) {
  const B = variant === 'B';
  const sky = ctx.createLinearGradient(0, 0, 0, 210);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(1, '#dff3ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 210);

  // Sun (diff: orange in A, pale yellow in B).
  circle(ctx, 472, 66, 26, B ? '#ffd166' : '#ff9f1c');
  circle(ctx, 472, 66, 34, 'rgba(255, 209, 102, 0.3)');
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    line(ctx, 472 + Math.cos(a) * 32, 66 + Math.sin(a) * 32, 472 + Math.cos(a) * 42, 66 + Math.sin(a) * 42, B ? '#ffd166' : '#ff9f1c', 3);
  }

  // Small cloud (diff: missing in B).
  if (!B) drawCloud(ctx, 118, 58);
  drawCloud(ctx, 300, 44);
  drawCloud(ctx, 210, 96);

  // Sea.
  const sea = ctx.createLinearGradient(0, 200, 0, 285);
  sea.addColorStop(0, '#2f9e8f');
  sea.addColorStop(1, '#1f7a6d');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 200, 560, 85);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (const [x, y, w] of [[60, 228, 70], [180, 252, 90], [300, 240, 60], [440, 262, 80], [40, 268, 60]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 6, x + w, y);
    ctx.stroke();
  }

  // Sailboat (diff: the stripe on its sail is red in A, blue in B).
  poly(ctx, [[348, 232], [424, 232], [408, 248], [364, 248]], '#8a5a33');
  line(ctx, 384, 232, 384, 168, '#5b2d1a', 4);
  poly(ctx, [[384, 172], [384, 228], [416, 228]], '#fff7e8');
  poly(ctx, [[384, 200], [410, 200], [408, 214], [384, 214]], B ? '#2f6fb2' : '#d94f3d');
  poly(ctx, [[382, 178], [382, 228], [356, 228]], '#ffe8a3');

  // Sand.
  ctx.fillStyle = '#f2d8a0';
  ctx.fillRect(0, 285, 560, 115);
  ellipse(ctx, 120, 330, 60, 8, '#e8c88a');
  ellipse(ctx, 420, 350, 70, 9, '#e8c88a');

  // Left palm with coconuts (diff: coconuts missing in B).
  drawPalm(ctx, 130, 315, -0.08, !B);

  // Right palm; a surfboard leans on it (diff: missing in B).
  drawPalm(ctx, 532, 322, 0.12, true);
  if (!B) {
    ctx.save();
    ctx.translate(516, 302);
    ctx.rotate(0.35);
    ellipse(ctx, 0, 0, 10, 42, '#ff5d8f');
    ellipse(ctx, 0, 0, 10, 42, 'rgba(255,255,255,0)');
    line(ctx, 0, -30, 0, 30, '#fff7e8', 4);
    ctx.restore();
  }

  // Beach umbrella (diff: one canopy stripe is red in A, teal in B).
  line(ctx, 252, 330, 252, 232, '#8a5a33', 4);
  ctx.beginPath();
  ctx.moveTo(204, 238);
  ctx.quadraticCurveTo(252, 186, 300, 238);
  ctx.closePath();
  ctx.fillStyle = '#1f7a6d';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(228, 236);
  ctx.quadraticCurveTo(236, 206, 252, 198);
  ctx.lineTo(252, 238);
  ctx.closePath();
  ctx.fillStyle = B ? '#1f7a6d' : '#d94f3d';
  ctx.fill();
  circle(ctx, 252, 196, 5, '#ffd166');

  // Sandcastle with a flag (diff: the flag is missing in B).
  rect(ctx, 306, 300, 52, 34, '#e8c88a');
  rect(ctx, 300, 288, 16, 46, '#e8c88a');
  rect(ctx, 348, 288, 16, 46, '#e8c88a');
  poly(ctx, [[300, 288], [308, 276], [316, 288]], '#d9b878');
  poly(ctx, [[348, 288], [356, 276], [364, 288]], '#d9b878');
  rect(ctx, 322, 312, 20, 22, '#c9a86a');
  if (!B) {
    line(ctx, 332, 300, 332, 268, '#5b2d1a', 3);
    poly(ctx, [[332, 268], [352, 274], [332, 280]], '#d94f3d');
  }

  // Beach ball (diff: missing in B).
  if (!B) {
    circle(ctx, 202, 332, 16, '#fff7e8');
    ctx.beginPath();
    ctx.arc(202, 332, 16, -Math.PI / 2, Math.PI / 6);
    ctx.lineTo(202, 332);
    ctx.closePath();
    ctx.fillStyle = '#ff5d5d';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(202, 332, 16, Math.PI / 2, Math.PI * 1.1);
    ctx.lineTo(202, 332);
    ctx.closePath();
    ctx.fillStyle = '#6ec6ff';
    ctx.fill();
    circle(ctx, 202, 332, 4, '#ffd166');
  }

  // Crab (diff: missing in B).
  if (!B) drawCrab(ctx, 118, 352);

  // Starfish (diff: missing in B).
  if (!B) star(ctx, 452, 362, 13, '#ff9f1c');

  text(ctx, 'PANTAI SENJA', 40, 396, 10, '#b98d4f');
}
