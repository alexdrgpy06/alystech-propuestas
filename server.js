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

// Plantilla de email con la misma identidad visual (navy/azul) que la propuesta.
function emailShell({ eyebrow, title, accent, bodyHtml }) {
  return `
  <div style="background:#f5f7fa;padding:32px 16px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dde3ec">
      <div style="background:linear-gradient(120deg,#0d1f3c 0%,#173a68 55%,#2c5788 100%);padding:26px 28px">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#4f8cf7,#2c5788);text-align:center;vertical-align:middle;font-weight:800;color:#fff;font-size:16px;font-family:Arial,sans-serif">AT</td>
          <td style="padding-left:12px;color:#fff;font-size:15px;font-weight:700">Alystech<div style="font-weight:400;font-size:11.5px;color:#aebde0;margin-top:1px">Soluciones en Software y Seguridad Informática</div></td>
        </tr></table>
      </div>
      <div style="padding:26px 28px 6px">
        <div style="display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:${accent};background:${accent}1a;border:1px solid ${accent}40;border-radius:20px;padding:5px 12px;margin-bottom:14px">${esc(eyebrow)}</div>
        <h1 style="font-size:19px;color:#0d1f3c;margin:0 0 18px;font-weight:800">${esc(title)}</h1>
      </div>
      <div style="padding:0 28px 26px;color:#182437;font-size:13.5px;line-height:1.6">
        ${bodyHtml}
      </div>
      <div style="background:#fafbfd;border-top:1px solid #eef1f6;padding:14px 28px;color:#8590a3;font-size:11px">
        Alystech · Propuesta técnica y económica · Notificación automática
      </div>
    </div>
  </div>`;
}

