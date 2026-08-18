import pkg from 'canvas';
const { createCanvas } = pkg;
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT = join(process.cwd(), 'docs', 'images');
mkdirSync(OUT, { recursive: true });

const SIZE = 1200; // 1200 x 1200 px square LinkedIn Carousel format

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

const C = {
  bg: '#0a0e1a',
  bgAlt: '#0f1629',
  surface: '#151d33',
  border: '#1e2a4a',
  accent: '#6366f1',
  accentGlow: '#818cf8',
  cyan: '#22d3ee',
  pink: '#f472b6',
  green: '#34d399',
  orange: '#fb923c',
  yellow: '#fbbf24',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  white: '#ffffff',
  purple: '#a78bfa',
};

function roundRect(ctx, x, y, w, h, r, fill, stroke, lw) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); }
}

function glow(ctx, x, y, r, color) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, rgba(color, 0.25));
  grad.addColorStop(0.5, rgba(color, 0.08));
  grad.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function bgGrid(ctx, w, h) {
  ctx.strokeStyle = rgba('#ffffff', 0.03);
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
}

function bgGradient(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, C.bg);
  grad.addColorStop(0.5, '#0d1225');
  grad.addColorStop(1, C.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function node(ctx, x, y, r, color, label, withGlow) {
  if (withGlow) glow(ctx, x, y, r * 2.5, color);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  grad.addColorStop(0, color);
  grad.addColorStop(1, rgba(color, 0.7));
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = C.white;
  ctx.font = `bold ${Math.max(12, r * 0.45)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label.substring(0, 2).toUpperCase(), x, y);

  ctx.font = `${Math.max(11, r * 0.35)}px sans-serif`;
  ctx.fillStyle = C.text;
  ctx.fillText(label, x, y + r + 16);
}

function edge(ctx, x1, y1, x2, y2, color, label, dashed) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  if (dashed) ctx.setLineDash([6, 4]);
  ctx.strokeStyle = rgba(color, 0.45);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    roundRect(ctx, mx - 45, my - 12, 90, 22, 4, rgba(C.surface, 0.9), rgba(color, 0.4));
    ctx.fillStyle = color;
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, mx, my);
  }
}

// ═══════════════ SLIDE 1: HERO / WHAT I BUILT ═══════════════
function slide1Hero() {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');
  bgGradient(ctx, SIZE, SIZE);
  bgGrid(ctx, SIZE, SIZE);

  // Background Ambient Glows
  glow(ctx, 300, 250, 300, C.accent);
  glow(ctx, SIZE - 300, SIZE / 2, 280, C.cyan);
  glow(ctx, SIZE / 2, SIZE - 300, 300, C.purple);

  // Header Branding
  ctx.fillStyle = C.accentGlow;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧠 MEMORY GRAPH — PRODUCT SHOWCASE', SIZE / 2, 110);

  ctx.fillStyle = C.white;
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('AI Knowledge Infrastructure', SIZE / 2, 160);

  ctx.fillStyle = C.textMuted;
  ctx.font = '20px sans-serif';
  ctx.fillText("Don’t store information. Build relationships between it.", SIZE / 2, 195);

  // Central UI Graph Frame
  const frameX = 100, frameY = 240, frameW = 1000, frameH = 680;
  glow(ctx, SIZE / 2, frameY + frameH / 2, 400, C.accent);
  roundRect(ctx, frameX, frameY, frameW, frameH, 16, rgba(C.surface, 0.85), rgba(C.accent, 0.3), 2);

  // UI Header Bar inside Frame
  roundRect(ctx, frameX, frameY, frameW, 50, 16, rgba(C.bgAlt, 0.9), C.border);
  ctx.fillStyle = C.textMuted;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🕸️ Interactive Force Graph Canvas Explorer (200+ FPS)', frameX + 25, frameY + 30);

  [C.pink, C.yellow, C.green].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(frameX + frameW - 70 + i * 20, frameY + 25, 6, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });

  // Canvas Nodes & Edges
  const nodes = [
    { x: frameX + 220, y: frameY + 200, r: 35, c: C.cyan, l: 'SAR Flood Spec (PDF)' },
    { x: frameX + 560, y: frameY + 180, r: 38, c: C.accent, l: 'Flood-Prediction-ML (Code)' },
    { x: frameX + 800, y: frameY + 300, r: 32, c: C.pink, l: 'Team Chat Decision' },
    { x: frameX + 320, y: frameY + 450, r: 30, c: C.green, l: 'Copernicus API (Data)' },
    { x: frameX + 680, y: frameY + 480, r: 36, c: C.orange, l: 'Crop Hydrology (Paper)' },
    { x: frameX + 180, y: frameY + 560, r: 26, c: C.yellow, l: 'Sentinel-1 Script' },
  ];

  edge(ctx, nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y, C.pink, 'IMPLEMENTS');
  edge(ctx, nodes[1].x, nodes[1].y, nodes[4].x, nodes[4].y, C.orange, 'EXTENDS');
  edge(ctx, nodes[0].x, nodes[0].y, nodes[3].x, nodes[3].y, C.cyan, 'DEPENDS_ON');
  edge(ctx, nodes[1].x, nodes[1].y, nodes[2].x, nodes[2].y, C.purple, 'MENTIONS');
  edge(ctx, nodes[3].x, nodes[3].y, nodes[5].x, nodes[5].y, C.green, 'REFERENCES');

  nodes.forEach(n => node(ctx, n.x, n.y, n.r, n.c, n.l, true));

  // Pathfinder Banner inside Canvas
  roundRect(ctx, frameX + 40, frameY + frameH - 60, frameW - 80, 42, 8, rgba(C.bg, 0.9), rgba(C.cyan, 0.4));
  ctx.fillStyle = C.cyan;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ Shortest BFS Path Discovered: SAR Flood Spec.pdf  ➔  Flood-Prediction-ML  ➔  Crop Hydrology Paper', frameX + frameW / 2, frameY + frameH - 39);

  // Bottom Feature Pills
  const pills = ['⚡ AI Relationship Discovery', '🔍 Subgraph RAG', '⏱️ Time Scrubbing', '🕸️ Canvas Physics'];
  const pillW = 215, pillGap = 16;
  const pillTotal = pills.length * pillW + (pills.length - 1) * pillGap;
  const pillStartX = (SIZE - pillTotal) / 2;
  const pillY = 955;

  pills.forEach((p, i) => {
    const px = pillStartX + i * (pillW + pillGap);
    roundRect(ctx, px, pillY, pillW, 40, 8, rgba(C.surface, 0.8), rgba(C.accent, 0.3));
    ctx.fillStyle = C.accentGlow;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p, px + pillW / 2, pillY + 24);
  });

  // Technology Strip
  const techs = ['React 18', 'TypeScript 5.7', 'Vite 6', 'TailwindCSS', 'HTML5 Canvas API', 'TF-IDF Vectorizer'];
  ctx.fillStyle = C.textMuted;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(techs.join('   •   '), SIZE / 2, 1030);

  writeFileSync(join(OUT, 'linkedin-slide1-hero.png'), cv.toBuffer('image/png'));
  console.log('✔ linkedin-slide1-hero.png generated (1200x1200px)');
}

// ═══════════════ SLIDE 2: ARCHITECTURE / HOW IT WORKS ═══════════════
function slide2Architecture() {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');
  bgGradient(ctx, SIZE, SIZE);
  bgGrid(ctx, SIZE, SIZE);

  // Header Branding
  ctx.fillStyle = C.cyan;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SYSTEM ARCHITECTURE & PIPELINE', SIZE / 2, 110);

  ctx.fillStyle = C.white;
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText('How Memory Graph Works Under the Hood', SIZE / 2, 160);

  ctx.fillStyle = C.textMuted;
  ctx.font = '18px sans-serif';
  ctx.fillText('Zero-Backend, 100% Client-Side Knowledge Processing Engine', SIZE / 2, 195);

  // Pipeline Flow Boxes
  const stages = [
    { title: '1. INGESTION', sub: 'PDFs • Repos • Chat • Emails', icon: '📥', color: C.cyan },
    { title: '2. ENTITY PARSER', sub: '11 Types & Normalization', icon: '⚙️', color: C.accent },
    { title: '3. TF-IDF VECTOR MATRIX', sub: 'Cosine Distance Engine', icon: '🧮', color: C.purple },
    { title: '4. AUTO DISCOVERY', sub: 'Implicit Edge Generator', icon: '⚡', color: C.pink },
    { title: '5. PRESENTATION', sub: 'Graph • RAG • Timeline', icon: '🖥️', color: C.green },
  ];

  const boxW = 800, boxH = 95, startY = 240, gapY = 32;

  stages.forEach((s, i) => {
    const y = startY + i * (boxH + gapY);
    const x = (SIZE - boxW) / 2;

    glow(ctx, x + boxW / 2, y + boxH / 2, 100, s.color);
    roundRect(ctx, x, y, boxW, boxH, 12, rgba(C.surface, 0.85), rgba(s.color, 0.3), 2);

    ctx.fillStyle = C.white;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.icon, x + 65, y + boxH / 2);

    ctx.fillStyle = s.color;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(s.title, x + 120, y + 36);

    ctx.fillStyle = C.textMuted;
    ctx.font = '14px sans-serif';
    ctx.fillText(s.sub, x + 120, y + 64);

    // Connector Arrow to Next
    if (i < stages.length - 1) {
      const arrowY = y + boxH + gapY / 2;
      ctx.beginPath();
      ctx.moveTo(SIZE / 2, y + boxH);
      ctx.lineTo(SIZE / 2, y + boxH + gapY);
      ctx.strokeStyle = rgba(C.accent, 0.4);
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(SIZE / 2 - 6, y + boxH + gapY - 6);
      ctx.lineTo(SIZE / 2, y + boxH + gapY);
      ctx.lineTo(SIZE / 2 + 6, y + boxH + gapY - 6);
      ctx.fillStyle = C.accent;
      ctx.fill();
    }
  });

  // Verified Technical Capabilities Grid
  const capY = 900;
  roundRect(ctx, 100, capY, 1000, 160, 12, rgba(C.bgAlt, 0.9), C.border);

  ctx.fillStyle = C.white;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED TECHNICAL CAPABILITIES', SIZE / 2, capY + 35);

  const caps = [
    '✔ Zero-Dependency In-Memory Vector Search',
    '✔ BFS Shortest Pathfinder Algorithm',
    '✔ Subgraph RAG Conversational Traversal',
    '✔ Multi-Format Exporter (Neo4j & Obsidian)'
  ];

  ctx.font = '15px sans-serif';
  ctx.fillStyle = C.textMuted;
  caps.forEach((c, i) => {
    const cx = (i % 2 === 0) ? 200 : 640;
    const cy = capY + 80 + Math.floor(i / 2) * 35;
    ctx.textAlign = 'left';
    ctx.fillText(c, cx, cy);
  });

  writeFileSync(join(OUT, 'linkedin-slide2-architecture.png'), cv.toBuffer('image/png'));
  console.log('✔ linkedin-slide2-architecture.png generated (1200x1200px)');
}

// ═══════════════ SLIDE 3: REAL PRODUCT / FEATURES / IMPACT ═══════════════
function slide3Product() {
  const cv = createCanvas(SIZE, SIZE);
  const ctx = cv.getContext('2d');
  bgGradient(ctx, SIZE, SIZE);
  bgGrid(ctx, SIZE, SIZE);

  // Header Branding
  ctx.fillStyle = C.pink;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REAL APPLICATION CAPABILITIES', SIZE / 2, 110);

  ctx.fillStyle = C.white;
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText('Memory Graph in Action', SIZE / 2, 160);

  ctx.fillStyle = C.textMuted;
  ctx.font = '18px sans-serif';
  ctx.fillText('Engineered & Tested Feature Modules', SIZE / 2, 195);

  // Quad Card Grid (2x2)
  const cards = [
    { title: '🔍 RAG AI Assistant', desc: 'Answers queries by traversing connected subgraphs with evidence citations.', color: C.accent },
    { title: '⏱️ Evolution Timeline', desc: 'Time scrubber tracking node and edge emergence from Sep 2025 to Feb 2026.', color: C.cyan },
    { title: '⚡ Auto Discovery Hub', desc: 'Live feed of AI-discovered relationships & contradiction detection.', color: C.pink },
    { title: '📊 Graph Analytics', desc: 'Density metrics, degree breakdown, and entity category distribution charts.', color: C.green },
  ];

  const cardW = 475, cardH = 240, startX = 100, startY = 240, gapX = 50, gapY = 40;

  cards.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    glow(ctx, x + cardW / 2, y + cardH / 2, 100, c.color);
    roundRect(ctx, x, y, cardW, cardH, 14, rgba(C.surface, 0.85), rgba(c.color, 0.3), 2);

    roundRect(ctx, x, y, cardW, 6, 3, c.color);

    ctx.fillStyle = C.white;
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(c.title, x + 30, y + 50);

    ctx.fillStyle = C.textMuted;
    ctx.font = '15px sans-serif';

    // Multi-line description wrapping
    const words = c.desc.split(' ');
    let line = '', ly = y + 90;
    words.forEach(w => {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > cardW - 60) {
        ctx.fillText(line.trim(), x + 30, ly);
        line = w + ' ';
        ly += 22;
      } else line = test;
    });
    ctx.fillText(line.trim(), x + 30, ly);

    roundRect(ctx, x + 30, y + cardH - 50, 140, 30, 6, rgba(c.color, 0.15), rgba(c.color, 0.4));
    ctx.fillStyle = c.color;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIEW MODULE', x + 100, y + cardH - 30);
  });

  // Impact Section
  const impY = 820;
  roundRect(ctx, 100, impY, 1000, 130, 12, rgba(C.bgAlt, 0.9), rgba(C.accent, 0.3));

  ctx.fillStyle = C.white;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REAL-WORLD IMPACT STATEMENT', SIZE / 2, impY + 40);

  ctx.fillStyle = C.textMuted;
  ctx.font = '16px sans-serif';
  ctx.fillText('Designed to eliminate personal knowledge fragmentation by converting isolated files into an', SIZE / 2, impY + 72);
  ctx.fillText('interconnected, client-side AI memory network — with zero server cost and total privacy.', SIZE / 2, impY + 98);

  // Link & Credential Footer
  ctx.fillStyle = C.cyan;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GitHub Repository: https://github.com/vijaymahes9080/Memory-Graph.git', SIZE / 2, 1000);

  ctx.fillStyle = C.textMuted;
  ctx.font = '14px sans-serif';
  ctx.fillText('Author: Vijay Mahes  •  Vijaypradhap2004@gmail.com', SIZE / 2, 1030);

  writeFileSync(join(OUT, 'linkedin-slide3-product.png'), cv.toBuffer('image/png'));
  console.log('✔ linkedin-slide3-product.png generated (1200x1200px)');
}

// ═══════════════ RUN ALL ═══════════════
console.log('Generating 1200x1200px LinkedIn Carousel Slides...\n');
slide1Hero();
slide2Architecture();
slide3Product();
console.log('\nDone! All 3 slides generated in docs/images/');
