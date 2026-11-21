// Shared canvas helpers for the three hand-drawn scenes. Every scene is
// painted with plain canvas paths — no images, no fonts from the network —
// so both panels always share one visual style.

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * rad;
    const py = y + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function text(ctx, str, x, y, size, color, weight = '700') {
  ctx.font = `${weight} ${size}px "Trebuchet MS", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// A string of warm bulbs sagging between two points.
export function stringLights(ctx, x1, y1, x2, y2, missingIndex = -1) {
  const bulbs = 9;
  line(ctx, x1, y1, x2, y2, '#3a2a1a', 2);
  for (let i = 0; i < bulbs; i++) {
    const t = i / (bulbs - 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 16;
    if (i === missingIndex) continue;
    const colors = ['#ffd166', '#ff8fa3', '#7bd389', '#6ec6ff'];
    circle(ctx, x, y + 6, 5, colors[i % colors.length]);
    circle(ctx, x, y + 6, 9, 'rgba(255, 209, 102, 0.25)');
  }
}

// A small sitting cat, drawn facing right.
export function drawCat(ctx, x, y, color) {
  ellipse(ctx, x, y, 20, 14, color); // body
  circle(ctx, x + 16, y - 12, 11, color); // head
  poly(ctx, [[x + 8, y - 20], [x + 11, y - 30], [x + 15, y - 20]], color); // ear L
  poly(ctx, [[x + 18, y - 21], [x + 23, y - 30], [x + 26, y - 20]], color); // ear R
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 4);
  ctx.quadraticCurveTo(x - 34, y - 6, x - 28, y - 22);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
  circle(ctx, x + 20, y - 13, 2, '#2b1d12'); // eye
  line(ctx, x + 26, y - 8, x + 30, y - 8, '#2b1d12', 1.5); // whisker
}

// A palm tree leaning slightly, with coconuts when `coconuts` is true.
export function drawPalm(ctx, x, y, lean, coconuts) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.quadraticCurveTo(-2, -60, 4, -110);
  ctx.lineTo(12, -108);
  ctx.quadraticCurveTo(8, -55, 9, 0);
  ctx.closePath();
  ctx.fillStyle = '#8a5a33';
  ctx.fill();
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI * (0.15 + i * 0.14);
    ctx.beginPath();
    ctx.moveTo(8, -108);
    ctx.quadraticCurveTo(8 + Math.cos(a) * 55, -108 + Math.sin(a) * 55 - 18, 8 + Math.cos(a) * 88, -108 + Math.sin(a) * 88 + 26);
    ctx.quadraticCurveTo(8 + Math.cos(a) * 45, -108 + Math.sin(a) * 45 + 6, 8, -108);
    ctx.closePath();
    ctx.fillStyle = '#2f9e5f';
    ctx.fill();
  }
  if (coconuts) {
    circle(ctx, 0, -100, 7, '#6b4a2b');
    circle(ctx, 13, -96, 7, '#6b4a2b');
    circle(ctx, 6, -88, 7, '#7d5a35');
  }
  ctx.restore();
}
