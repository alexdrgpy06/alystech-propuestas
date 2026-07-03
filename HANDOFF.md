# Handoff Document - AlysTech Precision Visual Redesign

## Project Overview
**Project**: Araucanos Proposal Wizard - Visual Redesign to "Alystech Precision" Design System
**Stack**: React 19 + TypeScript + Vite 7 + Tailwind v4 + Framer Motion (`framer-motion` v12.42.2)
**Status**: Build/typecheck/lint/tests all green. Visual redesign matches the latest Stitch reference (floating-pill header/footer). Deploy is gated on explicit user go-ahead — **not yet pushed**.

---

## ✅ COMPLETED

### Design system & primitives (Phases 1-2)
- `frontend/src/index.css` `@theme` — full DESIGN.md token set (typography scale, colors, spacing, radii), plus Material Symbols Outlined font import (was missing — every icon rendered as literal text like `arrow_back` until fixed).
- `GlassPanel`, `RadioCard`, `ProgressTrack`, `ActionButton` (Primary/Secondary/Ghost/Danger) in `frontend/src/components/ui/`.

### Layout shell (Phase 3, restructured)
- `Shell.tsx`, `WizardHeader.tsx`, `WizardFooter.tsx` in `frontend/src/components/layout/`.
- **Restructured to match the latest Stitch reference** (`stitch_alystech_responsive_wizard_system (1)/code.html`, provided 2026-07-03): header and footer are now **floating pills** (`fixed top-4/bottom-6 left-4 right-4`, `rounded-2xl`, `shadow-lg`) on all breakpoints, not full-width bars that only floated on desktop.
- Footer is now dark (`bg-inverse-surface`) and shows the running "Inversión Año 1" total merged with Back/Continue — hidden on the welcome step and the Canvas step (which has its own detailed breakdown).

### Wizard steps (Phase 4)
- `IntroStep`, `DiagnosticStep`, `OptionsStep` (steps 0, odd 1-9, even 2-10).
- `OptionsStep`/`RadioCard`: cards show a "Desde $X" price (label above amount) with "Ver detalles" as a filled soft-blue pill button (was a plain ghost text link); icon badge background now reacts to `selected` state (was static per group regardless of selection — a real bug, cards always showed the same icon color whether chosen or not).

### Data & addons (Phase 5, from `docs/spec-redesign-addons.md`)
- Core/addon model complete: `AddonItem`, `computeTotals` with addon support, `AddonMenu` inside `CostBreakdownModal`, "Desde $X" pricing. Addons trace 1:1 to existing `costBreakdown` amounts across all 5 blocks (MDM, Servidor, Red, Auditoría; Soporte via onboarding-by-volume selector).
- **Addon line items now flow into the PDF and `/api/decision` payload** (`lib/api.ts` `buildSelectionSummaries` + `server.js` `/api/pdf`) — previously the generated PDF silently omitted any addon the client selected. New tests in `frontend/src/lib/api.test.ts`.

### Advanced steps (Phase 6)
- `TcoComparisonStep` — fixed a real data bug: the "Servidor" regional-comparison card was silently overridden in JSX with fabricated numbers ("$3.200/año" virtualization licensing) that don't exist anywhere in `data/groups/srv.ts`, contradicting the real hardware-cost comparison data. Removed the override. Also fixed module titles being mangled by a naive string-split (`"Gestión y Blindaje de la Flota..."` → just `"Gestión"`) — now shows the full title.
- `CanvasStep` — "Rechazar"/"Solicitar consulta" were fully wired in `App.tsx` (props passed) but never rendered as buttons on this step, only Accept/PDF showed. Added them back as secondary actions.

### Modals (Phase 7)
- `CostBreakdownModal`, `FeatureComparisonModal` rebuilt on `GlassPanel`.
- **`Modal.tsx` (shared wrapper for `DecisionModal`/`ConsultaModal` — Accept/Reject/Consulta forms) was still on the old pre-redesign visual language** (`text-[12px]`, `text-navy`, `border-line`, raw unstyled `<button>`/`<input>`) while everything else had been redesigned — this was the most conversion-critical part of the app and looked like a bolted-on older product. Restyled all three files onto the current GlassPanel/ActionButton system.

