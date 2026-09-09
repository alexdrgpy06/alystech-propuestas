import PDFDocument from 'pdfkit';
import { summary, money, validate } from './src/domain.mjs';

function renderLogo(doc, logo) {
  if (!logo) return;
  try {
    doc.image(logo, 50, 42, { fit: [120, 44], align: 'left', valign: 'center' });
    doc.y = Math.max(doc.y, 100);
  } catch {
    // A malformed optional logo should not prevent a proposal from being delivered.
  }
}

// Buffered A4 PDF with a compact cover header, readable scope sections and repeatable footers.
export function renderPdf(p, selections, extras, demo = false) {
  validate(p);
  const s = summary(p, selections, extras);
  const en = p.locale === 'en';
  const accent = p.color || '#174d3d';
  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true, info: { Title: p.title, Author: p.seller } });
  const chunks = [];
  const result = new Promise((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const text = (value, size = 11, bold = false, options = {}) => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor('#22382d').text(String(value), { width: 495, lineGap: 3, ...options });
    if (options.lineBreak !== false) doc.moveDown(.45);
  };
  const heading = (value) => {
    doc.moveDown(.45);
    doc.font('Helvetica-Bold').fontSize(15).fillColor(accent).text(value, { width: 495, lineGap: 2 });
    doc.moveDown(.15);
    doc.strokeColor(accent).lineWidth(.8).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(.45);
  };

  renderLogo(doc, p.logo);
  text(p.seller, 12, true);
  text(p.title, 25, true);
  text(`${en ? 'Prepared for' : 'Preparado para'}: ${p.client}`, 11);
  text(`${p.id} / v${p.version} / ${new Date().toISOString().slice(0, 10)}`, 9);
  text(p.description, 11);

  for (const group of p.groups) {
    const option = group.options.find((candidate) => candidate.id === selections[group.id]);
    heading(group.title);
    text(option.name, 12, true);
    text(option.description, 10);
    for (const feature of option.features) text(`• ${feature}`, 10);
    for (const line of s.lines.filter((item) => item.group === group.id)) {
      text(`${line.addon ? '+ ' : ''}${line.name}: ${money(p, line.price)}${line.annual ? ` + ${money(p, line.annual)}${en ? ' annually' : ' anual'}` : ''}`, 10, true);
    }
  }

  heading(en ? 'Investment' : 'Inversión');
  text(`${en ? 'Initial investment' : 'Inversión inicial'}: ${money(p, s.initial)}`, 17, true);
  text(`${en ? 'Annual recurring (separate)' : 'Recurrente anual (separado)'}: ${money(p, s.annual)}`, 11, true);

  heading(en ? 'Terms' : 'Condiciones');
  for (const term of p.terms) text(`• ${term}`, 10);

  const pages = doc.bufferedPageRange();
  for (let index = 0; index < pages.count; index += 1) {
    doc.switchToPage(index);
    doc.font('Helvetica').fontSize(8).fillColor('#687268').text(`${index + 1} / ${pages.count}  •  ${p.id}`, 50, 778, { width: 495, align: 'center', lineBreak: false });
    if (demo) doc.font('Helvetica-Bold').fontSize(10).fillColor('#aa6300').text('DEMO — INTERACTIVE PROPOSAL', 50, 22, { width: 495, align: 'center', lineBreak: false });
  }
  doc.end();
  return result;
}
