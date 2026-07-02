const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let nodemailer = null;
try { nodemailer = require('nodemailer'); } catch (e) { /* optional */ }
let PDFDocument = null;
try { PDFDocument = require('pdfkit'); } catch (e) { /* optional */ }

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DECISIONS_FILE = path.join(DATA_DIR, 'decisions.json');
const CONSULTAS_FILE = path.join(DATA_DIR, 'consultas.json');

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || 'no-reply@alystechpy.online';
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DECISIONS_FILE)) fs.writeFileSync(DECISIONS_FILE, '[]');
if (!fs.existsSync(CONSULTAS_FILE)) fs.writeFileSync(CONSULTAS_FILE, '[]');

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8') || '[]'); }
  catch (e) { return []; }
}
function appendJson(file, entry) {
  const list = readJson(file);
  list.unshift(entry);
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
  return list;
}

let transporter = null;
function getTransporter() {
  if (!nodemailer || !SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE || SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  }
  return transporter;
}

async function notify(subject, html) {
  const t = getTransporter();
  if (!t || !NOTIFY_EMAIL) {
    console.log('[email no configurado] ' + subject);
    return;
  }
  try {
    await t.sendMail({ from: SMTP_FROM, to: NOTIFY_EMAIL, subject, html });
  } catch (e) {
    console.error('Error enviando email:', e.message);
  }
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const GROUP_LABELS = { mdm: 'A · Plataforma móvil', srv: 'B · Servidor', net: 'B · Red', aud: 'C · Auditoría', sup: 'D · Soporte' };

app.use(express.json({ limit: '256kb' }));

app.use(express.static(path.join(__dirname, 'public'), { index: 'landing.html' }));
app.use('/araucanos', express.static(path.join(__dirname, 'public', 'araucanos')));

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.post('/api/decision', async (req, res) => {
  const { proposalId, decision, clientName, clientEmail, clientPhone, comments, selections, totals } = req.body || {};
  if (!decision || !['accept', 'reject'].includes(decision)) {
    return res.status(400).json({ ok: false, error: 'decision inválida' });
  }
  if (!clientName || !clientEmail) {
    return res.status(400).json({ ok: false, error: 'faltan datos de contacto' });
  }
  const entry = {
    id: crypto.randomUUID(),
    type: 'decision',
    proposalId: proposalId || 'unknown',
    decision,
    clientName, clientEmail, clientPhone: clientPhone || '',
    comments: comments || '',
    selections: selections || [],
    totals: totals || {},
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
    createdAt: new Date().toISOString()
  };
  appendJson(DECISIONS_FILE, entry);

  const rows = (selections || []).map(s =>
    `<tr><td style="padding:4px 8px;border:1px solid #ddd">${esc(GROUP_LABELS[s.group] || s.group)}</td><td style="padding:4px 8px;border:1px solid #ddd">${esc(s.code)} — ${esc(s.name)}</td><td style="padding:4px 8px;border:1px solid #ddd">${esc(s.price)}</td></tr>`
  ).join('');
  const subject = (decision === 'accept' ? '✅ Propuesta ACEPTADA' : '❌ Propuesta RECHAZADA') + ` — ${clientName} (${proposalId || ''})`;
  const html = `
    <h2>${decision === 'accept' ? 'Propuesta aceptada' : 'Propuesta rechazada'}</h2>
    <p><b>Propuesta:</b> ${esc(proposalId)}</p>
    <p><b>Cliente:</b> ${esc(clientName)} — ${esc(clientEmail)} ${clientPhone ? '— ' + esc(clientPhone) : ''}</p>
    <p><b>Comentarios:</b> ${esc(comments) || '(sin comentarios)'}</p>
    <table style="border-collapse:collapse;margin-top:10px">
      <tr><th style="padding:4px 8px;border:1px solid #ddd;text-align:left">Bloque</th><th style="padding:4px 8px;border:1px solid #ddd;text-align:left">Opción</th><th style="padding:4px 8px;border:1px solid #ddd;text-align:left">Precio</th></tr>
      ${rows}
    </table>
    <p style="margin-top:10px"><b>Total estimado:</b> ${esc(totals && totals.total)}</p>
    <p style="color:#888;font-size:12px">Recibido: ${entry.createdAt} · IP: ${esc(entry.ip)}</p>
  `;
  await notify(subject, html);
  res.json({ ok: true });
});

app.post('/api/consulta', async (req, res) => {
  const { proposalId, name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'faltan datos' });
  }
  const entry = {
    id: crypto.randomUUID(),
    type: 'consulta',
    proposalId: proposalId || 'unknown',
    name, email, phone: phone || '', message,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
    createdAt: new Date().toISOString()
  };
  appendJson(CONSULTAS_FILE, entry);

  const subject = `💬 Nueva consulta — ${name} (${proposalId || ''})`;
  const html = `
    <h2>Nueva consulta sobre la propuesta</h2>
    <p><b>Propuesta:</b> ${esc(proposalId)}</p>
    <p><b>De:</b> ${esc(name)} — ${esc(email)} ${phone ? '— ' + esc(phone) : ''}</p>
    <p><b>Mensaje:</b><br>${esc(message).replace(/\n/g, '<br>')}</p>
    <p style="color:#888;font-size:12px">Recibido: ${entry.createdAt} · IP: ${esc(entry.ip)}</p>
  `;
  await notify(subject, html);
  res.json({ ok: true });
});

