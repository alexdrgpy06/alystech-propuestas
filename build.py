#!/usr/bin/env python3
import re, sys, os

SRC = "/sessions/vigilant-intelligent-ride/mnt/uploads/Alystech_Plataforma.html"
OUT = "/tmp/build2/alystech-propuestas/public/araucanos/index.html"

with open(SRC, "r", encoding="utf-8") as f:
    html = f.read()

PROPOSAL_ID = "AT-2026-0630-P"

def find_matching_close(s, content_start):
    depth = 1
    pos = content_start
    pattern = re.compile(r'<div\b|</div>')
    while True:
        m = pattern.search(s, pos)
        if not m:
            raise ValueError('no matching </div> found')
        if m.group(0) == '</div>':
            depth -= 1
            if depth == 0:
                return m.start()
        else:
            depth += 1
        pos = m.end()

def wrap_details(s, start_marker, end_marker, summary_text, search_from=0):
    """Envuelve [start_marker ... end_marker) en un <details> colapsado."""
    start = s.index(start_marker, search_from)
    end = s.index(end_marker, start)
    chunk = s[start:end]
    wrapped = (f'<details class="techdetail"><summary>{summary_text}</summary>'
               f'<div class="techdetail-body">{chunk}</div></details>\n    ')
    return s[:start] + wrapped + s[end:]

