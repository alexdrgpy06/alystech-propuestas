# Spec: Refactor de la propuesta Araucanos a React + TypeScript

## Contexto

Hoy `public/araucanos/index.html` (1602 líneas, HTML+CSS+JS vanilla generado originalmente por `build.py` a partir de `Alystech_Plataforma.html`) es la propuesta comercial interactiva en vivo para Araucanos S.A.: documento largo con tabs, 5 bloques de configuración (MDM, Servidor, Red, Auditoría, Soporte), cada uno con 3-4 opciones seleccionables, matrices comparativas, desgloses de costos, notas de ingeniería, y una barra de acción fija que llama a `server.js` (`POST /api/decision`, `/api/consulta`, `/api/pdf`).

El usuario proveyó dos referencias adicionales:
- `canvas_plan_wizard_1.html` — patrón de configurador guiado paso a paso que termina en un "Project Canvas" resumen matricial.
- `Alystech_Plataforma.html` — versión previa (menos evolucionada) del documento tabulado actual.

**Decisión de producto (confirmada con el usuario):** construir un híbrido — wizard guiado paso a paso por bloque, con opción de expandir el detalle técnico completo (matrices, desgloses) en cada paso, terminando en una vista Canvas resumen. Reimplementado en React + TypeScript, con animaciones cuidadas, refactor de la arquitectura del código y sin perder ni un ápice del detalle de planes/precios/condiciones ya presente en el sitio en vivo.

## Assumptions (corregir si alguna es incorrecta)

1. Alcance visual/funcional: solo `/araucanos` (la propuesta de Araucanos). `landing.html` (stub genérico de la raíz) queda intacto.
2. Todo el contenido de negocio actual (precios, desgloses, textos de riesgo/impacto, condiciones comerciales, notas de ingeniería, badges RECOMENDADA/NO RECOMENDADO/ECO/PRO) se **porta 1:1 sin alterar números ni el sentido del texto** — el trabajo es de UX/arquitectura/código, no de contenido comercial. Fuente de verdad de contenido: `public/araucanos/index.html` (versión más evolucionada, ya en producción), no los HTML subidos (más antiguos).
3. Animación: **Framer Motion** (estándar de facto en React, buen soporte de `prefers-reduced-motion`).
3b. Estilos: **Tailwind CSS**, con la paleta navy/azul/verde/ámbar/rojo actual portada a `tailwind.config` como tokens (igual que hace `canvas_plan_wizard_1.html`), tipografía Plus Jakarta Sans.
3c. Detalle técnico (matrices comparativas, desglose de costos, features): se muestra en un **modal** por bloque/opción (no panel inline expandible, no pestaña aparte) — mejor compatibilidad táctil/mobile y evita que el wizard crezca verticalmente sin límite.
3d. PDF: el `/api/pdf` server-side (pdfkit) se **rediseña** para producir un presupuesto empresarial profesional — solo las opciones efectivamente seleccionadas (no el catálogo completo), con desglose detallado por bloque, formato tipo cotización corporativa. No hay impresión client-side (`window.print()`) de toda la página como vía alternativa: el PDF es el único documento descargable y es la fuente formal del presupuesto.
4. El contrato de API con `server.js` no cambia en `/api/decision` y `/api/consulta` (mismos payloads: `selections[]`, `totals{}`, `proposalId`, datos de cliente). `/api/pdf` sí se reescribe por dentro (sigue siendo `POST /api/pdf` con el mismo payload de entrada; cambia el documento que genera — ver sección PDF). Cualquier otro cambio a `server.js` se pregunta antes.
5. Build: Vite + React 18 + TypeScript, en un subproyecto `frontend/` con su propio `package.json`. `vite build` compila con `base: '/araucanos/'` y `outDir` apuntando a `public/araucanos`, reemplazando el HTML estático actual. El `Dockerfile` se actualiza para correr el build del frontend antes de copiar `public/`.
6. El PDF sigue generándose server-side con `pdfkit` (no se migra a generación client-side ni a una librería nueva) — solo cambia su contenido/diseño interno.
7. Sin backend de autenticación/multi-cliente nuevo: sigue siendo una propuesta puntual para Araucanos, con `PROPOSAL_ID = "AT-2026-0630-P"` fijo (igual que hoy).
8. No se requiere SSR/SEO — es una página con link privado, no indexada.

