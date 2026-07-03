# Handoff: Refactor React+TS de la propuesta Araucanos

## Context Summary

Se está migrando `public/araucanos/index.html` (propuesta comercial estática, HTML/CSS/JS vanilla) a una SPA en React 19 + TypeScript + Vite + Tailwind v4 + Framer Motion, manteniendo el backend Express (`server.js`) sin cambios de contrato salvo `/api/pdf`. Spec completa y aprobada por el usuario en `docs/spec-react-refactor.md` (léela primero — tiene el Objective, Tech Stack, Project Structure, Formato del PDF, Boundaries y el Implementation Plan de 7 fases A–G).

Decisiones ya cerradas con el usuario (no volver a preguntar):
- UX: wizard guiado paso a paso (6 pasos: resumen, A·móvil, B·servidor+red, C·auditoría, D·soporte, canvas final) + botón "ver detalle" que abre **modal** (no panel inline, no pestaña aparte).
- Estilos: Tailwind CSS v4 (CSS-first, sin `tailwind.config.js`, tokens en `@theme` dentro de `src/index.css`).
- PDF: se rediseña `/api/pdf` en `server.js` para producir un presupuesto empresarial profesional con **solo las opciones seleccionadas** (no el catálogo completo), formato de cotización corporativa. Sin impresión client-side duplicada.
- Contenido de negocio: se porta 1:1 sin alterar precios ni textos. Fuente de verdad: `docs/reference/original-index.html` (copia de seguridad del HTML en producción, ver Gotchas).

Estado: **tareas 1, 2 y 3 completas y verificadas. Tarea 4 en progreso (~60%). Tareas 5-8 pendientes** (ver Next Steps). Hay una lista de tareas activa en el sistema de tasks del harness (TaskList) — 8 tareas, úsala para trackear en vez de crear una nueva.

## Files Changed / Created (no hay commits — todo está en el working tree)