# ---------------------------------------------------------------------------
# 1. CSS
# ---------------------------------------------------------------------------
EXTRA_CSS = """
html{scroll-behavior:smooth}
#wizard,#proximos-pasos,#condiciones{scroll-margin-top:52px}

/* ====== HERO ====== */
.hero{background:radial-gradient(1100px 460px at 15% -10%,rgba(79,140,247,.35),transparent 60%),linear-gradient(150deg,#0a1830 0%,#0d1f3c 42%,#173a68 78%,#2c5788 100%);color:#fff;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;inset:0;background:radial-gradient(800px 380px at 90% 110%,rgba(47,111,237,.25),transparent 60%)}
.hero .wrap{position:relative;padding:48px 22px 40px;max-width:900px}
.hero .heroeyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);padding:6px 13px;border-radius:20px;margin-bottom:16px}
.hero h1{font-size:clamp(22px,4.2vw,32px);font-weight:800;letter-spacing:-.5px;line-height:1.18;margin-bottom:11px}
.hero .herosub{font-size:13.5px;color:#cddffb;max-width:620px;line-height:1.6;margin-bottom:20px}
.hero .heroletter{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:16px 18px;margin-bottom:20px;backdrop-filter:blur(2px)}
.hero .heroletter p{font-size:12.6px;color:#e7edf9;line-height:1.6;margin-bottom:8px}
.hero .heroletter p:last-child{margin-bottom:0}
.hero .herosign{font-size:12px;color:#fff;font-weight:700;margin-top:10px}
.hero .herosign span{display:block;font-weight:400;color:#aebde0;font-size:10.5px;margin-top:2px}
.hero .herometa{display:grid;grid-template-columns:repeat(4,1fr);gap:14px 18px;font-size:11px;color:#bcd0f2;margin-bottom:22px}
.hero .herometa b{color:#fff;display:block;font-size:12.5px;margin-top:2px}
.hero .herocta{display:flex;gap:10px;flex-wrap:wrap}
.hero .btn{border:none;cursor:pointer;font-weight:700;font-size:13px;padding:12px 20px;border-radius:9px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;transition:.15s}
.hero .btn-primary{background:#2f6fed;color:#fff;box-shadow:0 8px 22px rgba(47,111,237,.4)}
.hero .btn-primary:hover{background:#1a4fc0}
.hero .btn-ghost{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.28)}
.hero .btn-ghost:hover{background:rgba(255,255,255,.16)}

/* ====== ABOUT ====== */
.about{background:#fff;border-bottom:1px solid var(--line)}
.about .wrap{padding:30px 22px}
.about .abouthead{max-width:640px;margin-bottom:18px}
.about .kicker{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--blue);margin-bottom:7px}
.about h2{font-size:18px;color:var(--navy);font-weight:800;letter-spacing:-.3px;margin-bottom:8px}
.about h3.subkicker{font-size:14px;color:var(--navy);font-weight:800;margin:24px 0 4px}
.about .aboutlead{font-size:13px;color:var(--slate);line-height:1.6}
.paycard{display:flex;gap:11px;padding:2px 0}
.paycard .pcicon{font-size:17px;flex-shrink:0;width:26px;text-align:center}
.paycard h5{font-size:12.6px;color:var(--navy);font-weight:700;margin-bottom:3px}
.paycard p{font-size:12px;color:var(--slate);line-height:1.5;margin:0}
.pay-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px 24px;margin-top:12px;padding-top:14px;border-top:1px solid var(--line2)}
.benefit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px 24px;margin:14px 0}
.benefit{display:flex;gap:11px;padding:0;background:none;border:none}
.benefit .bicon{width:26px;height:26px;font-size:14px;flex-shrink:0;background:none;margin-bottom:0}
.benefit h5{font-size:12.6px;margin-bottom:3px}
.benefit p{font-size:11.8px;margin:0}

/* ====== NAV RÁPIDA (sticky, con marca integrada) ====== */
.quicknav{position:sticky;top:0;z-index:60;background:#fff;border-bottom:1px solid var(--line);box-shadow:0 1px 6px rgba(0,0,0,.05)}
.quicknav .qn-inner{display:flex;align-items:center;gap:8px;max-width:1080px;margin:0 auto;padding:0 22px}
.qn-brand{display:flex;align-items:center;gap:7px;flex-shrink:0;padding:10px 10px 10px 0;border-right:1px solid var(--line2);margin-right:2px}
.qn-brand .qn-logo{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,var(--blue),var(--steel));color:#fff;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center}
.qn-brand span:last-child{font-size:12px;font-weight:700;color:var(--navy);white-space:nowrap}
.quicknav .qn-scroll{display:flex;gap:2px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;flex:1;min-width:0}
.quicknav .qn-scroll::-webkit-scrollbar{display:none}
.quicknav a{flex-shrink:0;padding:13px 12px;font-size:12px;font-weight:600;color:var(--slate);text-decoration:none;border-bottom:3px solid transparent;white-space:nowrap;transition:.15s;cursor:pointer}
.quicknav a:hover{color:var(--navy);background:#f8fafc}
.quicknav a.active{color:var(--navy);border-bottom-color:var(--blue)}

/* ====== TOTALSTRIP (reemplaza el subbar grande) ====== */
.totalstrip{background:#fafbfd;border-bottom:1px solid var(--line)}
.totalstrip .wrap{padding:9px 22px}
.ts-row{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.ts-amt-wrap{display:flex;align-items:baseline;gap:7px}
.ts-lbl{font-size:10px;color:var(--slate);text-transform:uppercase;letter-spacing:.4px}
.ts-amt{font-size:16px;font-weight:800;color:var(--navy)}
.ts-detail{font-size:10.5px;color:var(--slate);display:flex;flex-direction:column;gap:1px}
.ts-bar-wrap{display:flex;align-items:center;gap:8px}
.splitbar{display:flex;height:5px;border-radius:3px;overflow:hidden;width:110px;background:var(--line2)}
.splitbar .sb-dev{background:#5b9bf5}
.splitbar .sb-hw{background:#f5c15b}
.splitlegend{display:flex;gap:8px;font-size:9.5px;color:var(--slate)}
.splitlegend span{display:flex;align-items:center;gap:3px}
.splitlegend i{width:7px;height:7px;border-radius:2px;display:inline-block}
.ts-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.ts-actions .chip{font-size:10.5px;background:var(--blue-soft);color:var(--steel);padding:4px 9px;border-radius:6px;font-weight:600}
.ts-actions .reset{background:none;border:1px solid var(--line);color:var(--slate);padding:5px 10px;border-radius:6px;font-size:10.5px;cursor:pointer;font-weight:600}
.ts-actions .reset:hover{background:#f0f2f5}
@media(max-width:640px){.ts-row{gap:8px 14px}.ts-bar-wrap{display:none}.ts-actions{margin-left:0;width:100%;justify-content:space-between}}

/* ====== TARJETA "EN SIMPLE" por paso ====== */
.stepcard{display:flex;gap:12px;background:var(--green-soft);border:1px solid #c3e3d0;border-radius:11px;padding:14px 16px;margin:14px 0 18px}
.stepcard-ic{font-size:19px;flex-shrink:0}
.stepcard-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#0d5735;display:block;margin-bottom:3px}
.stepcard p{font-size:12.8px;color:#0d3d28;line-height:1.55;margin:0}

/* ====== DETALLE TÉCNICO COLAPSABLE ====== */
.techdetail{border:1px solid var(--line);border-radius:11px;margin:16px 0;overflow:hidden;background:#fcfdfe}
.techdetail summary{cursor:pointer;padding:12px 16px;font-size:12.5px;font-weight:700;color:var(--steel);list-style:none;display:flex;align-items:center;gap:8px}
.techdetail summary::-webkit-details-marker{display:none}
.techdetail summary::before{content:"▸";color:var(--blue);font-size:11px}
.techdetail[open] summary::before{content:"▾"}
.techdetail summary::after{content:"click para expandir";margin-left:auto;font-size:10.5px;color:#9aa5b8;font-weight:500}
.techdetail[open] summary::after{content:"click para colapsar"}
.techdetail-body{padding:4px 16px 16px;border-top:1px solid var(--line2)}

/* ====== NAV RÁPIDA WIZARD ====== */
.wizard{display:flex;flex-direction:column}
.wizard-progress{padding:16px 22px 0}
.wp-track{height:6px;background:var(--line2);border-radius:4px;overflow:hidden}
.wp-fill{height:100%;background:linear-gradient(90deg,var(--blue),var(--steel));border-radius:4px;transition:width .35s ease;width:0%}
.wp-label{font-size:11.5px;color:var(--slate);margin-top:9px;font-weight:600}
.wp-label #wp-title{color:var(--navy);font-weight:700}
.wizard-viewport{position:relative;padding:10px 22px 4px;min-height:120px}
.wstep{display:none}
.wstep.active{display:block;animation:wfade .35s ease}
@keyframes wfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.wizard-nav{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 22px 22px;border-top:1px solid var(--line2);margin-top:14px;flex-wrap:wrap}
.wnav-btn{border:none;cursor:pointer;font-weight:700;font-size:13px;padding:11px 20px;border-radius:9px}
.wnav-back{background:#eef1f6;color:var(--slate)}
.wnav-next{background:var(--blue);color:#fff;margin-left:auto}
.wnav-dots{display:flex;gap:6px;order:2}
.wnav-dots span{width:7px;height:7px;border-radius:50%;background:var(--line);transition:.2s;cursor:pointer}
.wnav-dots span.on{background:var(--blue);width:20px;border-radius:4px}

/* ====== PANEL HEAD MINIMAL ====== */
.panel-head.slim{padding:13px 22px;background:#fff}
.panel-head.slim h2{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--steel);font-weight:700}

/* ====== RESUMEN FINAL ====== */
.finalsum-h{font-size:19px;color:var(--navy);font-weight:800;margin-bottom:6px}
.finalsum-sub{font-size:13px;color:var(--slate);margin-bottom:20px}
.finalsum-total{background:var(--blue-soft);border:1px solid #cfe0f7;border-radius:12px;padding:20px;margin-bottom:20px;text-align:center}
.ft-amt{font-size:32px;font-weight:800;color:var(--navy);letter-spacing:-.5px}
.ft-sub{font-size:12px;color:#1e3d6b;margin-top:5px}
.finalsum-items{display:grid;gap:8px;margin-bottom:22px}
.fs-item{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fafbfd;border:1px solid var(--line2);border-radius:9px;padding:11px 14px;font-size:12.6px}
.fs-item-g{color:var(--steel);font-weight:700;flex-shrink:0;width:118px}
.fs-item-n{color:var(--ink);flex:1}
.fs-item-p{color:var(--navy);font-weight:800;white-space:nowrap}
.finalsum-alt-h{font-size:12px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px}
.finalsum-alt{margin-bottom:22px}
.fs-alt-block{border:1px solid var(--line);border-radius:9px;margin-bottom:8px;overflow:hidden}
.fs-alt-block summary{cursor:pointer;padding:11px 14px;font-size:12.5px;font-weight:700;color:var(--navy);background:#f8fafc;list-style:none}
.fs-alt-block summary::-webkit-details-marker{display:none}
.fs-alt-block summary::before{content:"▸ ";color:var(--blue)}
.fs-alt-block[open] summary::before{content:"▾ "}
.fs-alt-list{padding:4px 14px 10px}
.fs-alt-opt{font-size:12px;color:var(--slate);padding:6px 0;border-bottom:1px dashed var(--line2);display:flex;justify-content:space-between;gap:10px}
.fs-alt-opt:last-child{border-bottom:none}
.fs-alt-opt.chosen{color:var(--green);font-weight:700}
.finalsum-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.finalsum-actions .abtn{padding:13px 14px;font-size:13px;border-radius:10px;justify-content:center}
.finalsum-actions .abtn-accept{background:var(--green);color:#fff}
.finalsum-actions .abtn-reject{background:var(--red-soft);color:var(--red);border:1px solid #f0cfc9}
.finalsum-actions .abtn-consulta{background:var(--blue-soft);color:var(--steel);border:1px solid #cfe0f7}
.finalsum-actions .abtn-pdf{background:var(--navy);color:#fff}
@media(max-width:560px){.finalsum-actions{grid-template-columns:1fr}.fs-item{flex-direction:column;align-items:flex-start;gap:3px}.fs-item-g{width:auto}}

/* ====== ACTION BAR ====== */
.action-bar{position:sticky;bottom:0;z-index:70;background:linear-gradient(90deg,var(--navy) 0%,#173a68 55%,var(--steel) 100%);border-top:2px solid var(--blue);box-shadow:0 -6px 24px rgba(13,31,60,.25)}
.action-bar .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 16px;flex-wrap:wrap}
.action-bar .ab-msg{color:#cddffb;font-size:11.5px}
.action-bar .ab-msg b{color:#fff}
.action-bar .ab-btns{display:flex;gap:8px;flex-wrap:wrap}
.abtn{border:none;cursor:pointer;font-weight:700;font-size:12.2px;padding:9px 14px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;transition:.15s;white-space:nowrap}
.abtn-accept{background:var(--green);color:#fff}
.abtn-accept:hover{background:#0c5f39}
.abtn-reject{background:transparent;color:#ffb8ac;border:1px solid rgba(255,255,255,.3)}
.abtn-reject:hover{background:rgba(178,58,43,.25)}
.abtn-consulta{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.22)}
.abtn-consulta:hover{background:rgba(255,255,255,.18)}
.abtn-pdf{background:var(--blue);color:#fff}
.abtn-pdf:hover{background:var(--blue-d)}

/* ====== MODALES ====== */
.modal-overlay{position:fixed;inset:0;background:rgba(10,20,40,.55);display:none;align-items:center;justify-content:center;z-index:100;padding:14px}
.modal-overlay.open{display:flex}
.modal{background:#fff;border-radius:16px;max-width:480px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.modal-h{padding:18px 20px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:0;background:#fff}
.modal-h h3{font-size:15.5px;color:var(--navy);font-weight:800}
.modal-h .mclose{cursor:pointer;font-size:20px;color:var(--slate);background:none;border:none;line-height:1;padding:4px}
.modal-b{padding:18px 20px}
.modal-b p.mhint{font-size:12.3px;color:var(--slate);margin-bottom:14px;line-height:1.55}
.field{margin-bottom:13px}
.field label{display:block;font-size:11px;font-weight:700;color:var(--navy);margin-bottom:5px;text-transform:uppercase;letter-spacing:.3px}
.field input,.field textarea{width:100%;border:1.5px solid var(--line);border-radius:8px;padding:10px 12px;font-size:14px;font-family:inherit;color:var(--ink)}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--blue)}
.field textarea{resize:vertical;min-height:76px}
.modal-summary{background:var(--blue-soft);border:1px solid #cfe0f7;border-radius:10px;padding:11px 13px;margin-bottom:14px;font-size:11.8px;color:#1e3d6b;line-height:1.5}
.modal-summary b{display:block;margin-bottom:4px;color:var(--navy)}
.modal-foot{display:flex;gap:10px;justify-content:flex-end;padding:14px 20px 18px;flex-wrap:wrap}
.mbtn{border:none;cursor:pointer;font-weight:700;font-size:13px;padding:11px 18px;border-radius:8px;flex:1}
.mbtn-cancel{background:#eef1f6;color:var(--slate);flex:none}
.mbtn-submit{background:var(--blue);color:#fff}
.mbtn-submit.accept{background:var(--green)}
.mbtn-submit.reject{background:var(--red)}
.modal-ok{display:none;text-align:center;padding:26px 20px}
.modal-ok .mo-ic{font-size:38px;margin-bottom:10px}
.modal-ok h4{font-size:15.5px;color:var(--navy);margin-bottom:6px}
.modal-ok p{font-size:12.8px;color:var(--slate)}

/* ====== RESPONSIVE ====== */
@media(max-width:760px){
  .hero .herometa{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:640px){
  .action-bar .wrap{flex-direction:column;align-items:stretch;gap:8px}
  .action-bar .ab-msg{text-align:center}
  .action-bar .ab-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .abtn{justify-content:center;padding:11px 10px}
  .hero .wrap{padding:32px 16px 28px}
  .hero h1{font-size:21px}
  .hero .heroletter{padding:14px 15px}
  .hero .herocta{flex-direction:column}
  .hero .btn{justify-content:center;width:100%}
  .about .wrap{padding:24px 16px}
  .quicknav a{padding:11px 10px;font-size:11.5px}
  .qn-brand span:last-child{display:none}
  .pay-grid{grid-template-columns:1fr}
  .modal{border-radius:14px 14px 0 0;max-height:92vh;align-self:flex-end}
  .modal-overlay{align-items:flex-end;padding:0}
  .panel-head.slim{padding:11px 16px}
  .wrap{padding:0 16px}
  .wizard-progress,.wizard-viewport,.wizard-nav{padding-left:16px;padding-right:16px}
  .wnav-next{margin-left:0}
  .wizard-nav{justify-content:center}
  .wnav-back{order:1}.wnav-dots{order:2}.wnav-next{order:3;width:100%}
  .stepcard{padding:12px 13px;gap:9px}
  .techdetail summary::after{display:none}
}
@media(max-width:400px){
  .hero .herometa{grid-template-columns:1fr 1fr;gap:12px 14px}
  .hero .heroeyebrow{font-size:10px;padding:5px 10px}
}
"""