### Cross-cutting fixes this session
- **Deploy-blocking dependency bug**: most components imported `motion/react`, but `frontend/package.json` only declared `framer-motion` — locally it accidentally resolved via a stray `motion` package installed at the repo root (not present in the isolated Docker build stage, which only copies `frontend/`). Standardized every import on `framer-motion` (the properly declared dependency). This would have broken the Coolify/Docker build despite working locally.
- A latent Framer Motion + TypeScript `onDrag` prop conflict surfaced once the above was fixed (structural collision between spread `HTMLAttributes`/`ButtonHTMLAttributes` and Framer Motion's own gesture-callback override) — resolved with a scoped `Omit` on `GlassPanel`, `RadioCard`, `ActionButton`.
- `frontend/src/index.css`: `.progress-segment` was `height: 2px` when the reference specifies `h-2` (8px) — the wizard progress bar in the header was nearly invisible.
- Both detail modals (`CostBreakdownModal`, `FeatureComparisonModal`) and the shared `Modal.tsx` had the same z-index bug: overlay and the fixed `WizardFooter` both used `z-50`, and DOM order made the footer paint on top, letting it visually bleed through the dialog. Bumped modals to `z-[100]`.
- `bg-bg` (used in `About.tsx`/`NextSteps.tsx`, since deleted) resolved to near-black — dark navy text on it was invisible. `text-blue-light`/`text-slate-light` were referenced across 3 files but never defined anywhere in `index.css` — silently produced no styling.
- Framer Motion's `useReducedMotion`/`MotionConfig` was never used despite extensive `motion.*` animations throughout — the CSS-level `prefers-reduced-motion` override only affects CSS transitions, not Framer Motion's JS-driven transforms. Wired `<MotionConfig reducedMotion="user">` globally in `main.tsx`.
- `frontend/public/logo.png` (the real AlysTech mark) existed but was never referenced anywhere — header showed plain text only. Wired in as a cropped icon badge in the header and the intro screen (moved to a dark navy background there — the logo's wordmark is pale gray/low-contrast on light backgrounds).
- **12 confirmed-dead component files removed** (zero imports anywhere, verified via grep + the `layout/index.ts` barrel): `OptionCard.tsx`, `GroupSection.tsx`, `OptionDetailModal.tsx`, `GroupDetailModal.tsx`, `ComparisonMatrixTable.tsx`, and 7 unused pre-wizard-refactor layout components (`Hero.tsx`, `About.tsx`, `ConditionsAccordion.tsx`, `NextSteps.tsx`, `TermsFooter.tsx`, `ActionBar.tsx`, `StickyTotalBar.tsx` — leftover from the original single-page layout, fully superseded by the wizard + floating-pill Shell/WizardFooter, which now shows the running total itself).
- Pinned `vite` to `7.3.6` (stable Rollup-based) — the `^8.1.1` version resolved to `8.1.3`/rolldown-vite, which has a confirmed upstream regression (vitejs/vite#22835, "resolver broken since 8.1.0", filed 2026-07-02, unpatched) that broke the production build entirely.

---

## 📁 Typography scale cleanup (`docs/spec-redesign-addons.md` Success Criteria #5)

Remaining `text-[Npx]` arbitrary sizes replaced with the typography scale across `layout/` (`About`, `ActionBar`, `ConditionsAccordion`, `Hero`, `NextSteps`, `StickyTotalBar`, `TermsFooter` — since deleted as dead code, see above), `detail-modal/`, and `CanvasStep.tsx`. Every remaining `text-[Npx]` match in the codebase is on a `material-symbols-outlined` icon glyph span (legitimate — icons need explicit pixel sizing, this is not a typography-scale violation).

---

## ⚠️ NOT YET DONE / EXPLICITLY GATED

These are **not oversights** — they're gated behind explicit user approval per `docs/spec-redesign-addons.md`'s own "Preguntar primero" boundary (pricing/commercial-figure changes require sign-off, never silent):

1. **Hourly-rate audit + regional pricing update** — investigation already done and presented in a prior session ("Estado al 2026-07-02" in `docs/spec-redesign-addons.md`), **not applied to `data/groups/*.ts`/`terms.ts` yet** — needs your explicit approval on the exchange-rate (6.250→~6.100 Gs) and MDM SaaS regional comparison figures before writing.
2. **Minimum development investment** — still a fixed string in `conditions.ts`, not yet derived dynamically from audited core prices — same approval gate.
3. **Support (D) addon** — onboarding-by-volume selector ($24/$19/$14 per device) not yet built.

## 🚀 Deploy

Local verification is fully green (`npm run typecheck`, `npm run test` — 55/55, `npm run lint`, `npm run build`). Per `docs/spec-redesign-addons.md`'s "Despliegue" section and this session's explicit confirmation from the user, **no `git push` happens until requested** — Coolify builds automatically from `origin` via the existing multi-stage `Dockerfile` once pushed.

---

## 🔗 REFERENCE IMPLEMENTATIONS

- `stitch_alystech_responsive_wizard_system/alystech_precision/DESIGN.md` — original design system source of truth.
- `stitch_alystech_responsive_wizard_system (1)/` (provided 2026-07-03, in Downloads, not yet copied into the repo) — **updated reference** with the floating-pill header/footer pattern, the "Desde $X" card layout, and a real screenshot (`screen.png`) of the target OptionsStep. This is the one the current Shell/WizardHeader/WizardFooter/RadioCard restructure follows.
