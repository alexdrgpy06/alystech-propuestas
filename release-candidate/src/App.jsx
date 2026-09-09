import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { templates } from './templates.mjs';
import { templateForLocale } from './templateLocales.mjs';
import { validate, defaults, summary, money, available, decision } from './domain.mjs';
import './style.css';

const query = new URLSearchParams(location.search);
const demo = query.get('demo') === '1';
const client = query.get('client') === '1';
const pathLocale = location.pathname.toLowerCase().startsWith('/en') ? 'en' : 'es';
const localizedTemplates = templates.map((template) => templateForLocale(template, pathLocale));

const words = {
  es: {
    edit: 'Configurar propuesta', preview: 'Vista del cliente', next: 'Continuar', back: 'Anterior',
    summary: 'Resumen y decisión', initial: 'Inversión inicial', annual: 'Recurrente anual', extras: 'Complementos',
    included: 'Incluido', details: 'Ver alcance', save: 'Guardar en este navegador', export: 'Exportar configuración',
    import: 'Importar JSON', apply: 'Aplicar cambios', accept: 'Aceptar propuesta', changes: 'Pedir cambios',
    consult: 'Solicitar consulta', reject: 'Rechazar', pdf: 'Descargar propuesta PDF', message: 'Mensaje opcional',
    receipt: 'Descargar recibo', saved: 'Guardado localmente. Exporta una copia para compartir.',
    done: 'Decisión registrada en esta sesión. Descarga el recibo para enviarlo al proveedor.',
    demo: 'DEMO — PROPUESTA INTERACTIVA', demoShort: 'Sandbox de demostración', clientView: 'Vista para cliente',
    sellerMode: 'Modo configuración', step: 'Paso', of: 'de', choose: 'Elegir este alcance', selected: 'Seleccionado',
    review: 'Revisar propuesta', liveEstimate: 'Estimación en vivo', totalNote: 'El total se actualiza mientras eliges.',
    ready: '¿Listo para avanzar?', readyText: 'Confirma una decisión o deja un mensaje para continuar la conversación.',
    demoNote: 'Sandbox: las decisiones quedan solo en este navegador.', localNote: 'Las decisiones quedan en este navegador.',
    complete: 'Configuración completa', note: 'Las decisiones se registran localmente; no se envían automáticamente ni constituyen una firma electrónica.', template: 'Plantilla', custom: 'Personalizada', sandbox: 'Sandbox · No se envían datos',
    introHint: 'Selecciona una opción por etapa. Puedes revisar el alcance completo antes de decidir.',
    selectionCount: 'selecciones', noAnnual: 'Sin recurrente', pdfHint: 'PDF A4 listo para enviar',
  },
  en: {
    edit: 'Configure proposal', preview: 'Client preview', next: 'Continue', back: 'Back',
    summary: 'Review & decision', initial: 'Initial investment', annual: 'Annual recurring', extras: 'Add-ons',
    included: 'Included', details: 'View scope', save: 'Save in this browser', export: 'Export configuration',
    import: 'Import JSON', apply: 'Apply changes', accept: 'Accept proposal', changes: 'Request changes',
    consult: 'Request consultation', reject: 'Reject', pdf: 'Download proposal PDF', message: 'Optional message',
    receipt: 'Download receipt', saved: 'Saved locally. Export a copy to share.',
    done: 'Decision recorded in this session. Download the receipt to send it to the provider.',
    demo: 'DEMO — INTERACTIVE PROPOSAL', demoShort: 'Demo sandbox', clientView: 'Client view',
    sellerMode: 'Configuration mode', step: 'Step', of: 'of', choose: 'Choose this scope', selected: 'Selected',
    review: 'Review proposal', liveEstimate: 'Live estimate', totalNote: 'The total updates as you choose.',
    ready: 'Ready to move forward?', readyText: 'Confirm a decision or leave a message to continue the conversation.',
    demoNote: 'Sandbox: decisions stay in this browser.', localNote: 'Decisions stay in this browser.',
    complete: 'Configuration complete', note: 'Decisions are local receipts; they are not automatically sent and are not electronic signatures.', template: 'Template', custom: 'Custom', sandbox: 'Sandbox · No data is sent',
    introHint: 'Choose one option per stage. Review the full scope before deciding.',
    selectionCount: 'selections', noAnnual: 'No recurring fee', pdfHint: 'A4 PDF ready to send',
  },
};