app.post('/api/pdf', (req, res) => {
  if (!PDFDocument) return res.status(500).json({ ok: false, error: 'PDF no disponible' });
  const { proposalId, selections, totals, clientName } = req.body || {};
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Alystech-Presupuesto-Araucanos.pdf"`);
  doc.pipe(res);

  doc.fillColor('#0d1f3c').fontSize(20).font('Helvetica-Bold').text('Alystech', 50, 50);
  doc.fontSize(9).fillColor('#48546b').font('Helvetica')
    .text('Soluciones en Software y Seguridad Informática', 50, 74)
    .text(`Ref.: ${proposalId || 'AT-2026-0630-P'}   ·   Generado: ${new Date().toLocaleDateString('es-PY')}`, 50, 88);
  doc.moveTo(50, 108).lineTo(545, 108).strokeColor('#dde3ec').stroke();

  doc.fontSize(15).fillColor('#0d1f3c').font('Helvetica-Bold')
    .text('Presupuesto — Plataforma de gestión móvil y seguridad informática', 50, 122, { width: 495 });
  let y = 165;
  doc.fontSize(10).fillColor('#48546b').font('Helvetica').text('Cliente: Araucanos S.A.', 50, y);
  y += 15;
  if (clientName) { doc.text(`Confirmado por: ${clientName}`, 50, y); y += 15; }

  y += 15;
  doc.fontSize(11).fillColor('#0d1f3c').font('Helvetica-Bold').text('Configuración seleccionada', 50, y);
  y += 22;
  (selections || []).forEach(s => {
    doc.fontSize(9).fillColor('#48546b').font('Helvetica-Bold').text(GROUP_LABELS[s.group] || s.group, 50, y, { width: 105 });
    doc.fillColor('#182437').font('Helvetica').fontSize(9.5).text(`${s.code} — ${s.name}`, 160, y, { width: 280 });
    doc.font('Helvetica-Bold').fillColor('#0d1f3c').fontSize(9.5).text(s.price, 450, y, { width: 95, align: 'right' });
    y += 20;
    doc.moveTo(50, y - 6).lineTo(545, y - 6).strokeColor('#eef1f6').stroke();
  });

  y += 12;
  doc.rect(50, y, 495, 55).fill('#eef3fc');
  doc.fillColor('#0d1f3c').fontSize(9).font('Helvetica-Bold').text('TOTAL AÑO 1 (estimativo, IVA incluido)', 65, y + 10);
  doc.fontSize(20).text((totals && totals.total) || '$0', 65, y + 24);
  doc.fontSize(9).font('Helvetica').fillColor('#1e3d6b').text(`Recurrente anual: ${(totals && totals.recurrent) || '$0'}`, 300, y + 28);
  y += 80;

  doc.fontSize(9.5).fillColor('#0d1f3c').font('Helvetica-Bold').text('Condiciones', 50, y);
  y += 16;
  const cond = [
    'Forma de pago (desarrollo/implementación): 50% al aceptar la propuesta, 25% al iniciar la implementación, 25% a la entrega.',
    'Equipos y hardware van por separado, a cargo del cliente. Alystech puede oficiar de intermediario de compra.',
    'La visita de relevamiento y la auditoría en sitio pueden detectar hallazgos fuera de este alcance; de aparecer, se cotizan aparte antes de ejecutarlos.',
    'Precios estimativos, con IVA incluido. Validez de esta propuesta: 30 días. Tipo de cambio: 1 USD ~ 6.250 Gs.'
  ];
  doc.fontSize(8.5).fillColor('#48546b').font('Helvetica');
  cond.forEach(line => {
    doc.text('•  ' + line, 50, y, { width: 495 });
    y += doc.heightOfString(line, { width: 480 }) + 6;
  });

  doc.fontSize(8).fillColor('#8590a3')
    .text('Alystech · Soluciones en Software y Seguridad Informática', 50, 780, { width: 495, align: 'center' });

  doc.end();
});

app.listen(PORT, () => {
  console.log(`Alystech propuestas escuchando en puerto ${PORT}`);
  if (!getTransporter()) console.log('⚠ SMTP no configurado — las notificaciones solo quedan guardadas en el contenedor (data/*.json).');
});
