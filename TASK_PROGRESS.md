# Visual Redesign - Task Progress

## Phase 1: Design Token Integration
- [x] Extend `frontend/src/index.css` @theme with all DESIGN.md tokens (colors, typography, spacing, rounded, shadows)
- [x] Add Plus Jakarta Sans font import/self-host setup
- [x] Verify Tailwind v4 config picks up new tokens

## Phase 2: Primitive UI Components
- [x] Create `GlassPanel` component (cards, modals, backdrop-blur)
- [x] Create `RadioCard` component (2px primary border + accent-soft bg on select, custom 22px radio)
- [x] Create `ProgressTrack` component (segments/dots, active=primary, inactive=muted slate)
- [x] Create `ActionButton` component (Primary: rounded-xl Royal Blue + shadow-lg shadow-accent/25, hover scale-1.02; Secondary: bordered 44px min)
- [x] Export primitives from `frontend/src/components/ui/index.ts`

## Phase 3: Layout Shell
- [x] Create `Shell` component (1440px max shell, 1024px content track, dark navy shell #0f172a)
- [x] Create `WizardHeader` component (logo + progress + help)
- [x] Create `WizardFooter` component (Back/Continue buttons)
- [x] Integrate Shell into `Wizard.tsx` orchestrator
- [x] Add AnimatePresence slide transitions between steps

## Phase 4: Wizard Steps Redesign
- [x] Redesign `IntroStep` (Step 0) - Typeform-like welcome
- [x] Redesign `DiagnosticStep` (Steps 1,3,5,7,9) - Split layout per Stitch reference
- [x] Redesign `OptionsStep` (Steps 2,4,6,8,10) - RadioCard grid, left rail + right panel
- [ ] Verify step navigation works with new Shell

## Phase 5: Data Audit & Add-ons
- [ ] Audit `frontend/src/data/groups/*.ts` for complete addons (recommended, includedInTiers, applicableTiers)
- [ ] Audit `frontend/src/lib/totals.ts` for correct calculations
- [ ] Verify 5 groups: mdm, srv, net, aud, sup all have complete data

## Phase 6: Advanced Steps Redesign
- [x] Redesign `TcoComparisonStep` (Step 11) - TCO comparison layout
- [x] Redesign `CanvasStep` (Step 12) - Executive summary: table/cards, quadrants, roadmap, action bar

## Phase 7: Modal Rebuilds
- [x] Rebuild `CostBreakdownModal` with GlassPanel shell + dark overlay
- [x] Rebuild `FeatureComparisonModal` with GlassPanel shell + dark overlay
- [x] Update `AddonMenu` styling to match RadioCard/GlassPanel

## Phase 8: Integration & Polish
- [ ] Full integration in `App.tsx` with all handlers
- [ ] TypeScript typecheck (npm run typecheck)
- [ ] Build check (npm run build)
- [ ] Manual visual QA at 375px and 1440px viewports
- [ ] Verify Framer Motion reduced-motion respect (useReducedMotion)
- [ ] Verify all micro-interactions (tap scale, hover lift/glow)

## Phase 9: PDF Backend (Later Phase)
- [ ] Rewrite server.js /api/pdf endpoint