html = html.replace("</style>", EXTRA_CSS + "\n</style>")

# ---------------------------------------------------------------------------
# 2. Sacar masthead y titlestrip; poner nav rápida con marca integrada
# ---------------------------------------------------------------------------
OLD_MASTHEAD_AND_TITLE = """<div class="masthead">
  <div class="wrap">
    <div class="brand">
      <div class="logo">AT</div>
      <div><div class="bt">Alystech</div><div class="bs">Soluciones en Software y Seguridad Informática</div></div>
    </div>
    <div class="docmeta">
      <div><b>Propuesta técnica y económica</b></div>
      <div>Ref.: AT-2026-0630-P · Rev. 6</div>
      <div>Fecha: 30 de junio de 2026 · Validez: 30 días</div>
    </div>
  </div>
</div>
<div class="titlestrip">
  <div class="wrap">
    <h1>Plataforma de gestión móvil y seguridad informática</h1>
    <p>Control total de flota móvil, servidor local, auditoría y soporte unificado.</p>
    <div class="clientline">
      <div>Cliente: <b>Araucanos S.A.</b></div>
      <div>Rubro: <b>Servicios de seguridad</b></div>
      <div>Flota móvil: <b>~80 dispositivos Samsung</b></div>
      <div>Parque informático: <b>~20 equipos</b></div>
      <div>Tipo de cambio ref.: <b>1 USD ≈ 6.250 Gs</b></div>
    </div>
  </div>
</div>"""