→ Corregime ahora si alguna de estas no es correcta, o avanzo con estas bases.

## Objective

Reemplazar el HTML/JS vanilla de la propuesta Araucanos por una SPA en React + TypeScript, manteniendo el mismo backend Express, con:
- Mejor fluidez de interacción (transiciones animadas entre pasos del wizard, estados de selección, expansión de detalle).
- Refactor de arquitectura: modelo de datos tipado y separado de la UI (planes, precios, features, condiciones), componentes reutilizables por bloque de opciones en vez de HTML repetido a mano.
- Todos los planes disponibles bien detallados y fáciles de comparar (no perder ninguna matriz, desglose de costos, nota de riesgo/impacto o condición comercial existente).
- Vista Canvas final tipo resumen ejecutivo (inspirada en `canvas_plan_wizard_1.html`) antes de aceptar/rechazar/consultar.

Usuario: el cliente Araucanos S.A. revisando la propuesta desde un link privado, en desktop y mobile. Éxito = puede recorrer los 5 bloques, entender el porqué de cada opción, ver el total actualizarse en tiempo real, y aceptar/rechazar/consultar/descargar PDF sin fricción ni pérdida de información respecto al sitio actual.

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite (build/dev server)
- Framer Motion (animación)
- Tailwind CSS (paleta navy/azul/verde/ámbar/rojo + Plus Jakarta Sans portada a `tailwind.config.ts`)
- Backend: Express + nodemailer sin cambios de contrato; **`/api/pdf` (pdfkit) se reescribe** para generar un presupuesto empresarial profesional con las opciones seleccionadas (ver sección PDF más abajo)

## Commands

```
Frontend dev:    cd frontend && npm install && npm run dev        # Vite dev server, proxy /api -> localhost:3000
Frontend build:  cd frontend && npm run build                      # -> ../public/araucanos
Frontend typecheck: cd frontend && npm run typecheck                # tsc --noEmit
Frontend test:   cd frontend && npm run test                       # Vitest
Backend:         npm start                                         # node server.js (raíz, sin cambios)
Docker build:    docker build -t alystech-propuestas .              # incluye build del frontend
```

## Project Structure

```
frontend/                    → nuevo subproyecto Vite
  src/
    data/                    → modelo tipado: planes, precios, features, condiciones (Araucanos)
    components/
      wizard/                → pasos del configurador, navegación, barra de progreso
      options/                → tarjeta de opción, badge, desglose de costos, feature list
      canvas/                → vista resumen final tipo Project Canvas
      detail-modal/           → modal de detalle técnico por opción (matriz comparativa, desglose de costos, features) — mismo modal en mobile y desktop
      layout/                → header, footer/sticky total bar, modales (aceptar/rechazar/consulta)
    hooks/                    → useProposalSelections (estado de selección + cálculo de totales)
    lib/                      → cálculo de totales, formato de moneda (USD/Gs), llamadas a /api/*
    types/                    → tipos compartidos (Plan, OptionGroup, Selection, Totals, DecisionPayload)
    App.tsx
    main.tsx
  index.html                  → entry Vite (reemplaza al actual public/araucanos/index.html tras build)
  vite.config.ts
  package.json
  tsconfig.json
public/araucanos/             → destino del build (generado, no se edita a mano)
server.js, data/, Dockerfile  → sin cambios de fondo
docs/spec-react-refactor.md   → esta spec
```

## Code Style

