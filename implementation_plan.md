# Implementation Plan

## Overview

This plan details the comprehensive visual and UX redesign of the Araucanos proposal wizard to match the premium "Alystech Precision" design system defined in `stitch_alystech_responsive_wizard_system/alyestech_precision/DESIGN.md`. The redesign covers all 13 wizard steps, the Canvas summary, modals, and layout components—bringing the entire experience to a cohesive, glassmorphism-rich, Typeform-like interaction model with a dark outer shell and pristine white canvas.

The existing React 19 + TypeScript + Vite + Tailwind v4 + Framer Motion codebase is functionally complete (features: wizard navigation, 5 option groups with core/addon pricing, detail modals, Canvas summary, PDF generation). The remaining work is purely visual/UX: aligning every component to the design tokens, layouts, elevations, and motion patterns specified in the Stitch reference.

## Types

No new types required. The existing `src/types/proposal.ts` already defines all shapes all data structures (PlanOption, OptionGroupContent, AddonItem, Selection, Totals, CanvasContent, etc.). The only type-level work is ensuring components consume the design tokens from `@theme` (already defined in `src/index.css`) instead of arbitrary `text-[Npx]` values.

## Files

### New Files to Create

| Path | Purpose |
|------|---------|
| `frontend/src/components/ui/GlassPanel.tsx` | Reusable glassmorphism panel (backdrop-blur, semi-transparent white, subtle border) used for all cards, modals, and the main canvas. |
| `frontend/src/components/ui/RadioCard.tsx` | Polished interactive option card: 2px primary border + `accent-soft` bg when selected, custom radio indicator (22px ring → filled blue + white dot), hover lift + glow, Framer Motion press/tap animation. |
| `frontend/src/components/ui/ProgressTrack.tsx` | Top-of-wizard progress indicator: segmented bar (8 segments desktop, dots mobile) with active = primary, completed = primary, pending = surface-container-high. |
| `frontend/src/components/ui/ActionButton.tsx` | Primary/secondary button variants matching DESIGN.md: Primary = rounded-xl, Royal Blue bg, white text, `shadow-lg shadow-accent/25`, hover `scale-[1.02]`; Secondary = transparent/bordered, 44px min height. |
| `frontend/src/components/layout/Shell.tsx` | Root layout wrapper: max-w-[1440px] mx-auto, dark navy shell (`bg-surface`), glass canvas (`max-w-5xl` ≈ 1024px) with `rounded-2xl`, sticky header/footer slots. Replaces ad-hoc wrappers in `App.tsx`, `Wizard.tsx`, `CanvasStep.tsx`. |
| `frontend/src/components/layout/WizardHeader.tsx` | Fixed top bar inside Shell: AlysTech logo (headline-md, primary), progress track (desktop), help button (glass panel). |
| `frontend/src/components/layout/WizardFooter.tsx` | Fixed bottom bar inside Shell: Back (secondary) / Continue (primary) buttons, mobile step indicator. |
| `frontend/src/components/wizard/IntroStep.tsx` | Redesigned welcome screen: centered glass card, bolt icon in 56px glass circle, display-lg headline, body-base copy, primary ActionButton, decorative progress dots. |
| `frontend/src/components/wizard/DiagnosticStep.tsx` | Diagnostic/Intro screen for each block: block badge (tertiary-container), display-lg headline, body-base description, decorative background (grid pattern + gradient orb). |
| `frontend/src/components/wizard/OptionsStep.tsx` | **Major rewrite** — split layout (lg+): left rail (280–320px) stacked RadioCards; right panel (flex-1) glass panel with sticky header (icon + name + price), scrollable body (description, 2-col features/cost breakdown, AddonMenu), sticky footer (Select button). Mobile: stacked RadioCards + full-screen CostBreakdownModal. |
| `frontend/src/components/wizard/TcoComparisonStep.tsx` | Redesigned TCO step: financial dashboard cards (CAPEX/OPEX/TOTAL), visual breakdown bar, glass panels, consistent typography. |
| `frontend/src/components/wizard/Overview.tsx` | Executive overview (step 0 in current code, but spec says step 0 = welcome): keep as diagnostic intro if needed, otherwise fold into IntroStep. |
| `frontend/src/components/canvas/CanvasStep.tsx` | **Major rewrite** — executive summary canvas: glass panel, header with logo + ref + date, investment hero (gradient accent-soft → blue-50), selection table (desktop) / cards (mobile) with block icons, addon chips (charged/included/available), strategy quadrants (4-card bento grid), roadmap timeline (L-border + dots), sticky action bar (Reject/Consult/PDF/Accept). |
| `frontend/src/components/ui/CostBreakdownModal.tsx` | Redesigned modal: 85vh max, glass panel on dark overlay (80% navy + backdrop-blur-sm), sticky header (icon + name + price), scrollable body (description, features, cost breakdown, AddonMenu), sticky footer (total + Select button). Escape key + scroll-lock. |
| `frontend/src/components/ui/FeatureComparisonModal.tsx` | Redesigned comparison matrix modal: same glass shell, scrollable table, sticky header. |
| `frontend/src/components/layout/Hero.tsx` | Marketing hero (if used outside wizard): glass panel, centered, display-lg, body-base. |
| `frontend/src/components/layout/About.tsx` | "Quiénes somos" section: glass card, headline-md, body-base. |
| `frontend/src/components/layout/ConditionsAccordion.tsx` | Collapsible conditions: `<details>` with glass summary, body-base text. |
| `frontend/src/components/layout/StickyTotalBar.tsx` | Sticky top bar inside wizard (below header): shows Year 1 total + recurring, glass panel, right-aligned. |
| `frontend/src/components/layout/ActionBar.tsx` | Fixed bottom bar (outside wizard footer): Year 1 total + 4 buttons (Reject, Consult, PDF, Accept) — matches original `.action-bar` but in glass. |
| `frontend/src/components/layout/NextSteps.tsx` | Timeline component (reused in CanvasStep roadmap). |
| `frontend/src/components/layout/TermsFooter.tsx` | Footer with legal terms + copyright. |
| `frontend/src/components/detail-modal/ComparisonMatrixTable.tsx` | Table component for feature comparison matrix (used in FeatureComparisonModal). |