NAV_HTML = """<nav class="quicknav">
  <div class="qn-inner">
    <div class="qn-brand"><span class="qn-logo">AT</span><span>Alystech</span></div>
    <div class="qn-scroll">
      <a href="#wizard" data-step="0">Resumen</a>
      <a href="#wizard" data-step="1">A· Móvil</a>
      <a href="#wizard" data-step="2">B· Servidor</a>
      <a href="#wizard" data-step="3">C· Auditoría</a>
      <a href="#wizard" data-step="4">D· Soporte</a>
      <a href="#wizard" data-step="5">Tu selección</a>
      <a href="#proximos-pasos">Próximos pasos</a>
      <a href="#condiciones">Condiciones</a>
    </div>
  </div>
</nav>"""

assert OLD_MASTHEAD_AND_TITLE in html, "masthead/titlestrip no encontrado"
html = html.replace(OLD_MASTHEAD_AND_TITLE, NAV_HTML)

# ---------------------------------------------------------------------------
# 3. Subbar grande -> totalstrip compacto (mismos IDs, para no romper el JS)
# ---------------------------------------------------------------------------
OLD_SUBBAR = """<div class="subbar">
  <div class="wrap">
    <div>
      <div class="sl">Subtotal Año 1 (según opciones seleccionadas)</div>
      <div class="amt" id="p1-amt">$0</div>
      <div class="gs" id="p1-gs">≈ 0 Gs · Recurrente anual: <span id="p1-recur">$0</span></div>
      <div class="gs" id="p1-split" style="margin-top:2px">Desarrollo/implementación: $0 · Equipos: $0</div>
      <div class="splitbar"><div class="sb-dev" id="p1-bar-dev" style="width:100%"></div><div class="sb-hw" id="p1-bar-hw" style="width:0%"></div></div>
      <div class="splitlegend"><span><i style="background:#5b9bf5"></i>Desarrollo</span><span><i style="background:#f5c15b"></i>Equipos</span></div>
    </div>
    <div class="aux">
      <div class="chip" id="p1-perdev">Por dispositivo: $0</div>
      <button class="reset" onclick="resetGroups(['mdm','srv','net','aud','sup'])">Restablecer</button>
    </div>
  </div>
</div>"""

NEW_TOTALSTRIP = """<div class="totalstrip">
  <div class="wrap">
    <div class="ts-row">
      <div class="ts-amt-wrap"><span class="ts-lbl" id="p1-sl">Total Año 1</span><span class="ts-amt" id="p1-amt">$0</span></div>
      <div class="ts-detail"><span id="p1-gs">≈ 0 Gs · Recurrente anual: <span id="p1-recur">$0</span></span><span id="p1-split">Desarrollo/implementación: $0 · Equipos: $0</span></div>
      <div class="ts-bar-wrap">
        <div class="splitbar"><div class="sb-dev" id="p1-bar-dev" style="width:100%"></div><div class="sb-hw" id="p1-bar-hw" style="width:0%"></div></div>
        <div class="splitlegend"><span><i style="background:#5b9bf5"></i>Desarrollo</span><span><i style="background:#f5c15b"></i>Equipos</span></div>
      </div>
      <div class="ts-actions">
        <span class="chip" id="p1-perdev">Por dispositivo: $0</span>
        <button class="reset" onclick="resetGroups(['mdm','srv','net','aud','sup'])">↺ Restablecer</button>
      </div>
    </div>
  </div>
</div>"""

assert OLD_SUBBAR in html, "subbar no encontrado"
html = html.replace(OLD_SUBBAR, NEW_TOTALSTRIP)

# ---------------------------------------------------------------------------
# 4. IDs de anclaje A/B/C/D + condiciones
# ---------------------------------------------------------------------------
anchor_fixes = [
    ('<h3 class="blk"><span class="bn">A</span> Gestión de dispositivos móviles — control total</h3>',
     '<h3 class="blk" id="bloque-a"><span class="bn">A</span> Gestión de dispositivos móviles — control total</h3>\n'
     '    <div class="stepcard"><div class="stepcard-ic">💡</div><div><span class="stepcard-tag">En simple</span>'
     '<p>Tus ~80 celulares no se van a poder apagar ni perder el GPS, y vas a ver la posición de cada uno en tiempo real — con respaldo por SMS si se corta la señal.</p></div></div>'),
    ('<h3 class="blk"><span class="bn">B</span> Servidor local e infraestructura</h3>',
     '<h3 class="blk" id="bloque-b"><span class="bn">B</span> Servidor local e infraestructura</h3>\n'
     '    <div class="stepcard"><div class="stepcard-ic">💡</div><div><span class="stepcard-tag">En simple</span>'
     '<p>Reemplazamos la PC de escritorio sin protección por un servidor propio y dedicado en tu local, separado y protegido.</p></div></div>'),
    ('<h3 class="blk"><span class="bn">C</span> Auditoría, remediación y monitoreo de seguridad</h3>',
     '<h3 class="blk" id="bloque-c"><span class="bn">C</span> Auditoría, remediación y monitoreo de seguridad</h3>\n'
     '    <div class="stepcard"><div class="stepcard-ic">💡</div><div><span class="stepcard-tag">En simple</span>'
     '<p>Limpiamos y blindamos los ~20 equipos de oficina, y dejamos instalado el monitoreo que avisa si algo raro pasa en la red o el servidor.</p></div></div>'),
    ('<h3 class="blk"><span class="bn">D</span> Plan de soporte unificado (MDM + seguridad)</h3>',
     '<h3 class="blk" id="bloque-d"><span class="bn">D</span> Plan de soporte unificado (MDM + seguridad)</h3>\n'
     '    <div class="stepcard"><div class="stepcard-ic">💡</div><div><span class="stepcard-tag">En simple</span>'
     '<p>Un solo plan de soporte cubre tanto la app de rastreo como la seguridad de los equipos — no se paga por dos servicios separados.</p></div></div>'),
    ('<details class="condstrip">', '<details class="condstrip" id="condiciones">'),
]
for old, new in anchor_fixes:
    assert old in html, f"anchor fix no encontrado: {old[:60]}"
    html = html.replace(old, new)

# ---------------------------------------------------------------------------
# 5. Nota de auditoría más visible
# ---------------------------------------------------------------------------
OLD_AUDNOTE = '<div class="note info"><span class="nt">Cómo sigue después del informe</span>AUD-A cubre exclusivamente el hardening de endpoints, sin inventario de red ni informe de recomendaciones. AUD-B y AUD-C sí entregan informe con hallazgos y <b>recomendaciones priorizadas</b>, con remediación de los hallazgos estándar incluida (parches, cuentas, configuración, malware conocido). Hallazgos que requieran reemplazo de hardware, licencias de software específicas, recuperación de datos u otra intervención mayor se presupuestan por separado, según lo detectado.</div>'
NEW_AUDNOTE = '<div class="note warn"><span class="nt">Importante — el relevamiento puede sumar costos</span>AUD-A cubre exclusivamente el hardening de endpoints, sin inventario de red ni informe de recomendaciones. AUD-B y AUD-C sí entregan informe con hallazgos y <b>recomendaciones priorizadas</b>, con remediación de los hallazgos estándar incluida (parches, cuentas, configuración, malware conocido). <b>Hallazgos que requieran reemplazo de hardware, licencias de software específicas, recuperación de datos u otra intervención mayor no están incluidos en este precio</b> y se presupuestan por separado, una vez detectados durante la auditoría en sitio.</div>'
assert OLD_AUDNOTE in html, "nota de auditoría no encontrada"
html = html.replace(OLD_AUDNOTE, NEW_AUDNOTE)