- TypeScript estricto, sin `any` salvo justificado con comentario.
- Datos de negocio (precios, textos, condiciones) viven en `src/data/*.ts` como objetos tipados, nunca hardcodeados dentro de JSX.
- Componentes funcionales + hooks, sin clases.
- Un componente = una responsabilidad (p.ej. `OptionCard` no sabe calcular totales; eso vive en `useProposalSelections`).

Ejemplo de forma esperada del modelo de datos:

```ts
// src/types/proposal.ts
export interface PlanOption {
  id: string;
  code: string;           // "MDM-B"
  group: 'mdm' | 'srv' | 'net' | 'aud' | 'sup';
  name: string;
  badge?: { label: string; tone: 'recommended' | 'eco' | 'pro' | 'warn' };
  priceUsd: number;
  recurUsd: number;
  isDefault: boolean;
  description: string;
  features: { included: boolean; partial?: boolean; text: string }[];
  costBreakdown: { category: 'hw' | 'lab' | 'lic' | 'svc'; label: string; amountUsd: number }[];
  notes?: string;
}
```

## Formato del PDF (presupuesto empresarial)

El PDF generado por `POST /api/pdf` deja de ser un listado simple y pasa a un documento de cotización corporativa profesional, con **solo las opciones efectivamente seleccionadas** (no el catálogo completo de alternativas):

1. **Encabezado:** logo/marca Alystech, "Presupuesto / Propuesta Económica", referencia (`AT-2026-0630-P`), fecha de emisión, validez (30 días).
2. **Datos del cliente:** Araucanos S.A., rubro, flota móvil, parque informático (los mismos datos ya presentes en el sitio).
3. **Detalle por bloque seleccionado** (A. Plataforma móvil, B. Servidor, B.2 Red, C. Auditoría, D. Soporte): código y nombre de la opción elegida, descripción, desglose de costos de esa opción (igual al `costgrid` que ya existe por opción en el HTML actual), no el desglose de las opciones no elegidas.
4. **Resumen de inversión:** total Año 1 (USD e IVA incluido), equivalente en Guaraníes, monto recurrente anual, split desarrollo/implementación vs. equipos si aplica.
5. **Condiciones comerciales:** forma de pago (50/25/25), moneda/tipo de cambio, IVA, viáticos on-site, inversión mínima — el mismo texto de condiciones ya vigente en el sitio.
6. **Pie:** espacio de firma (cliente / Alystech), igual que el `print-canvas-wrapper` del wizard de referencia.

No se listan las alternativas descartadas ni las matrices comparativas completas — esas quedan en el sitio web, el PDF es el documento formal de lo elegido.

## Testing Strategy

- **Unit (Vitest):** lógica de cálculo de totales (`useProposalSelections` / `lib/totals.ts`) — es la parte con impacto financiero real, debe tener cobertura de casos (selección por defecto, cambio de opción, recurrente vs. único, conversión Gs).
- **Component (Vitest + Testing Library):** `OptionCard` (estados seleccionado/no seleccionado, expandir desglose), flujo del wizard (avanzar/retroceder pasos).
- **Type safety como gate principal:** `tsc --noEmit` sin errores antes de cualquier build.
- Sin E2E por ahora (fuera de alcance salvo pedido explícito).

## Boundaries

- **Siempre:** correr `npm run typecheck` y `npm run test` antes de considerar una tarea terminada; preservar exactamente los montos y textos comerciales existentes salvo pedido explícito de cambiarlos; verificar visualmente en navegador (mobile + desktop) antes de reportar como completo, según las reglas del proyecto.
- **Preguntar primero:** cualquier cambio a `server.js` fuera de la lógica interna de `/api/pdf`; cualquier cambio de precios/condiciones/textos de negocio; agregar dependencias nuevas fuera de React/Vite/Tailwind/Framer Motion/testing; tocar `Dockerfile` de forma que cambie el healthcheck o el puerto.
- **Nunca:** commitear `.env` o credenciales SMTP; eliminar el `data/*.json` existente (decisiones/consultas ya registradas); reducir o resumir el contenido técnico/comercial existente en nombre de "simplificar el diseño".