### Existing Files to Modify

| Path | Changes |
|------|---------|
| `frontend/src/index.css` | **Extend @theme** with DESIGN.md tokens: add `--color-surface`, `--color-surface-alt`, `--color-card`, `--color-card-hover`, `--color-card-border`, `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-accent-muted`, semantic colors (positive, amber, danger + soft variants), text colors (ink, ink-secondary, ink-muted, ink-on-dark), spacing scale (unit, xs, sm, md, lg, xl, margin-mobile, margin-desktop, max-width-content), border-radius scale (DEFAULT, lg, xl, full), font families (display-lg, headline-md, body-base, body-medium, label-caps, display-lg-mobile), font sizes with line-height/weight/letter-spacing. Remove legacy `text-[Npx]` utilities from components. |
| `frontend/src/App.tsx` | Replace scaffold with `<Shell><WizardHeader /><Wizard /></Shell>`; wire all handlers (selections, addons, totals, modals, PDF, decision/consulta). |
| `frontend/src/components/wizard/Wizard.tsx` | Consume `WizardHeader` + `WizardFooter` from layout; remove inline header/footer; step content renders in Shell's main canvas area. |
| `frontend/src/components/wizard/WizardProgress.tsx` | Replace with `ProgressTrack` component (or delete if merged). |
| `frontend/src/hooks/useProposalSelections.ts` | No logic changes; ensure it exports `addonSelections` and `toggleAddon` for new UI. |
| `frontend/src/lib/totals.ts` / `lib/totals.test.ts` | No changes (logic already correct). |
| `frontend/src/data/groups/*.ts` | Verify `addons` arrays have `recommended: boolean`, `includedInTiers: string[]`, `applicableTiers?: string[]` for all 5 groups (MDM done; SRV/NET/AUD/SUP need audit). |
| `frontend/src/data/canvas.ts` | Ensure `quadrants` and `roadmap` match DESIGN.md visual spec (icons, titles, items). |
| `frontend/src/data/overview.ts` | Verify executive overview content. |
| `frontend/src/components/options/OptionCard.tsx` | **Delete** — replaced by `RadioCard`. |
| `frontend/src/components/options/Badge.tsx` | Keep (used in RadioCard for "Recomendada/ECO/PRO/WARN"). |
| `frontend/src/components/options/FeatureList.tsx` | Keep (used in modal detail). |
| `frontend/src/components/options/CostBreakdownTable.tsx` | Keep (used in modal detail). |
| `frontend/src/components/detail-modal/Modal.tsx` | **Delete** — replaced by glass panel in `CostBreakdownModal`/`FeatureComparisonModal`. |
| `frontend/src/components/detail-modal/OptionDetailModal.tsx` | **Delete** — merged into `CostBreakdownModal`. |
| `frontend/src/components/detail-modal/GroupDetailModal.tsx` | **Delete** — not used (CanvasStep uses `CostBreakdownModal`). |
| `frontend/src/components/ui/FeatureComparisonModal.tsx` | Update to use new glass modal shell. |
| `frontend/vite.config.ts` | Verify `base: '/araucanos/'`, `outDir: '../public/araucanos'`, proxy `/api` → `localhost:3000`. |
| `server.js` | **Later (Task 7 in handoff)**: rewrite `/api/pdf` handler to generate corporate quote PDF with only selected options + addons (spec in `spec-react-refactor.md`). |