function download(value, name, type = 'application/json') {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([value], { type }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function contrastText(hex) {
  const clean = String(hex || '#174d3d').replace('#', '');
  const value = Number.parseInt(clean, 16);
  if (!Number.isFinite(value)) return '#ffffff';
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 155 ? '#152019' : '#ffffff';
}

function safeSession(p) {
  if (demo) return defaults(p);
  try {
    const raw = localStorage.getItem(`proposal-session:${p.id}`);
    const saved = raw ? JSON.parse(raw) : {};
    return Object.fromEntries(p.groups.map((group) => [
      group.id,
      group.options.some((option) => option.id === saved.selections?.[group.id])
        ? saved.selections[group.id]
        : group.defaultOptionId,
    ]));
  } catch {
    return defaults(p);
  }
}

function App() {
  const [p, setP] = useState(() => {
    try {
      return !demo && localStorage.getItem('proposal-config')
        ? { ...validate(JSON.parse(localStorage.getItem('proposal-config'))), locale: pathLocale }
        : { ...structuredClone(localizedTemplates[0]), locale: pathLocale };
    } catch {
      return structuredClone(templates[0]);
    }
  });
  const [selections, setSelections] = useState(() => safeSession(p));
  const [extras, setExtras] = useState({});
  const [step, setStep] = useState(0);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');

  const t = words[p.locale];
  const s = useMemo(() => summary(p, selections, extras), [p, selections, extras]);
  const groupsCount = p.groups.length;
  const last = step === groupsCount;
  const g = p.groups[step];
  const accent = p.color || '#174d3d';
  const selectionText = `${s.lines.length} ${p.locale === 'es' ? (s.lines.length === 1 ? 'selección' : 'selecciones') : (s.lines.length === 1 ? 'selection' : 'selections')}`;

  useEffect(() => {
    if (demo) return;
    try {
      localStorage.setItem(`proposal-session:${p.id}`, JSON.stringify({ selections, extras }));
    } catch {
      // Local persistence is a convenience; the buyer flow remains usable when storage is blocked.
    }
  }, [p.id, selections, extras]);

  function normalizeSelections(next, current = selections) {
    return Object.fromEntries(next.groups.map((group) => [
      group.id,
      group.options.some((option) => option.id === current[group.id])
        ? current[group.id]
        : group.defaultOptionId,
    ]));
  }

  function update(next) {
    try {
      const clean = { ...validate(next), locale: p.locale };
      setP(clean);
      setSelections((current) => normalizeSelections(clean, current));
      setDraft(JSON.stringify(clean, null, 2));
      setReceipt(null);
    } catch (error) {
      setStatus(error.message);
    }
  }

  function load(next) {
    try {
      const clean = validate(next);
      setP(clean);
      setSelections(defaults(clean));
      setExtras({});
      setStep(0);
      setReceipt(null);
      setMessage('');
      setStatus('');
      setDraft(JSON.stringify(clean, null, 2));
    } catch (error) {
      setStatus(error.message);
    }
  }

  function choose(groupId, optionId) {
    setSelections((current) => ({ ...current, [groupId]: optionId }));
    setReceipt(null);
  }

  function decide(type) {
    const result = decision(p, selections, extras, type, demo, message);
    setReceipt(result);
    setStatus(t.done);
  }

  async function pdf() {
    try {
      const res = await fetch(`/api/pdf${demo ? '?demo=1' : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal: p, selections, extras }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      download(await blob.arrayBuffer(), 'proposal.pdf', 'application/pdf');
      setStatus(t.pdfHint);
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="app" style={{ '--accent': accent, '--accent-contrast': contrastText(accent) }}>
      <header>
        <a className="brand" href={demo ? '?demo=1' : '/'} aria-label="Proposal Builder home">
          <span className="brand-mark" aria-hidden="true">◈</span>
          <span>Proposal Builder</span>
        </a>
        <div className="header-tools">
          <span className="mode-pill">{demo ? t.demoShort : client ? t.clientView : t.sellerMode}</span>
          <select aria-label="Language" value={p.locale} onChange={(event) => setP(templateForLocale(p, event.target.value))}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
          {!demo && !client && (
            <button onClick={() => { setDraft(JSON.stringify(p, null, 2)); setEdit(!edit); }}>
              {edit ? t.preview : t.edit}
            </button>
          )}
        </div>
      </header>

      {demo && <div className="demo" role="note">{t.demo} <span>· {t.sandbox}</span></div>}

      <main>
        {!client && (
          <div className="templates">
            <label>{t.template}
              <select value={localizedTemplates.some((template) => template.id === p.id) ? p.id : ''} onChange={(event) => load(structuredClone(localizedTemplates.find((template) => template.id === event.target.value)))}>
                <option value="" disabled>{t.custom}</option>
                {localizedTemplates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
              </select>
            </label>
          </div>
        )}

        {edit && !demo ? (
          <section className="editor">
            <div className="section-heading">
              <p className="eyebrow">{t.sellerMode}</p>
              <h1>{t.edit}</h1>
              <p>Personaliza marca, textos, opciones, precios y condiciones. Guarda el borrador o exporta el JSON antes de compartirlo.</p>
            </div>
            <div className="grid">
              <label>Empresa / Seller<input value={p.seller} onChange={(event) => { const value = { ...p, seller: event.target.value }; if (event.target.value.trim()) update(value); }} /></label>
              <label>Cliente / Client<input value={p.client} onChange={(event) => { const value = { ...p, client: event.target.value }; if (event.target.value.trim()) update(value); }} /></label>
              <label>Color<input type="color" value={p.color || '#174d3d'} onChange={(event) => update({ ...p, color: event.target.value })} /></label>
            </div>
            <label>Título / Title<input value={p.title} onChange={(event) => update({ ...p, title: event.target.value })} /></label>
            <label>Descripción / Description<textarea value={p.description} onChange={(event) => update({ ...p, description: event.target.value })} /></label>
            <label>Moneda / Currency<select value={p.currency} onChange={(event) => update({ ...p, currency: event.target.value })}><option>USD</option><option>EUR</option><option>PYG</option></select></label>
            <label>Logo (PNG/JPEG/WebP)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 200000) { setStatus('Logo max 200 KB'); return; } const reader = new FileReader(); reader.onload = () => update({ ...p, logo: reader.result }); reader.readAsDataURL(file); }} /></label>
            {p.groups.map((group, groupIndex) => (
              <fieldset key={group.id}>
                <legend>{group.title}</legend>
                {group.options.map((option, optionIndex) => (
                  <div className="grid" key={option.id}>
                    <label>Opción / Option<input value={option.name} onChange={(event) => { const value = structuredClone(p); value.groups[groupIndex].options[optionIndex].name = event.target.value; update(value); }} /></label>
                    <label>Inicial / Initial<input type="number" min="0" step="0.01" value={option.price / (p.currency === 'PYG' ? 1 : 100)} onChange={(event) => { const value = structuredClone(p); value.groups[groupIndex].options[optionIndex].price = Math.round(Number(event.target.value) * (p.currency === 'PYG' ? 1 : 100)); update(value); }} /></label>
                    <label>Anual / Annual<input type="number" min="0" step="0.01" value={option.annual / (p.currency === 'PYG' ? 1 : 100)} onChange={(event) => { const value = structuredClone(p); value.groups[groupIndex].options[optionIndex].annual = Math.round(Number(event.target.value) * (p.currency === 'PYG' ? 1 : 100)); update(value); }} /></label>
                  </div>
                ))}
                {group.addons.map((addon, addonIndex) => (
                  <div className="grid" key={addon.id}>
                    <label>Complemento / Add-on<input value={addon.name} onChange={(event) => { const value = structuredClone(p); value.groups[groupIndex].addons[addonIndex].name = event.target.value; update(value); }} /></label>
                    <label>Inicial / Initial<input type="number" min="0" step="0.01" value={addon.price / (p.currency === 'PYG' ? 1 : 100)} onChange={(event) => { const value = structuredClone(p); value.groups[groupIndex].addons[addonIndex].price = Math.round(Number(event.target.value) * (p.currency === 'PYG' ? 1 : 100)); update(value); }} /></label>
                    <label>Anual / Annual<input type="number" min="0" step="0.01" value={addon.annual / (p.currency === 'PYG' ? 1 : 100)} onChange={(event) => { const value = structuredClone(p); value.groups[groupIndex].addons[addonIndex].annual = Math.round(Number(event.target.value) * (p.currency === 'PYG' ? 1 : 100)); update(value); }} /></label>
                  </div>
                ))}
              </fieldset>
            ))}
            <details>
              <summary>Configuración avanzada / Advanced configuration</summary>
              <label>JSON<textarea className="code" aria-label="Proposal JSON" value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
            </details>
            <div className="actions">
              <button onClick={() => { try { load(JSON.parse(draft)); } catch (error) { setStatus(error.message); } }}>{t.apply}</button>
              <button onClick={() => { try { validate(p); localStorage.setItem('proposal-config', JSON.stringify(p)); setStatus(t.saved); } catch (error) { setStatus(error.message); } }}>{t.save}</button>
              <button onClick={() => download(JSON.stringify(p, null, 2), 'proposal-config.json')}>{t.export}</button>
              <label className="file">{t.import}<input type="file" accept="application/json,.json" onChange={async (event) => { try { const file = event.target.files?.[0]; if (!file) return; if (file.size > 1000000) throw new Error('File too large'); load(JSON.parse(await file.text())); } catch (error) { setStatus(error.message); } }} /></label>
            </div>
          </section>
        ) : (
          <>
            <div className="intro">
              <div className="intro-top">
                {p.logo && <img alt={p.seller} src={p.logo} />}
                <div>
                  <p className="eyebrow">{p.seller} / {p.client}</p>
                  <p className="proposal-meta">{p.id} · v{p.version}</p>
                </div>
              </div>
              <h1>{p.title}</h1>
              <p>{p.description}</p>
              <p className="intro-hint">{t.introHint}</p>
            </div>

            <div className="progress-label"><span>{t.step} {Math.min(step + 1, groupsCount + 1)} {t.of} {groupsCount + 1}</span><strong>{last ? t.summary : g.title}</strong></div>
            <nav className="steps" aria-label="Proposal steps">
              {p.groups.map((group, index) => <button key={group.id} aria-current={step === index ? 'step' : undefined} onClick={() => setStep(index)}><span>{String(index + 1).padStart(2, '0')}</span>{group.title}</button>)}
              <button aria-current={last ? 'step' : undefined} onClick={() => setStep(groupsCount)}><span>{String(groupsCount + 1).padStart(2, '0')}</span>{t.summary}</button>
            </nav>

            <div className="workspace">
              <section className="content-panel">
                {!last ? (
                  <>
                    <div className="section-heading compact"><p className="eyebrow">{t.step} {step + 1}</p><h2>{g.title}</h2></div>
                    <div className="cards">
                      {g.options.map((option) => {
                        const isSelected = selections[g.id] === option.id;
                        return <article
                          key={option.id}
                          className={`option-card${isSelected ? ' selected' : ''}`}
                          tabIndex="0"
                          onClick={() => choose(g.id, option.id)}
                          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(g.id, option.id); } }}
                        >
                          <label className="choice-label" onClick={(event) => event.stopPropagation()}>
                            <input type="radio" name={g.id} checked={isSelected} onChange={() => choose(g.id, option.id)} />
                            <span><strong>{option.name}</strong><small>{isSelected ? `✓ ${t.selected}` : t.choose}</small></span>
                          </label>
                          <p>{option.description}</p>
                          <div className="price-row"><h3>{money(p, option.price)}</h3>{option.annual > 0 && <p>+ {money(p, option.annual)} / {t.annual}</p>}</div>
                          <details onClick={(event) => event.stopPropagation()}><summary>{t.details}</summary><ul>{option.features.map((feature, index) => <li key={index}>{feature}</li>)}</ul></details>
                        </article>;
                      })}
                    </div>
                    {g.addons.length > 0 && <>
                      <h3 className="subsection-title">{t.extras}</h3>
                      <div className="addons-list">{g.addons.map((addon) => {
                        const isAvailable = available(addon, selections[g.id]);
                        const isIncluded = addon.includedInTiers.includes(selections[g.id]);
                        const isChecked = isIncluded || (extras[g.id] || []).includes(addon.id);
                        return <label className={`addon${!isAvailable ? ' unavailable' : ''}`} key={addon.id}>
                          <input type="checkbox" checked={isChecked} disabled={!isAvailable} onChange={(event) => { setExtras({ ...extras, [g.id]: event.target.checked ? [...(extras[g.id] || []), addon.id] : (extras[g.id] || []).filter((id) => id !== addon.id) }); setReceipt(null); }} />
                          <span className="addon-name"><strong>{addon.name}</strong>{!isAvailable && !isIncluded && <small>Disponible en otro nivel</small>}</span>
                          <span>{isIncluded ? t.included : money(p, addon.price) + (addon.annual ? ` + ${money(p, addon.annual)} / ${t.annual}` : '')}</span>
                        </label>;
                      })}</div>
                    </>}
                  </>
                ) : (
                  <>
                    <div className="summary-heading"><div><p className="eyebrow">{t.complete}</p><h2>{t.summary}</h2></div><span className="complete-badge">✓ {t.complete}</span></div>
                    <div className="summary-lines">{s.lines.map((line) => <div className="line" key={line.group + line.id}><span>{line.addon ? '+ ' : ''}{line.name}</span><strong>{money(p, line.price)}{line.annual > 0 && ` + ${money(p, line.annual)} / ${t.annual}`}</strong></div>)}</div>
                    <h3 className="subsection-title">Condiciones / Terms</h3>
                    <ul className="terms">{p.terms.map((term, index) => <li key={index}>{term}</li>)}</ul>
                    <div className="summary-actions"><button className="primary" onClick={pdf}>{t.pdf}</button><span>{t.pdfHint}</span></div>
                    <hr />
                    <label>{t.message}<textarea value={message} maxLength={4000} placeholder="..." onChange={(event) => setMessage(event.target.value)} /></label>
                    <div className="decision-box"><div><h3>{t.ready}</h3><p>{t.readyText}</p></div><div className="actions"><button className="primary" onClick={() => decide('accepted')}>{t.accept}</button><button onClick={() => decide('changes_requested')}>{t.changes}</button><button onClick={() => decide('consultation_requested')}>{t.consult}</button><button className="quiet-button" onClick={() => decide('rejected')}>{t.reject}</button></div></div>
                    <p className="muted">{demo ? t.demoNote : t.note}</p>
                    {receipt && <div className="receipt"><strong>{t.done}</strong><button onClick={() => download(JSON.stringify(receipt, null, 2), 'decision.json')}>{t.receipt}</button></div>}
                  </>
                )}
              </section>

              <aside className="quote-summary">
                <p className="aside-kicker">{t.liveEstimate}</p>
                <p className="summary-count">{selectionText}</p>
                <p>{t.initial}</p><div className="total">{money(p, s.initial)}</div>
                <hr /><p>{t.annual}</p><strong className="annual-total">{s.annual ? money(p, s.annual) : t.noAnnual}</strong>
                <p className="muted">{p.currency} · {p.id} · v{p.version}</p>
                {!last && <button className="primary full-button" onClick={() => setStep(groupsCount)}>{t.review}</button>}
                {last && <p className="aside-ready">{t.pdfHint}</p>}
                <p className="muted">{demo ? t.demoNote : t.localNote}</p>
              </aside>
            </div>

            <footer><button disabled={step === 0} onClick={() => setStep(step - 1)}>{t.back}</button><span>{step + 1} / {groupsCount + 1}</span><button className="primary" disabled={last} onClick={() => setStep(step + 1)}>{t.next}</button></footer>
          </>
        )}
        {status && <p role="status" className="status">{status}</p>}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