# ---------------------------------------------------------------------------
# 6. Colapsar contenido técnico pesado bajo "Ver detalle técnico"
# ---------------------------------------------------------------------------
html = wrap_details(
    html,
    '<h4 style="font-size:13px;color:#0d1f3c;font-weight:700;margin:18px 0 11px">Arquitectura de la solución</h4>',
    '<h4 style="font-size:13px;color:#0d1f3c;font-weight:700;margin:20px 0 11px">Opciones de plataforma MDM</h4>',
    'Ver detalle técnico — arquitectura, catálogo de ítems y comparativa'
)
html = wrap_details(
    html,
    '<h4 style="font-size:13px;color:#0d1f3c;font-weight:700;margin:18px 0 11px">Metodología de auditoría</h4>',
    '<h4 style="font-size:13px;color:#0d1f3c;font-weight:700;margin:20px 0 11px">Opciones de auditoría y remediación</h4>',
    'Ver detalle técnico — metodología, monitoreo y alcance por nivel'
)
e_start = html.index('<h3 class="blk"><span class="bn">E</span>')
e_bannerpos = html.index('<div class="scale-banner">', e_start)
e_chunk = html[e_start:e_bannerpos]
e_wrapped = ('<details class="techdetail"><summary>Ver detalle: incorporación posterior de dispositivos (onboarding)</summary>'
             f'<div class="techdetail-body">{e_chunk}</div></details>\n    ')
html = html[:e_start] + e_wrapped + html[e_bannerpos:]

# ---------------------------------------------------------------------------
# 7. Panel-head minimal (sin repetir el título del hero, sin "PROPUESTA 1")
# ---------------------------------------------------------------------------
OLD_PANELHEAD = '<div class="panel">\n  <div class="panel-head"><div class="ph-ic">🛡️</div><span class="num">PROPUESTA 1</span><h2>Plataforma de gestión móvil y seguridad informática</h2><span class="tag tag-main">Prioridad inmediata</span></div>'
NEW_PANELHEAD = '<div class="panel" id="resumen">\n  <div class="panel-head slim"><h2>Configurá tu propuesta</h2></div>'
assert OLD_PANELHEAD in html, "panel-head no encontrado"
html = html.replace(OLD_PANELHEAD, NEW_PANELHEAD)

# ---------------------------------------------------------------------------
# 8. Cortar panel-body en pasos de wizard (A / B / C / D + intro)
# ---------------------------------------------------------------------------
marker = '<div class="panel-body">'
idx = html.index(marker)
content_start = idx + len(marker)
content_end = find_matching_close(html, content_start)
panel_body_inner = html[content_start:content_end]

parts = re.split(r'(?=<h3 class="blk" id="bloque-[abcd]">)', panel_body_inner)
assert len(parts) == 5, f"se esperaban 5 partes (intro+A+B+C+D), hubo {len(parts)}"
intro, blk_a, blk_b, blk_c, blk_d = parts

FINAL_STEP_HTML = """
<div class="finalsum">
  <h3 class="finalsum-h">Tu selección</h3>
  <p class="finalsum-sub">Así queda armada la propuesta con las opciones elegidas. Podés volver atrás para cambiar cualquier bloque, o desplegar "ver todas las opciones" para comparar antes de decidir.</p>
  <div class="finalsum-total">
    <div class="ft-amt" id="fs-total">$0</div>
    <div class="ft-sub">Año 1 (estimativo, IVA incluido) · Recurrente anual: <span id="fs-recur">$0</span></div>
  </div>
  <div class="finalsum-items" id="fs-items"></div>
  <div class="finalsum-alt-h">Otras opciones disponibles por bloque</div>
  <div class="finalsum-alt" id="fs-alt"></div>
  <div class="finalsum-actions">
    <button class="abtn abtn-consulta" onclick="openModal('consulta')">💬 Hacer una consulta</button>
    <button class="abtn abtn-pdf" onclick="downloadSelection()">⬇️ Descargar presupuesto (PDF)</button>
    <button class="abtn abtn-reject" onclick="openModal('reject')">✕ Rechazar</button>
    <button class="abtn abtn-accept" onclick="openModal('accept')">✓ Aceptar propuesta</button>
  </div>
</div>
"""

WIZARD_HTML = f"""<div class="wizard" id="wizard">
  <div class="wizard-progress">
    <div class="wp-track"><div class="wp-fill" id="wp-fill"></div></div>
    <div class="wp-label"><span id="wp-current">Paso 1</span> de 6 · <span id="wp-title">Resumen ejecutivo</span></div>
  </div>
  <div class="wizard-viewport">
    <section class="wstep active" data-step="0">{intro}</section>
    <section class="wstep" data-step="1">{blk_a}</section>
    <section class="wstep" data-step="2">{blk_b}</section>
    <section class="wstep" data-step="3">{blk_c}</section>
    <section class="wstep" data-step="4">{blk_d}</section>
    <section class="wstep" data-step="5">{FINAL_STEP_HTML}</section>
  </div>
  <div class="wizard-nav">
    <button class="wnav-btn wnav-back" id="wnav-back" onclick="wizardPrev()">← Atrás</button>
    <div class="wnav-dots" id="wnav-dots"></div>
    <button class="wnav-btn wnav-next" id="wnav-next" onclick="wizardNext()">Siguiente →</button>
  </div>
</div>"""

new_panel_body = marker + WIZARD_HTML + '</div>'
html = html[:idx] + new_panel_body + html[content_end + len('</div>'):]