### Files to Delete

- `frontend/src/components/options/OptionCard.tsx`
- `frontend/src/components/detail-modal/Modal.tsx`
- `frontend/src/components/detail-modal/OptionDetailModal.tsx`
- `frontend/src/components/detail-modal/GroupDetailModal.tsx`

### Configuration Updates

- `frontend/src/index.css` — complete `@theme` token replacement (see Types section).
- No `tailwind.config.js` (Tailwind v4 CSS-first).
- `frontend/tsconfig.app.json` — ensure `paths` alias `@/*` works without `baseUrl` (already done).

## Functions

### New Functions / Components

| Name | File | Purpose |
|------|------|---------|
| `GlassPanel` | `components/ui/GlassPanel.tsx` | Wrapper: `bg-white/95 backdrop-blur-md border border-border-slate/80 rounded-2xl shadow-sm` (cards), `rounded-xl` (modals). |
| `RadioCard` | `components/ui/RadioCard.tsx` | Interactive option card with selection glow, custom radio, Framer Motion tap/hover. |
| `ProgressTrack` | `components/ui/ProgressTrack.tsx` | Wizard progress indicator (segments desktop, dots mobile). |
| `ActionButton` | `components/ui/ActionButton.tsx` | Primary/Secondary/CTA button variants per DESIGN.md. |
| `Shell` | `components/layout/Shell.tsx` | Root layout: dark shell + centered glass canvas + header/footer slots. |
| `WizardHeader` | `components/layout/WizardHeader.tsx` | Fixed top bar with logo, progress, help. |
| `WizardFooter` | `components/layout/WizardFooter.tsx` | Fixed bottom bar with Back/Continue. |
| `IntroStep` | `components/wizard/IntroStep.tsx` | Welcome screen (Step 0). |
| `DiagnosticStep` | `components/wizard/DiagnosticStep.tsx` | Block intro screen (odd steps 1,3,5,7,9). |
| `OptionsStep` | `components/wizard/OptionsStep.tsx` | Split layout option picker (even steps 2,4,6,8,10). |
| `TcoComparisonStep` | `components/wizard/TcoComparisonStep.tsx` | Financial dashboard (Step 11). |
| `CanvasStep` | `components/canvas/CanvasStep.tsx` | Executive summary canvas (Step 12). |
| `CostBreakdownModal` | `components/ui/CostBreakdownModal.tsx` | Full-screen detail modal (glass on dark overlay). |
| `FeatureComparisonModal` | `components/ui/FeatureComparisonModal.tsx` | Comparison matrix modal. |
| `Hero` / `About` / `ConditionsAccordion` / `StickyTotalBar` / `ActionBar` / `NextSteps` / `TermsFooter` | `components/layout/*.tsx` | Layout primitives for marketing shell (if used). |

### Modified Functions

| Name | File | Changes |
|------|------|---------|
| `App` | `App.tsx` | Full integration: state for `currentStep (0–12)`, `selections`, `addonSelections`, `totals`, modal states; handlers for `onSelectOption`, `onToggleAddon`, `onAccept`, `onReject`, `onConsulta`, `onDownloadPdf`; renders `Shell > WizardHeader + Wizard + WizardFooter`. |
| `Wizard` | `components/wizard/Wizard.tsx` | Remove inline header/footer; render step content only; `AnimatePresence` slide transitions (x: ±20, opacity). |
| `useProposalSelections` | `hooks/useProposalSelections.ts` | Export `addonSelections` (Record<GroupId, string[]>) and `toggleAddon(group, addonId)`. |
| `computeTotals` | `lib/totals.ts` | Accept `addonSelections` param; sum `addon.amountUsd` (and recurring) per group; no double-count if `includedInTiers`. |

