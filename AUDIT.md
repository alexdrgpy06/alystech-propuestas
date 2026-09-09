# AUDIT — alystech-propuestas
**Date:** 2026-09-02
**Auditor:** Jim (jim-mtju7cgh)
**Repo:** [alexdrgpy06/alystech-propuestas](https://github.com/alexdrgpy06/alystech-propuestas) (public)

---

## Business thesis

AlysTech Propuestas is an interactive proposal-builder for B2B sales (security/IT consulting). Prospects walk through a wizard (mobile platform, server, network, audit, support modules), see pricing live, accept/reject, and the server emails both prospect and sales with a styled HTML summary + PDF attachment. Live at `https://presupuestos.alystechpy.online` per the landings site.

## Tech stack

- **Express 4.19.2** + **Node.js >=18**
- **PDFKit 0.15.0** (PDF generation)
- **Nodemailer 9.0.3** (email — optional, no SMTP = notifications only saved to disk)
- **Motion 12.42.2** (frontend animations)
- **TypeScript 6.0.3** (dev only — server.js is plain JS)
- **Dotenv 17.4.2**
- **Frontend**: plain HTML/CSS/JS in `public/`

## Repository structure

```
alystech-propuestas/
├── server.js              # Express app (~290 lines, single file)
├── build.py               # build helper
├── public/
│   ├── index.html, landing.html, canvas_plan_wizard (2).html
│   └── araucanos/         # static assets for one client variant
├── .agents/, .gemini/     # internal tooling
├── docs/, frontend/       # additional frontend experiments
├── stitch_alystech_responsive_wizard_system  # design reference
├── canvas_plan_wizard (2).html  # full client-side wizard
├── Dockerfile
├── HANDOFF.md, handoff_document.md, implementation_plan.md, TASK_PROGRESS.md
├── .env.example
└── package.json, package-lock.json
```

## Recent activity

Top commits on `main`:
- `c5a2923` Corrige dominio de contacto y agrega links a Suite/LoRa (#214)
- `8a52c36` Modal compartido (Aceptar/Rechazar/Consulta)
- `8e4bf1a` PR #50 — feat: ci-workflow
- `0af0d7f` Merge PR #49 — update-dependencies
- `267f1d6` Merge PR #48 — theharvester-integration

Branches: `main` only.

## Strengths

- **Working product** deployed to a public URL.
- **PDF + email** generated with consistent branding (navy/blue palette).
- **Stateless**: persists decisions + consultas to JSON files (`decisions.json`, `consultas.json`) — easy backup.
- **Single-file Express** keeps operational surface small.
- **Has Dockerfile + CI workflow**.

## Top 3 improvement opportunities

| # | Issue | Severity | Effort | Evidence |
|---|-------|----------|--------|----------|
| 1 | **`rejectUnauthorized: false`** in SMTP transporter — TLS validation disabled | L | S | `server.js:32` `tls: { rejectUnauthorized: false }` |
| 2 | **JSON files for storage** — not atomic, not concurrent-safe; risks lost writes | M | M | `server.js:35-39` `appendJson` writes via `fs.writeFileSync` |
| 3 | **No input validation on bodies** — relies on inline checks; zod/fastify-like schemas would harden it | M | S | `server.js:96-101` decision handler |

## Recommended next 3 actions

1. **Fix mTLS**: enable `rejectUnauthorized: true` once the Stalwart cert is trusted (or document the staging-only carve-out clearly with a startup warning).
2. **Move decisions/consultas to SQLite or Supabase** — single-user, but atomic writes via `fs.promises.writeFile` would be a quick fix.
3. **Add zod schemas** for `/api/decision`, `/api/consulta`, `/api/pdf` bodies — replace inline validation with one source of truth.

## Red flags

- **SMTP TLS validation disabled** (`server.js:32`) — explicit comment says self-signed Stalwart cert. Production risk.
- **JSON file persistence**: `appendJson` uses non-atomic writeFileSync — concurrent requests can lose entries.
- **TS in devDeps only**: `typescript: ^6.0.3` declared but server.js is plain JS — typecheck won't catch anything.

## Source references

- `package.json:1-25`
- `server.js:1-50` (boot + transporter)
- `server.js:96-135` (decision handler)
- `server.js:280-310` (PDF endpoint)