# ---------------------------------------------------------------------------
# 9. HERO + ABOUT
# ---------------------------------------------------------------------------
HERO_HTML = """
<div class="hero" id="portada">
  <div class="wrap">
    <div class="heroeyebrow">📄 Propuesta técnica y económica · Ref. AT-2026-0630-P</div>
    <h1>Plataforma de gestión móvil y seguridad informática para Araucanos S.A.</h1>
    <p class="herosub">Control total de la flota móvil, servidor local dedicado, auditoría del parque informático y un plan de soporte unificado. Recorré cada bloque paso a paso, elegí la opción que mejor se ajuste y llegá a un resumen con tu configuración.</p>
    <div class="heroletter">
      <p><b>Estimados Araucanos S.A.,</b></p>
      <p>Les presentamos esta propuesta a partir del relevamiento de su operación: la necesidad de controlar y rastrear la flota de aproximadamente 80 dispositivos Samsung, y de proteger un parque informático de unos 20 equipos que ya registró incidentes de intrusión y software malicioso.</p>
      <p>Priorizamos una arquitectura <b>local y de código abierto</b>: la plataforma de gestión móvil, el servidor y el monitoreo de seguridad operan dentro de su propia infraestructura, sin licenciamiento perpetuo por dispositivo y sin depender de un proveedor externo para seguir operando.</p>
      <p>Esta propuesta es interactiva: avancen paso a paso por cada bloque, comparen opciones, vean el desglose de costos en tiempo real y, al final, acéptenla, recházenla o déjennos una consulta directamente desde esta página.</p>
      <div class="herosign">Equipo Alystech<span>Soluciones en Software y Seguridad Informática</span></div>
    </div>
    <div class="herometa">
      <div>Cliente<b>Araucanos S.A.</b></div>
      <div>Rubro<b>Servicios de seguridad</b></div>
      <div>Validez de la propuesta<b>30 días</b></div>
      <div>Referencia<b>AT-2026-0630-P · Rev. 6</b></div>
    </div>
    <div class="herocta">
      <a href="#wizard" class="btn btn-primary">Empezar a configurar mi plan →</a>
      <a href="#proximos-pasos" class="btn btn-ghost">Cómo sigue el proceso</a>
    </div>
  </div>
</div>

<div class="about">
  <div class="wrap">
    <div class="abouthead">
      <div class="kicker">Quiénes somos</div>
      <h2>Cómo trabajamos en Alystech</h2>
      <p class="aboutlead">Diseñamos e implementamos infraestructura de seguridad y gestión de dispositivos priorizando soluciones auditables, alojadas en la infraestructura del cliente y sin dependencia de licenciamiento externo cuando existe una alternativa de código abierto igual de sólida.</p>
    </div>
    <div class="benefit-grid">
      <div class="benefit"><div class="bicon">🧩</div><h5>Infraestructura local primero</h5><p>Servidor, consola y monitoreo alojados en el sitio del cliente. Los datos no salen de la empresa.</p></div>
      <div class="benefit"><div class="bicon">🔓</div><h5>Código abierto donde tiene sentido</h5><p>Evitamos licenciamiento perpetuo por dispositivo cuando el código abierto cubre el mismo requisito.</p></div>
      <div class="benefit"><div class="bicon">🧾</div><h5>Costos desglosados</h5><p>Cada opción muestra su desglose real: hardware, desarrollo, licencias y recurrente, sin cifras cerradas.</p></div>
      <div class="benefit"><div class="bicon">📈</div><h5>Pensado para escalar</h5><p>Las soluciones crecen en dispositivos, cobertura o soporte sin rehacer lo ya implementado.</p></div>
    </div>

    <h3 class="subkicker">Cómo se paga y qué puede variar</h3>
    <div class="pay-grid">
      <div class="paycard"><div class="pcicon">💳</div><h5>Desarrollo e implementación</h5><p>Se paga en 3 partes: <b>50%</b> al aceptar, <b>25%</b> al iniciar la implementación y <b>25%</b> a la entrega. Aplica solo al costo de desarrollo/implementación.</p></div>
      <div class="paycard"><div class="pcicon">📦</div><h5>Equipos y hardware</h5><p>Van <b>por separado</b>, a cargo del <b>cliente</b>: no forman parte del 50/25/25. Alystech puede intermediar la compra si lo prefieren.</p></div>
      <div class="paycard"><div class="pcicon">🔍</div><h5>El relevamiento puede sumar costos</h5><p>La visita inicial y la auditoría en sitio pueden revelar hallazgos fuera de este alcance. Si aparecen, se cotizan aparte antes de ejecutarlos.</p></div>
    </div>
  </div>
</div>
"""

html = html.replace('<body>\n<div class="masthead">', '<body>\n' + HERO_HTML + '\n<div class="masthead">')
# el marcador de arriba ya no existe (masthead fue reemplazado); insertar directo tras <body>
if '<body>\n' + HERO_HTML not in html:
    html = html.replace('<body>', '<body>\n' + HERO_HTML, 1)