- `docs/spec-react-refactor.md` — spec completa (fuente de verdad del alcance y decisiones).
- `docs/reference/original-index.html` — **copia de seguridad intacta** del HTML original de producción (1602 líneas). Ver Gotchas #1, es crítica.
- `.gitignore` — se agregó `public/araucanos/` (ahora es build output generado por Vite).
- `Dockerfile` — se agregó un stage `frontend-build` que corre `npm run build` en `frontend/` antes de copiar `public/araucanos` a la imagen final. Verificado que compila.
- `frontend/` — subproyecto Vite nuevo, completo:
  - `vite.config.ts` — `base:'/araucanos/'`, `outDir:'../public/araucanos'` con `emptyOutDir:true` (⚠️ ver Gotchas #1), proxy dev `/api` y `/healthz` → `http://localhost:3000`, alias `@` → `src/`.
  - `src/index.css` — Tailwind v4 + paleta de marca en `@theme` (navy/blue/steel/green/amber/red + Plus Jakarta Sans).
  - `src/types/proposal.ts` — **tipos centrales**, fuente de verdad de todas las formas de datos. Se extendió varias veces (por mí y por un agente delegado) — revisarlo antes de asumir una forma.
  - `src/data/*.ts` + `src/data/groups/*.ts` — todo el contenido de negocio portado 1:1 (hero, about, condiciones, 5 grupos de opciones con precios/features/desgloses, onboarding, próximos pasos, términos, canvas, modals, overview/resumen ejecutivo). Assemblado en `src/data/index.ts` como `proposalContent: ProposalContent`.
  - `src/lib/currency.ts`, `src/lib/totals.ts` (con `src/lib/totals.test.ts`, 11 tests en verde), `src/lib/api.ts` (cliente para `/api/decision`, `/api/consulta`, `/api/pdf`, incluye `buildSelectionSummaries` que enriquece el payload del PDF con `description` + `costBreakdown` por selección).
  - `src/hooks/useProposalSelections.ts` — hook de estado de selección + totales en vivo.
  - `src/components/` — ver lista completa en Files Changed abajo. Construidos: `detail-modal/*` (Modal genérico animado, OptionDetailModal, GroupDetailModal, ComparisonMatrixTable), `options/*` (Badge, FeatureList, CostBreakdownTable, OptionCard con animación de selección), `wizard/*` (NoteBlock, FeatureCardGrid, GroupSection, GlanceGrid, Overview — **falta Wizard.tsx orquestador y WizardProgress.tsx**), `canvas/CanvasStep.tsx`, `layout/DecisionModal.tsx` y `layout/ConsultaModal.tsx` (formularios completos con estado idle/sending/done/error).
  - `src/App.tsx` — **todavía es el placeholder de scaffold** ("Scaffold en marcha"), no integrado con nada real.
  - `src/test/setup.ts` — setup de Vitest + Testing Library.

## Tests Status

- `cd frontend && npm run typecheck` → limpio (última corrida exitosa).
- `cd frontend && npm run test` → 11/11 tests en verde (`lib/totals.test.ts`).
- `cd frontend && npm run build` → compila y sirve correctamente vía `server.js` en `/araucanos` (verificado con curl, assets con rutas correctas). **No volver a correr `build` sin necesidad** — ver Gotchas #1.
- No hay tests de componentes todavía (planeados para `OptionCard` y el flujo del wizard, no se llegó a esa parte).
- No se probó nada en navegador real todavía (Playwright/manual) — pendiente antes de dar la tarea 4/8 por terminada, según las reglas del proyecto (verificar UI en navegador, mobile+desktop, antes de reportar como completo).

## Next Steps (en orden)

1. **Terminar tarea 4**: construir `components/wizard/Wizard.tsx` (orquestador: estado de paso 0-5, barra de progreso, nav prev/next con dots) + `WizardProgress.tsx`, ensamblando `Overview` (paso 0), `GroupSection` para mdm (paso 1), srv+net combinados (paso 2 — dos `GroupSection` uno detrás del otro, net con `showIntro` reducido ya que comparten intro), aud (paso 3), sup (paso 4), `CanvasStep` (paso 5).
2. Construir los componentes de `layout/` que faltan: `Hero.tsx`, `About.tsx`, `ConditionsAccordion.tsx` (el `<details>` de condiciones comerciales), `StickyTotalBar.tsx` (la franja de total pegajosa arriba del wizard), `ActionBar.tsx` (barra fija inferior con total + 4 botones, replica `.action-bar` del original), `NextSteps.tsx` (timeline "Próximos pasos"), `TermsFooter.tsx` (condiciones generales + footer).
3. Integrar todo en `App.tsx`: `useProposalSelections(proposalContent.groups, proposalContent.deviceCount)`, estado de paso del wizard, estado de modales (id de opción en detalle, id de grupo en detalle técnico, tipo de decisión accept/reject/null, consulta abierta/cerrada, pdf pendiente), handlers que llaman a `lib/api.ts` (`submitDecision`/`submitConsulta`/`downloadPdf` usando `buildSelectionSummaries` + `totalsPayload`).
4. Re-correr `npm run typecheck` y `npm run test` tras la integración completa.
5. Probar en navegador real: `node server.js` (puerto 3000) + `cd frontend && npm run dev` (proxea `/api` al 3000), revisar en 375px y desktop, sin scroll horizontal, que la selección/totales/modales/wizard funcionen de punta a punta.
6. **Tarea 7 — reescribir `/api/pdf` en `server.js`**: implementar el formato descripto en la sección "Formato del PDF" de `docs/spec-react-refactor.md` (presupuesto empresarial profesional, solo opciones seleccionadas, desglose de costos por selección usando los campos `description`/`costBreakdown` que el frontend ya envía enriquecidos vía `buildSelectionSummaries`). Cambio backend, ya pre-aprobado en la spec — no hace falta reconfirmar con el usuario.
7. **Tarea 8 — verificación end-to-end final**: confirmar que `/api/decision` y `/api/consulta` siguen escribiendo en `data/*.json` igual que antes, que el PDF descargado tiene el contenido correcto, que `npm run build` + `docker build` siguen funcionando.
8. Recién al final: preguntar al usuario si quiere commitear (no se hizo ningún commit en esta sesión — todo sigue en el working tree) y qué hacer con `docs/reference/original-index.html` (¿se mantiene como referencia de auditoría o se borra una vez verificada la fidelidad de contenido?).

## Suggested Skills for Next Agent

- Ninguno adicional necesario — seguir usando `spec-driven-development` como marco (ya en fase Implement) y el `docs/spec-react-refactor.md` como referencia de alcance. Si hay dudas de diseño visual, `ui-ux-pro-max` ya fue invocado al inicio de la sesión y sus checklists (touch targets, contraste, animación 150-300ms, reduced-motion) aplican a todo lo que falta construir.