function infoRow(label, value) {
  return `<div style="margin-bottom:10px"><span style="display:block;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:#48546b;margin-bottom:2px">${esc(label)}</span><span style="color:#182437">${value}</span></div>`;
}

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

  const accepted = decision === 'accept';
  const accent = accepted ? '#0f7a48' : '#b23a2b';
  const rows = (selections || []).map(s =>
    `<tr><td style="padding:9px 10px;border-bottom:1px solid #eef1f6;font-size:12.5px;color:#48546b">${esc(GROUP_LABELS[s.group] || s.group)}</td><td style="padding:9px 10px;border-bottom:1px solid #eef1f6;font-size:12.5px"><b>${esc(s.code)}</b> — ${esc(s.name)}</td><td style="padding:9px 10px;border-bottom:1px solid #eef1f6;font-size:12.5px;text-align:right;white-space:nowrap">${esc(s.price)}</td></tr>`
  ).join('');
  const subject = (accepted ? '✅ Propuesta ACEPTADA' : '❌ Propuesta RECHAZADA') + ` — ${clientName} (${proposalId || ''})`;
  const body = `
    ${infoRow('Propuesta', esc(proposalId))}
    ${infoRow('Cliente', `${esc(clientName)} — ${esc(clientEmail)}${clientPhone ? ' — ' + esc(clientPhone) : ''}`)}
    ${infoRow('Comentarios', esc(comments) || '<span style="color:#8590a3">(sin comentarios)</span>')}
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #eef1f6;border-radius:8px;overflow:hidden">
      <tr style="background:#0d1f3c"><th style="padding:9px 10px;text-align:left;color:#fff;font-size:10.5px;text-transform:uppercase;letter-spacing:.4px">Bloque</th><th style="padding:9px 10px;text-align:left;color:#fff;font-size:10.5px;text-transform:uppercase;letter-spacing:.4px">Opción</th><th style="padding:9px 10px;text-align:right;color:#fff;font-size:10.5px;text-transform:uppercase;letter-spacing:.4px">Precio</th></tr>
      ${rows}
      <tr><td colspan="2" style="padding:10px;background:#eef3fc;font-weight:700;color:#0d1f3c;font-size:13px">Total estimado</td><td style="padding:10px;background:#eef3fc;font-weight:700;color:#0d1f3c;font-size:13px;text-align:right">${esc(totals && totals.total)}</td></tr>
    </table>
    <p style="color:#8590a3;font-size:11px;margin-top:14px">Recibido: ${entry.createdAt} · IP: ${esc(entry.ip)}</p>
  `;
  const html = emailShell({
    eyebrow: accepted ? 'Propuesta aceptada' : 'Propuesta rechazada',
    title: accepted ? '✓ El cliente aceptó la propuesta' : '✕ El cliente rechazó la propuesta',
    accent,
    bodyHtml: body
  });
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
  const body = `
    ${infoRow('Propuesta', esc(proposalId))}
    ${infoRow('De', `${esc(name)} — ${esc(email)}${phone ? ' — ' + esc(phone) : ''}`)}
    <div style="margin-top:14px;background:#eef3fc;border:1px solid #cfe0f7;border-radius:10px;padding:14px 16px;color:#1e3d6b">
      <span style="display:block;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:#48546b;margin-bottom:6px">Mensaje</span>
      ${esc(message).replace(/\n/g, '<br>')}
    </div>
    <p style="color:#8590a3;font-size:11px;margin-top:14px">Recibido: ${entry.createdAt} · IP: ${esc(entry.ip)}</p>
  `;
  const html = emailShell({
    eyebrow: 'Nueva consulta',
    title: '💬 Un cliente dejó una consulta',
    accent: '#2f6fed',
    bodyHtml: body
  });
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

  const logoPath = path.join(__dirname, 'public', 'logo.png');
  let titleX = 50;
  let subtitleX = 50;
  
  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, 50, 45, { height: 35 });
      titleX = 100; // Shift text right if logo is rendered
      subtitleX = 100;
    } catch (e) {
      console.error('Error cargando logo PDF:', e);
    }
  }

  doc.fillColor('#0d1f3c').fontSize(20).font('Helvetica-Bold').text('Alystech', titleX, 50);
  doc.fontSize(9).fillColor('#48546b').font('Helvetica')
    .text('Soluciones en Software y Seguridad Informática', subtitleX, 74)
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
    if (y > 680) { doc.addPage(); y = 50; }
    doc.fontSize(9).fillColor('#48546b').font('Helvetica-Bold').text(GROUP_LABELS[s.group] || s.group, 50, y, { width: 105 });
    doc.fillColor('#182437').font('Helvetica-Bold').fontSize(9.5).text(`${s.code} — ${s.name}`, 160, y, { width: 280 });
    doc.font('Helvetica-Bold').fillColor('#0d1f3c').fontSize(9.5).text(s.price, 450, y, { width: 95, align: 'right' });
    y += 16;
    
    if (s.description) {
      doc.fillColor('#48546b').font('Helvetica').fontSize(8.5).text(s.description, 160, y, { width: 380, lineGap: 2 });
      y += doc.heightOfString(s.description, { width: 380, fontSize: 8.5 }) + 8;
    } else {
      y += 8;
    }

    if (s.costBreakdown && s.costBreakdown.length > 0) {
      const boxHeight = s.costBreakdown.length * 16 + 12;
      if (y + boxHeight > 750) { doc.addPage(); y = 50; }
      doc.rect(160, y, 385, boxHeight).fill('#fafbfd');
      doc.rect(160, y, 385, boxHeight).strokeColor('#eef1f6').stroke();
      y += 6;
      s.costBreakdown.forEach(line => {
        doc.fillColor('#8590a3').font('Helvetica').fontSize(8.5).text(line.label, 170, y, { width: 200 });
        doc.fillColor('#182437').font('Helvetica-Bold').text(line.recurring ? `$${line.amountUsd.toLocaleString('es-PY')}/año` : `$${line.amountUsd.toLocaleString('es-PY')}`, 450, y, { width: 85, align: 'right' });
        y += 16;
      });
      y += 6;
    }

    y += 12;
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