# ---------------------------------------------------------------------------
# 10. PRÓXIMOS PASOS
# ---------------------------------------------------------------------------
NEXTSTEPS_HTML = """
<div class="nextsteps" id="proximos-pasos">
  <div class="wrap">
    <div class="panel">
      <div class="panel-head"><div class="ph-ic">🗺️</div><h2>Próximos pasos</h2></div>
      <div class="panel-body">
        <p class="para">Así continúa el proceso una vez definida la configuración y aceptada la propuesta.</p>
        <div class="tl">
          <div class="tl-item"><div class="tl-week">Paso 1</div><div class="tl-txt"><b>Aceptación de la propuesta.</b> Confirman la configuración elegida desde esta misma página (botón «Aceptar propuesta»).</div></div>
          <div class="tl-item"><div class="tl-week">Paso 2</div><div class="tl-txt"><b>Pago inicial (50% del desarrollo)</b> y agenda de la visita de relevamiento en sitio. Esta visita puede detectar hallazgos fuera del alcance cotizado (hardware, licencias puntuales, cableado); de aparecer, se presupuestan aparte antes de ejecutarlos.</div></div>
          <div class="tl-item"><div class="tl-week">Paso 3</div><div class="tl-txt"><b>Implementación.</b> Servidor, MDM, red y auditoría según lo seleccionado. Pago del 25% (desarrollo) al llegar a esta fase. Los equipos se facturan aparte, a cargo del cliente.</div></div>
          <div class="tl-item"><div class="tl-week">Paso 4</div><div class="tl-txt"><b>Pruebas, capacitación y entrega.</b> Verificación de rastreo, respaldo por SMS y documentación entregada. Pago final del 25% (desarrollo).</div></div>
          <div class="tl-item fut"><div class="tl-week">Continuo</div><div class="tl-txt"><b>Soporte y monitoreo</b> según el plan unificado contratado, con reportes periódicos.</div></div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

html = html.replace('<div class="terms">', NEXTSTEPS_HTML + '\n<div class="terms">')

# FIX: .terms y <footer> quedaban fuera de .wrap y se veian pegados al borde
# en pantallas anchas. Los envolvemos para que respeten el mismo ancho/centrado
# que el resto de la pagina.
OLD_TERMS_FOOTER = html[html.index('<div class="terms">'):html.index('</footer>') + len('</footer>')]
assert '<div class="terms">' in OLD_TERMS_FOOTER and '</footer>' in OLD_TERMS_FOOTER
NEW_TERMS_FOOTER = '<div class="wrap">\n' + OLD_TERMS_FOOTER + '\n</div>'
html = html.replace(OLD_TERMS_FOOTER, NEW_TERMS_FOOTER)


# ---------------------------------------------------------------------------
# 11. ACTION BAR + MODALES + JS DEL WIZARD
# ---------------------------------------------------------------------------
ACTION_HTML = """
<div class="action-bar">
  <div class="wrap">
    <div class="ab-msg">Total actual: <b id="ab-total">$0</b></div>
    <div class="ab-btns">
      <button class="abtn abtn-consulta" onclick="openModal('consulta')">💬 Consulta</button>
      <button class="abtn abtn-pdf" onclick="downloadSelection()">⬇️ PDF</button>
      <button class="abtn abtn-reject" onclick="openModal('reject')">✕ Rechazar</button>
      <button class="abtn abtn-accept" onclick="openModal('accept')">✓ Aceptar</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-decision">
  <div class="modal">
    <div class="modal-h"><h3 id="md-title">Aceptar propuesta</h3><button class="mclose" onclick="closeModal('decision')">×</button></div>
    <div class="modal-b" id="md-body">
      <p class="mhint" id="md-hint">Confirmá tus datos de contacto. Vamos a registrar la configuración exactamente como quedó seleccionada en esta página.</p>
      <div class="modal-summary"><b>Resumen de tu selección</b><span id="md-summary">—</span></div>
      <div class="field"><label>Nombre y apellido</label><input type="text" id="md-name" placeholder="Nombre de quien confirma"></div>
      <div class="field"><label>Email</label><input type="email" id="md-email" placeholder="tu@empresa.com"></div>
      <div class="field"><label>Teléfono (opcional)</label><input type="text" id="md-phone" placeholder="+595..."></div>
      <div class="field"><label>Comentarios (opcional)</label><textarea id="md-comments" placeholder="Alguna aclaración sobre la decisión..."></textarea></div>
    </div>
    <div class="modal-foot">
      <button class="mbtn mbtn-cancel" onclick="closeModal('decision')">Cancelar</button>
      <button class="mbtn mbtn-submit" id="md-submit" onclick="submitDecision()">Confirmar</button>
    </div>
    <div class="modal-ok" id="md-ok">
      <div class="mo-ic">✅</div>
      <h4>¡Listo, gracias!</h4>
      <p>Registramos tu respuesta. El equipo de Alystech se va a contactar a la brevedad.</p>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-consulta">
  <div class="modal">
    <div class="modal-h"><h3>Hacer una consulta</h3><button class="mclose" onclick="closeModal('consulta')">×</button></div>
    <div class="modal-b">
      <p class="mhint">¿Tenés dudas sobre alguna opción, precio o plazo? Escribinos y te respondemos por email.</p>
      <div class="field"><label>Nombre y apellido</label><input type="text" id="cq-name"></div>
      <div class="field"><label>Email</label><input type="email" id="cq-email"></div>
      <div class="field"><label>Teléfono (opcional)</label><input type="text" id="cq-phone"></div>
      <div class="field"><label>Tu consulta</label><textarea id="cq-message" placeholder="Escribí tu pregunta acá..."></textarea></div>
    </div>
    <div class="modal-foot">
      <button class="mbtn mbtn-cancel" onclick="closeModal('consulta')">Cancelar</button>
      <button class="mbtn mbtn-submit" onclick="submitConsulta()">Enviar consulta</button>
    </div>
    <div class="modal-ok" id="cq-ok">
      <div class="mo-ic">💬</div>
      <h4>¡Consulta enviada!</h4>
      <p>Te respondemos a la brevedad al email que dejaste.</p>
    </div>
  </div>
</div>

<script>
const PROPOSAL_ID = "__PROPOSAL_ID__";
const PROPOSAL_GROUPS = ['mdm','srv','net','aud','sup'];
const GROUP_LABELS = {mdm:'A · Plataforma móvil', srv:'B · Servidor', net:'B · Red', aud:'C · Auditoría', sup:'D · Soporte'};

function getSelections(){
  const out = [];
  PROPOSAL_GROUPS.forEach(g => {
    const grp = document.querySelector(`.options[data-group="${g}"]`);
    if(!grp) return;
    const s = grp.querySelector('.opt.sel');
    if(!s) return;
    const code = s.querySelector('.opt-code') ? s.querySelector('.opt-code').textContent : g;
    const name = s.querySelector('.opt-name') ? s.querySelector('.opt-name').textContent : s.dataset.id;
    out.push({ group:g, code, name, price:'$'+(+s.dataset.price).toLocaleString('en-US'), id:s.dataset.id });
  });
  return out;
}
function getTotals(){
  const amt = document.getElementById('p1-amt');
  const recur = document.getElementById('p1-recur');
  return { total: amt ? amt.textContent : '$0', recurrent: recur ? recur.textContent : '$0' };
}
function refreshActionBarTotal(){
  const el = document.getElementById('ab-total');
  if(el){ const t = getTotals(); el.textContent = t.total; }
}
const _origRecalc = window.recalc;
if(typeof _origRecalc === 'function'){
  window.recalc = function(){ _origRecalc(); refreshActionBarTotal(); if(wizardStep === 5) renderFinalSummary(); };
}
document.addEventListener('DOMContentLoaded', refreshActionBarTotal);

function summaryText(){
  const sels = getSelections();
  const t = getTotals();
  const lines = sels.map(s => `${s.code} — ${s.name} (${s.price})`);
  return lines.join(' · ') + ` · Total: ${t.total} (recurrente: ${t.recurrent}/año)`;
}

function openModal(kind){
  if(kind === 'consulta'){
    document.getElementById('modal-consulta').classList.add('open');
    return;
  }
  const title = document.getElementById('md-title');
  const hint = document.getElementById('md-hint');
  const submit = document.getElementById('md-submit');
  const body = document.getElementById('md-body');
  const ok = document.getElementById('md-ok');
  body.style.display = 'block';
  document.querySelector('#modal-decision .modal-foot').style.display = 'flex';
  ok.style.display = 'none';
  document.getElementById('modal-decision').dataset.kind = kind;
  if(kind === 'accept'){
    title.textContent = 'Aceptar propuesta';
    hint.textContent = 'Confirmá tus datos de contacto. Vamos a registrar la configuración exactamente como quedó seleccionada en esta página.';
    submit.textContent = 'Confirmar aceptación';
    submit.className = 'mbtn mbtn-submit accept';
  } else {
    title.textContent = 'Rechazar propuesta';
    hint.textContent = 'Contanos brevemente el motivo (opcional). Nos ayuda a ajustar futuras propuestas.';
    submit.textContent = 'Confirmar rechazo';
    submit.className = 'mbtn mbtn-submit reject';
  }
  document.getElementById('md-summary').textContent = summaryText();
  document.getElementById('modal-decision').classList.add('open');
}
function closeModal(which){
  document.getElementById('modal-' + which).classList.remove('open');
}