## Success Criteria

- El sitio `/araucanos` funciona end-to-end en React: los 5 bloques del wizard, cálculo de totales en vivo, vista Canvas final, y los tres flujos de `server.js` (aceptar/rechazar, consulta, descarga PDF) siguen funcionando.
- El PDF descargado refleja fielmente solo las opciones seleccionadas al momento de pedirlo, con formato de presupuesto empresarial (ver sección PDF), sin listar alternativas descartadas.
- Ningún precio, desglose de costo, condición comercial o nota técnica del sitio actual se perdió o se alteró (verificable comparando contra `public/araucanos/index.html` actual).
- Transiciones animadas entre pasos del wizard y al expandir/colapsar detalle, respetando `prefers-reduced-motion`.
- `tsc --noEmit` limpio y tests de `lib/totals.ts` en verde.
- Responsive: probado en 375px y desktop; sin scroll horizontal.
- El build de Docker sigue produciendo una imagen que sirve correctamente en `/healthz` y `/araucanos`.

## Open Questions

Ninguna pendiente — las 3 quedaron resueltas: Tailwind CSS, detalle técnico en modal, PDF server-side rediseñado como presupuesto profesional solo con lo elegido.

## Implementation Plan

**A. Scaffolding (secuencial, primero):** `frontend/` con Vite+React+TS+Tailwind; `tailwind.config.ts` con la paleta actual como tokens; `vite.config.ts` (`base:'/araucanos/'`, `outDir:'../public/araucanos'`, proxy dev `/api`→`:3000`); `Dockerfile` actualizado para `npm ci && npm run build` del frontend antes de copiar `public/`.

**B. Modelo de datos:** tipos (`Plan`, `OptionGroup`, `Selection`, `Totals`) + extracción 1:1 de todo el contenido de negocio desde `public/araucanos/index.html` (los 5 grupos de opciones con sus precios/desgloses/features/badges, textos de riesgo-impacto por bloque, condiciones comerciales, hero/quiénes somos, onboarding, próximos pasos) a `src/data/*.ts`. Este paso es el de mayor riesgo (fidelidad de contenido) — se verifica con un diff manual final contra el HTML actual.

**C. Lógica core:** `useProposalSelections` + `lib/totals.ts` (misma lógica que el actual `sumGroups`/`recalc`) con tests Vitest; `lib/api.ts` (decision/consulta/pdf); `lib/currency.ts` (formato USD/Gs es-PY).

**D. Componentes:** layout (header, hero, quiénes-somos, condiciones colapsables, sticky total bar) → wizard (pasos, progreso, `OptionCard` con badge/precio/CTA "ver detalle") → `DetailModal` (matriz comparativa + desglose de costos + features, reusado por los 5 bloques) → `Canvas` (resumen final 6 cuadrantes + tabla de alternativas + acciones) → modales de aceptar/rechazar/consulta.

**E. Animación:** transición entre pasos del wizard, feedback de selección, apertura/cierre del modal de detalle (scale+fade desde el trigger), todo con Framer Motion y soporte `prefers-reduced-motion`.

**F. PDF (`server.js`):** reescribir el handler de `/api/pdf` al formato de presupuesto empresarial descrito arriba. Requiere enriquecer el payload que el frontend envía a `/api/pdf` (agregar `description` y `costBreakdown` por selección, hoy el payload solo manda `{group, code, name, price, id}`) — cambio aditivo, no rompe `/api/decision` ni `/api/consulta`.

**G. Integración y verificación:** armar `App.tsx`, correr `typecheck` + `vitest`, probar en navegador en 375px y desktop (dev server), verificar que decisión/consulta escriben en `data/*.json` como hoy, verificar contenido del PDF descargado, chequear que `docker build` sigue funcionando.

Riesgo principal: fidelidad de contenido al portar ~1600 líneas de copy/precios — se mitiga extrayendo el texto literal (no reescribiéndolo) y con verificación final punto por punto.