## Classes

No class-based components. All components are functional React components with hooks.

## Dependencies

No new runtime dependencies. Existing stack covers all needs:

- `react` 19, `react-dom` 19
- `framer-motion` 11+ (animations)
- `tailwindcss` v4 (CSS-first, `@theme` in `index.css`)
- `pdfkit` (server-side, in `server.js`)
- `vitest` + `@testing-library/react` (tests)
- `typescript` 5.6+, `vite` 5+

Dev dependencies unchanged.

## Testing

### Unit Tests (Vitest)

- `lib/totals.test.ts` — extend existing 11 tests with addon scenarios: (a) addon already included in tier not double-counted, (b) addon toggled on/off updates `totalUsd`/`recurUsd`, (c) regression: each tier alone matches current `priceUsd`/`recurUsd` in `data/groups/*.ts`.

### Component Tests (Vitest + Testing Library)

- `RadioCard.test.tsx` — renders selected/unselected states, keyboard accessible (Enter/Space), emits `onSelect`.
- `OptionsStep.test.tsx` — left rail renders all options; clicking updates `selectedOptionId`; right panel shows correct preview; mobile modal opens on "Ver detalles".
- `CanvasStep.test.tsx` — table rows match selections; addon chips show charged/included/available; totals match `totals` prop.
- `CostBreakdownModal.test.tsx` — opens/closes; shows features, cost breakdown, addons; sticky footer total updates with addon toggles.

### Type Safety Gate

- `npm run typecheck` (tsc --noEmit) must pass with zero errors before any build.

### Visual Verification (Manual, Required)

- Run `npm run dev` (Vite proxy → Express on :3000).
- Test in Chrome DevTools device toolbar: **375px (mobile)** and **1440px (desktop)**.
- Verify: no horizontal scroll, touch targets ≥ 44px, `prefers-reduced-motion` respected (Framer Motion `useReducedMotion` hook added to motion components), glass panels render with backdrop-blur, dark shell visible on desktop margins.
- Complete full wizard flow (13 steps) with at least one addon per block; verify PDF download contains only selected options + addons.

## Implementation Order

1. **Design Tokens Foundation** — Extend `src/index.css` `@theme` with all DESIGN.md tokens (colors, typography, spacing, radii, shadows). Remove all `text-[Npx]` arbitrary values from components.
2. **Primitive UI Components** — Create `GlassPanel`, `RadioCard`, `ProgressTrack`, `ActionButton` (with Framer Motion micro-interactions and `useReducedMotion`).
3. **Layout Shell** — Build `Shell`, `WizardHeader`, `WizardFooter`. Wire into `App.tsx` with placeholder step content.
4. **Wizard Steps — Core Flow** — Implement `IntroStep` (step 0), `DiagnosticStep` (odd steps), `OptionsStep` (even steps, split layout + mobile modal). Update `Wizard.tsx` to render steps 0–10 via `AnimatePresence`.
5. **Data Audit** — Verify all 5 groups in `data/groups/*.ts` have complete `addons[]` with `recommended`, `includedInTiers`, `applicableTiers`. Add missing addons for SRV/NET/AUD/SUP (traceable to existing `costBreakdown` deltas).
6. **TCO & Canvas** — Redesign `TcoComparisonStep` (step 11) and `CanvasStep` (step 12) per DESIGN.md (financial cards, quadrants, roadmap, action bar).
7. **Modals** — Rebuild `CostBreakdownModal` and `FeatureComparisonModal` with glass shell, dark overlay, sticky header/footer, scroll-lock, Escape key.
8. **Integration & Polish** — Wire all handlers in `App.tsx` (`onSelectOption`, `onToggleAddon`, `onAccept`, `onReject`, `onConsulta`, `onDownloadPdf`). Run `typecheck` + `test`. Manual visual QA (mobile + desktop).
9. **PDF Backend (Task 7 from handoff)** — Rewrite `server.js` `/api/pdf` to generate corporate quote with only selected options + addons (spec in `spec-react-refactor.md`). Verify `lib/api.ts` sends enriched payload (`buildSelectionSummaries`).
10. **Final Verification** — `npm run build`, `docker build`, full E2E in browser (decision/consulta write to `data/*.json`, PDF downloads correctly). Present to user for commit decision.

---