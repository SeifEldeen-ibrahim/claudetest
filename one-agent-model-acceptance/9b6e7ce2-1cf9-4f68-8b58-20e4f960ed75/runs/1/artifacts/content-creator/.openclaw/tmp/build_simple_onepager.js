const PDFDocument = require('pdfkit');
const fs = require('fs');

const PAGE_W = 595.28;
const PAGE_H = 841.89;

const doc = new PDFDocument({ size: 'A4', margin: 0 });
const outPath = process.argv[2] || 'matrix_onepager.pdf';
doc.pipe(fs.createWriteStream(outPath));

const BG = '#05070C';
const ACCENT = '#1A6EF5';
const WHITE = '#FFFFFF';
const TEXT = '#E8ECF3';
const MUTED = '#B7C4DD';
const MUTED2 = '#A9B7D1';
const GREEN = '#4ADE80';

const M = 48;
const contentW = PAGE_W - M * 2;

// Background
doc.rect(0, 0, PAGE_W, PAGE_H).fill(BG);

// glow accents
doc.save(); doc.opacity(0.12); doc.circle(PAGE_W * 0.88, PAGE_H * 0.10, 240).fill(ACCENT); doc.restore();
doc.save(); doc.opacity(0.08); doc.circle(PAGE_W * 0.06, PAGE_H * 0.92, 220).fill(ACCENT); doc.restore();

// subtle grid
doc.save();
doc.opacity(0.045);
doc.lineWidth(0.5);
for (let x = 0; x <= PAGE_W; x += 42) doc.moveTo(x, 0).lineTo(x, PAGE_H).stroke(ACCENT);
for (let yy = 0; yy <= PAGE_H; yy += 42) doc.moveTo(0, yy).lineTo(PAGE_W, yy).stroke(ACCENT);
doc.restore();

let y = M;

// Header / logo
doc.roundedRect(M, y, 30, 30, 7).fill(ACCENT);
doc.fillColor(BG).font('Helvetica-Bold').fontSize(15).text('M', M, y + 8, { width: 30, align: 'center' });

doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(18).text('Matrix', M + 40, y + 1);
doc.fillColor('#8CA6D6').font('Helvetica-Bold').fontSize(7.5).text('AI AGENT PLATFORM', M + 40, y + 21, { characterSpacing: 1 });

y += 30 + 26;
doc.save();
doc.opacity(0.14);
doc.moveTo(M, y).lineTo(PAGE_W - M, y).lineWidth(1).strokeColor(TEXT).stroke();
doc.restore();

y += 44;

// Eyebrow
doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(10).text('AI AGENT PLATFORM', M, y, { characterSpacing: 2.2 });
y += 26;

// Headline
doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(34);
doc.text('Put AI agents to work', M, y, { width: contentW });
y += doc.currentLineHeight() + 2;
doc.text('across your business.', M, y, { width: contentW });
y += doc.currentLineHeight() + 16;

// Subheadline
doc.fillColor(MUTED).font('Helvetica').fontSize(13.5).text(
  'Matrix gives every team a platform to build, deploy, and manage AI agents that connect to real systems and get real work done — safely, and at scale.',
  M, y, { width: contentW * 0.92, lineGap: 3 }
);
y += 70;

// Section divider
doc.save();
doc.roundedRect(M, y + 4, 16, 6, 1).fill(ACCENT);
doc.restore();
doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(15).text('Why Matrix', M + 24, y);
y += 34;

// Feature bullets (stacked, full width, icon + title + desc)
const features = [
  {
    title: 'Build agents fast',
    desc: 'Compose capable AI agents in minutes using pre-built connectors, tools, and templates — no need to start from scratch.'
  },
  {
    title: 'Connect to real systems',
    desc: 'Agents plug directly into your existing apps and data sources, so they act on real, live information instead of guesses.'
  },
  {
    title: 'Operate with confidence',
    desc: 'Built-in guardrails, permissions, and visibility mean agents run safely and your team stays in control at every step.'
  }
];

const cardH = 76;
const cardGap = 14;

features.forEach((f) => {
  doc.save();
  doc.opacity(0.035);
  doc.roundedRect(M, y, contentW, cardH, 6).fill(WHITE);
  doc.restore();
  doc.save();
  doc.opacity(0.12);
  doc.roundedRect(M, y, contentW, cardH, 6).lineWidth(1).strokeColor(TEXT).stroke();
  doc.restore();

  // left accent bar
  doc.save();
  doc.roundedRect(M, y, 3, cardH, 1.5).fill(ACCENT);
  doc.restore();

  // bullet marker
  doc.save();
  doc.opacity(0.16);
  doc.circle(M + 34, y + cardH / 2, 14).fill(ACCENT);
  doc.restore();
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(13).text('✓', M + 34 - 6, y + cardH / 2 - 8);

  doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(13.5).text(f.title, M + 64, y + 16, { width: contentW - 90 });
  doc.fillColor(MUTED2).font('Helvetica').fontSize(10.5).text(f.desc, M + 64, y + 36, { width: contentW - 90, lineGap: 2 });

  y += cardH + cardGap;
});

y += 20;

// CTA block
const ctaH = 90;
doc.save();
doc.opacity(0.10);
doc.roundedRect(M, y, contentW, ctaH, 8).fill(ACCENT);
doc.restore();
doc.save();
doc.opacity(0.35);
doc.roundedRect(M, y, contentW, ctaH, 8).lineWidth(1).strokeColor(ACCENT).stroke();
doc.restore();

doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(15).text(
  'Ready to see Matrix in action?', M + 28, y + 22, { width: contentW - 200 }
);
doc.fillColor(MUTED).font('Helvetica').fontSize(10.5).text(
  'Explore the platform and find out how AI agents can start working for your team.',
  M + 28, y + 46, { width: contentW - 200 }
);

// CTA button
const btnText = 'Learn more →';
doc.font('Helvetica-Bold').fontSize(11);
const btnW = doc.widthOfString(btnText) + 40;
const btnX = M + contentW - btnW - 24;
const btnY = y + ctaH / 2 - 15;
doc.save();
doc.roundedRect(btnX, btnY, btnW, 30, 15).fill(ACCENT);
doc.restore();
doc.fillColor(BG).font('Helvetica-Bold').fontSize(11).text(btnText, btnX, btnY + 9, { width: btnW, align: 'center' });

y += ctaH + 28;

// Footer
const footerY = PAGE_H - M - 14;
doc.save();
doc.opacity(0.14);
doc.moveTo(M, footerY).lineTo(PAGE_W - M, footerY).lineWidth(1).strokeColor(TEXT).stroke();
doc.restore();
doc.fillColor('#7C8CAE').font('Helvetica').fontSize(9).text('matrixhq.ai', M, footerY + 10);
doc.fillColor('#7C8CAE').font('Helvetica').fontSize(9).text('Matrix — AI Agent Platform', M, footerY + 10, { width: contentW, align: 'right' });

doc.end();
console.log('done');