async function submitDecision(){
  const kind = document.getElementById('modal-decision').dataset.kind;
  const clientName = document.getElementById('md-name').value.trim();
  const clientEmail = document.getElementById('md-email').value.trim();
  const clientPhone = document.getElementById('md-phone').value.trim();
  const comments = document.getElementById('md-comments').value.trim();
  if(!clientName || !clientEmail){ alert('Completá nombre y email para continuar.'); return; }
  const payload = {
    proposalId: PROPOSAL_ID,
    decision: kind === 'accept' ? 'accept' : 'reject',
    clientName, clientEmail, clientPhone, comments,
    selections: getSelections(),
    totals: getTotals()
  };
  try{
    const r = await fetch('/api/decision', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(!r.ok) throw new Error('request failed');
    document.getElementById('md-body').style.display = 'none';
    document.querySelector('#modal-decision .modal-foot').style.display = 'none';
    document.getElementById('md-ok').style.display = 'block';
  }catch(e){
    alert('No pudimos enviar tu respuesta. Probá de nuevo en un momento.');
  }
}

async function submitConsulta(){
  const name = document.getElementById('cq-name').value.trim();
  const email = document.getElementById('cq-email').value.trim();
  const phone = document.getElementById('cq-phone').value.trim();
  const message = document.getElementById('cq-message').value.trim();
  if(!name || !email || !message){ alert('Completá nombre, email y tu consulta.'); return; }
  const payload = { proposalId: PROPOSAL_ID, name, email, phone, message };
  try{
    const r = await fetch('/api/consulta', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(!r.ok) throw new Error('request failed');
    document.querySelector('#modal-consulta .modal-b').style.display = 'none';
    document.querySelector('#modal-consulta .modal-foot').style.display = 'none';
    document.getElementById('cq-ok').style.display = 'block';
  }catch(e){
    alert('No pudimos enviar tu consulta. Probá de nuevo en un momento.');
  }
}

async function downloadSelection(){
  const payload = { proposalId: PROPOSAL_ID, selections: getSelections(), totals: getTotals() };
  try{
    const r = await fetch('/api/pdf', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(!r.ok) throw new Error('pdf failed');
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Alystech-Presupuesto-Araucanos.pdf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }catch(e){
    alert('No pudimos generar el PDF. Probá de nuevo en un momento.');
  }
}

document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if(e.target === ov) ov.classList.remove('open'); });
});

/* ============== WIZARD ============== */
const WIZARD_LABELS = ["Resumen ejecutivo","A · Plataforma móvil","B · Servidor y red","C · Auditoría y monitoreo","D · Soporte unificado","Tu selección"];
let wizardStep = 0;

function renderWizard(){
  document.querySelectorAll('.wstep').forEach((el) => {
    el.classList.toggle('active', parseInt(el.dataset.step,10) === wizardStep);
  });
  document.getElementById('wp-fill').style.width = (wizardStep/(WIZARD_LABELS.length-1)*100)+'%';
  document.getElementById('wp-current').textContent = 'Paso ' + (wizardStep+1);
  document.getElementById('wp-title').textContent = WIZARD_LABELS[wizardStep];
  document.getElementById('wnav-back').style.visibility = wizardStep===0 ? 'hidden' : 'visible';
  document.getElementById('wnav-next').style.display = wizardStep===WIZARD_LABELS.length-1 ? 'none' : 'inline-flex';
  document.querySelectorAll('.wnav-dots span').forEach((d,i)=> d.classList.toggle('on', i===wizardStep));
  document.querySelectorAll('.quicknav a[data-step]').forEach((a)=>{
    a.classList.toggle('active', parseInt(a.dataset.step,10) === wizardStep);
  });
  if(wizardStep === WIZARD_LABELS.length-1) renderFinalSummary();
}
function wizardNext(){ if(wizardStep < WIZARD_LABELS.length-1){ wizardStep++; renderWizard(); scrollToWizard(); } }
function wizardPrev(){ if(wizardStep > 0){ wizardStep--; renderWizard(); scrollToWizard(); } }
function goToStep(n){ wizardStep = n; renderWizard(); scrollToWizard(); }
function scrollToWizard(){ const w = document.getElementById('wizard'); if(w) w.scrollIntoView({behavior:'smooth', block:'start'}); }

function renderFinalSummary(){
  const sels = getSelections();
  const t = getTotals();
  document.getElementById('fs-total').textContent = t.total;
  document.getElementById('fs-recur').textContent = t.recurrent;
  document.getElementById('fs-items').innerHTML = sels.map(s => `
    <div class="fs-item"><span class="fs-item-g">${GROUP_LABELS[s.group]||s.group}</span><span class="fs-item-n">${s.code} — ${s.name}</span><span class="fs-item-p">${s.price}</span></div>
  `).join('');
  document.getElementById('fs-alt').innerHTML = PROPOSAL_GROUPS.map(g => {
    const grp = document.querySelector(`.options[data-group="${g}"]`);
    if(!grp) return '';
    const opts = Array.from(grp.querySelectorAll('.opt')).map(o => {
      const name = o.querySelector('.opt-name') ? o.querySelector('.opt-name').textContent : o.dataset.id;
      const code = o.querySelector('.opt-code') ? o.querySelector('.opt-code').textContent : '';
      const price = '$'+(+o.dataset.price).toLocaleString('en-US');
      const sel = o.classList.contains('sel');
      return `<div class="fs-alt-opt ${sel?'chosen':''}"><span>${sel?'✓ ':''}${code} — ${name}</span><b>${price}</b></div>`;
    }).join('');
    return `<details class="fs-alt-block"><summary>${GROUP_LABELS[g]||g} — ver todas las opciones</summary><div class="fs-alt-list">${opts}</div></details>`;
  }).join('');
}

(function initWizard(){
  const dotsWrap = document.getElementById('wnav-dots');
  WIZARD_LABELS.forEach((_, i) => {
    const d = document.createElement('span');
    d.addEventListener('click', () => goToStep(i));
    dotsWrap.appendChild(d);
  });
  document.querySelectorAll('.quicknav a[data-step]').forEach(a=>{
    a.addEventListener('click', e=>{ e.preventDefault(); goToStep(parseInt(a.dataset.step,10)); });
  });
  const HASH_MAP = {'#bloque-a':1,'#bloque-b':2,'#bloque-c':3,'#bloque-d':4,'#wizard':0};
  if(HASH_MAP[location.hash] !== undefined) wizardStep = HASH_MAP[location.hash];
  renderWizard();
})();

/* Scrollspy para los anclajes que quedan fuera del wizard */
(function(){
  const links = Array.from(document.querySelectorAll('.quicknav a:not([data-step])'));
  if(!links.length) return;
  const targets = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        const id = '#' + en.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  targets.forEach(t => obs.observe(t));
})();
</script>
""".replace("__PROPOSAL_ID__", PROPOSAL_ID)

html = html.replace('</body>', ACTION_HTML + '\n</body>')

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)

print("OK ->", OUT, len(html), "bytes")
