# Spec: Rediseño visual + módulo de core/addons + fixes de resumen (Araucanos)

Fase del proyecto: continuación de `docs/spec-react-refactor.md` (refactor React ya implementado y en producción). Esta spec cubre la siguiente iteración: rediseño visual, corrección de dos bugs de cálculo/visualización, y una nueva capa de "ítems core vs. addons opcionales" por bloque.

**Estado: Fase 4 (IMPLEMENT) — Bloques 1, 2 y parte del 4 completos vía agentes paralelos. Checkpoint 1 (MDM como referencia) y buena parte del Checkpoint 2 (investigación de precio regional) ya resueltos — falta tu aprobación explícita antes de escribir ajustes de precio en `data/`. Ver "Estado al 2026-07-02" al final del documento.**

---

## Objective

Cuatro frentes de trabajo sobre la misma base de código (`frontend/`, React 18 + TS + Vite + Tailwind v4):

1. **Rediseño visual y de redacción**: layout más centrado, escala tipográfica consistente (hoy hay decenas de tamaños `text-[Npx]` arbitrarios sin sistema — ver "Code Style"), mejor aprovechamiento del espacio, coherencia visual/versatilidad/fluidez en todo el sistema (no solo en las pantallas nuevas), y una pasada de redacción sobre copys/microcopys (sin tocar montos ni hechos técnicos) para tono ejecutivo consistente.
2. **Dos fixes puntuales** (root cause ya identificado en el código, ver abajo):
   - El "Recurrente Anual" se muestra mal etiquetado en la tabla de resumen del Canvas (paso 12).
   - El resumen final no deja ver, por bloque, qué incluye la opción elegida ni qué addons adicionales existen — esto se resuelve como parte del punto 3, no como fix aislado.
3. **Nueva funcionalidad: núcleo (core) + addons opcionales por bloque, con el menú completo dentro del modal de detalle.** Cada uno de los 5 bloques (A·MDM, B.1·Servidor, B.2·Red, C·Auditoría, D·Soporte) pasa a exponer, además del nivel/tier elegido (que se mantiene como hoy — A/B/Ideal/Comercial, etc.), un menú de ítems opcionales con costo propio y establecido que el cliente puede sumar a su elección. La tarjeta de cada opción muestra el precio núcleo como **"Desde $X"**; el menú completo de addons — con marca visual "Recomendado" en los sugeridos — vive dentro del modal de detalle (`OptionDetailModal`/`CostBreakdownModal`), que es donde se arma el total final de esa opción.
4. **Auditoría y ajuste de precios del sistema completo**: validar que todos los ítems de costo (`costBreakdown` de los 5 bloques) sean internamente consistentes entre sí (misma tarifa horaria implícita, mismo criterio de tiempo de desarrollo) y estén alineados a precio regional actualizado — ver "Modelo de repricing y validación de costos".

**Usuario**: Araucanos S.A. revisando la propuesta desde el link privado (desktop y mobile). Éxito = entiende de un vistazo qué es innegociable (core) de cada alternativa y qué es opcional con su costo, ve un resumen final que refleja con precisión lo que va a pagar (Año 1 y recurrente), la propuesta se percibe pulida, versátil y fluida en todos sus pasos, y los precios están validados contra una base de costeo y de mercado regional coherente.

---

## Diagnóstico (código ya inspeccionado, no hipótesis)

### Bug 1 — "Recurrente Anual" mal etiquetado en el resumen (confirmado con el usuario)

`frontend/src/components/canvas/CanvasStep.tsx:105-109`, dentro de la tabla de selección del paso 12:

```tsx
{formatUsd(option.priceUsd)}
{(option.priceUnit.includes('año') || option.recurUsd > 0) && (
  <span className="text-[10px] text-ink-muted font-normal ml-0.5">/año</span>
)}
```

`option.priceUsd` es la inversión de Año 1 (incluye desarrollo/implementación + la porción recurrente del primer año cuando aplica). Para una opción como MDM-D (SureMDM), `priceUsd = 12900` y `recurUsd = 6560`. La condición `option.recurUsd > 0` agrega el sufijo "/año" al monto de **Año 1 completo**, mostrando "$12.900/año" — un número que no es ni el costo de Año 1 (mal etiquetado) ni el recurrente real ($6.560). Esto es lo que el usuario percibe como "no suma bien recurrente anual": la fila contradice visualmente al total recurrente correcto que sí calcula `totals.recurUsd` (via `lib/totals.ts`, que está bien) y que se muestra separado arriba en la misma pantalla.

**Fix**: la fila debe mostrar el precio de Año 1 sin la etiqueta "/año" engañosa, y — cuando `option.recurUsd > 0` — una segunda línea/columna explícita "Recurrente: $X/año" separada del monto de Año 1. Mismo criterio a revisar en `StickyTotalBar.tsx` y el footer de `App.tsx` (ahí el cálculo ya es correcto — `totals.recurUsd` — pero conviene una pasada de verificación).

### "No se ven las opciones diferentes en el resumen" (aclarado con el usuario)

No es que falte una fila — `CanvasStep.tsx` ya itera los 5 grupos y muestra la opción elegida. El problema real (confirmado): el resumen no comunica **qué incluye** cada elección (más allá del nombre) ni **qué addons disponibles no se sumaron**. Esto se resuelve directamente con el punto 3 (core/addons): la fila expandida de cada bloque en el Canvas debe listar ítems incluidos (core + addons marcados) y, opcionalmente, un teaser de addons disponibles no seleccionados con su costo — no como bug aislado sino como requisito de la nueva funcionalidad.

### Base de datos para core/addons — qué ya existe y qué falta

`frontend/src/types/proposal.ts` ya tiene `CostLine` (`costBreakdown` por opción, con `category`, `label`, `amountUsd`, `recurring?`) y, solo en `mdm.ts`, un `catalogMatrix` (`GroupTechDetail.catalogMatrix`) que alinea, por ítem, su costo unitario contra columnas ✓/✕ por tier — es decir, **MDM ya tiene, en los datos, la información necesaria para separar núcleo de addons sin inventar precios nuevos**: los ítems ✓ en las 3 opciones de desarrollo propio (instalación, integración Knox, cargo base, capacitación, documentación = exactamente $6.200, el precio de MDM-A) son el núcleo; los ítems que varían (canal SMS $1.600, políticas avanzadas $700, consola a medida $3.300) son los addons candidatos.

Los otros 4 bloques **no tienen `catalogMatrix`** (confirmado por grep) — solo `costBreakdown` por opción, itemizado pero no alineado entre tiers. Para esos bloques, el catálogo de addons se construye durante la fase de Plan/Tasks calculando la diferencia entre `costBreakdown` de tiers adyacentes (ej. en Auditoría, subir de AUD-A a AUD-B agrega labor de auditoría más profunda + upgrade de SIEM; en Soporte, los tiers son niveles de SLA que no son descomponibles del mismo modo — ver Boundaries). **No se inventan montos nuevos**: todo addon debe trazarse a un monto que ya existe hoy en algún `costBreakdown`.

---

## Arquitectura propuesta: core + addons

Decisión de producto (confirmada con el usuario: "una mezcla de ambos — lo mínimo esencial por cada tier, y los addons disponibles con claridad"):

- **Los tiers actuales se mantienen como la elección principal** (A/B/Ideal/Comercial, etc. — siguen siendo mutuamente excluyentes dentro de un bloque, con sus badges RECOMENDADA/ECO/PRO tal cual). No se convierten en un armado 100% a la carte desde cero: eso implicaría reconstruir el modelo de precios de los 5 bloques y arriesgar los números ya vigentes de la propuesta.
- **Se agrega un menú de addons por bloque**, aplicable sobre cualquier tier elegido. Cada addon tiene `id`, etiqueta, descripción corta, costo (único y/o recurrente) y — clave — una lista de qué tiers ya lo incluyen de forma nativa (para no cobrarlo dos veces). Ejemplo con datos reales de MDM:
  - Addon "Canal de respaldo por SMS" — $1.600 único — ya incluido en MDM-B, MDM-C, MDM-D; disponible para agregar solo sobre MDM-A.
  - Addon "Entrega de código fuente" — $3.500 único — disponible solo sobre MDM-C (ya está en el `extraNote` actual como texto, pasa a ser un checkbox real).
- **Al elegir un tier, los addons que ya trae incluidos se muestran como "Incluido" (no togglable, informativo)**; los que no trae se muestran como checkbox con su costo, sumando a `totals.totalUsd`/`totals.recurUsd` cuando se marcan.
- **Regla dura de no regresión de precios**: cualquier combinación (tier + addons) equivalente a lo que hoy ofrece un tier existente debe dar exactamente el mismo `priceUsd`/`recurUsd` que ese tier tiene hoy. Es una verificación mecánica (test unitario) antes de tocar cualquier archivo de `data/groups/*.ts`.
- **Bloque D (Soporte)**: los 4 niveles son SLA (tiempo de respuesta, horario, visitas en sitio) — no ítems independientes sumables. Ahí el "addon" natural es el que ya está documentado como texto en `engineeringNote` (onboarding de dispositivos ejecutado por Alystech, tarifa por volumen $24/$19/$14 por unidad) — se convierte en selector de cantidad + costo, no en checkbox binario.
- **UI de precio**: la tarjeta de opción (`OptionCard`) muestra el precio núcleo con el prefijo **"Desde"** (ej. "Desde $6.200") en vez del monto fijo actual, porque el total real depende de los addons elegidos. El menú de addons — con checkbox, precio individual, y un tick/badge **"Recomendado"** en los que Alystech sugiere por defecto — vive dentro del modal de detalle de esa opción, no inline en la tarjeta. El modal es también donde se muestra el total final (núcleo + addons marcados) antes de confirmar la selección.

---

## Modelo de repricing y validación de costos

Pedido del usuario: ajustar precios calculando siempre "al precio regional, tiempo de desarrollo, horas de trabajo y más, para todo el sistema". Esto es un cambio de contenido comercial de alto impacto (propuesta real, cliente real) — se ejecuta con el siguiente método, decidido con el usuario:

1. **Tarifa horaria implícita, no inventada.** Para cada ítem de `costBreakdown` que tenga un plazo asociado (`perDeviceNote`/`extraNote` con "Plazo estimado: X semanas/jornadas"), se infiere una tarifa horaria implícita a partir del monto y el tiempo ya declarados hoy. Esa tarifa se usa como vara de medir para auditar los ~30+ ítems de costo de los 5 bloques: si dos ítems de alcance comparable (ej. "cargo base de implementación" en MDM vs. en Servidor) implican tarifas horarias muy distintas sin una razón declarada (complejidad, riesgo, especialización), se marca como inconsistencia a corregir.
2. **Tolerancia de movimiento**: los ajustes resultantes de esta auditoría se mantienen dentro de un **±10% del monto actual por ítem**, salvo que se documente una razón concreta para un cambio mayor (ese caso puntual se señala aparte para revisión antes de aplicarlo — no se sube directo a los datos de producción). Este 10% es un valor de partida razonable, no una cifra que el usuario haya fijado explícitamente — ajustar si se prefiere otro umbral.
3. **Precio regional actualizado por investigación**: las comparativas `tcoRegional` (competidor vs. Alystech) existentes por bloque, **y el tipo de cambio de referencia** (1 USD ≈ 6.250 Gs, en `terms.ts`), se re-investigan con datos de mercado 2026 para Paraguay/LatAm (MDM SaaS, SOC-as-a-Service/SIEM, soporte IT gestionado, licenciamiento de virtualización, cotización de referencia USD/Gs) vía búsqueda web. Los hallazgos se presentan como propuesta de actualización — con la fuente citada — **para revisión y aprobación antes de escribirlos en `data/groups/*.ts` o `terms.ts`**. No se publican cifras de mercado sin fuente verificable.
4. **La "inversión mínima de desarrollo" (hoy USD 12.000 fijo en `conditions.ts`) deja de ser una cifra fija hardcodeada y pasa a ser flexible**, siguiendo el pedido del usuario ("puede variar, vayamos a lo flexible y a los costos regionales y reales estimados"): se recalcula como el costo núcleo real de la combinación más económica posible (suma de los 5 precios "Desde $X" núcleo, sin addons), usando los montos ya auditados en el punto 1. Dado que hoy este mínimo es contenido de negocio (texto en `ConditionCard`), la propuesta técnica es derivarlo dinámicamente de `totals`/datos en vez de mantenerlo como string estático — se define el detalle exacto en la fase de Plan. Igual que el resto de esta sección, el número resultante se presenta antes/después para aprobación antes de publicarse; no es una cifra que se cambie de forma silenciosa solo por ser "flexible".
5. Todo el trabajo de esta sección se entrega en la fase de Plan/Tasks como una tabla de "antes/después" por ítem tocado (incluyendo tipo de cambio e inversión mínima), para aprobar de un vistazo antes de tocar los archivos de datos.

---

## Alcance del rediseño visual

- **Tipografía**: reemplazar los tamaños arbitrarios dispersos (`text-[9px]`, `text-[9.5px]`, `text-[10px]`, `text-[10.5px]`, `text-[11px]`, `text-[11.5px]`, `text-[12px]`, `text-[12.6px]`, `text-[13px]`, `text-[13.3px]`, `text-[13.5px]`, `text-[14px]`, `text-[15px]`... contados en `App.tsx`, `CanvasStep.tsx`, `GlanceGrid.tsx`, `OptionCard.tsx`, `TcoComparisonStep.tsx` entre otros) por una escala tipográfica fija de ~6-7 pasos definida en `@theme` de `index.css`, y usarla en todos los componentes. Sin números mágicos de tipografía nuevos.
- **Centrado y aprovechamiento de espacio**: revisar el padding/gap de cada paso del wizard, el ancho máximo de contenido (`max-w-6xl`/`max-w-5xl`/`max-w-4xl`/`max-w-3xl`/`max-w-2xl` mezclados hoy entre componentes) y unificar criterio por tipo de pantalla (paso de diagnóstico vs. paso de alternativas vs. Canvas).
- **Redacción**: pasada de copy sobre labels, hints, botones y microtextos (no sobre montos, condiciones comerciales ni hechos técnicos de riesgo/impacto) para tono ejecutivo consistente, siguiendo el pendiente ya anotado en `handoff_document.md` ("validar con el cliente la redacción en tercera persona formal").
- **Coherencia visual, versatilidad y fluidez**: los mismos patrones visuales (tarjeta, modal, badge, tabla de resumen) se usan de forma idéntica en los 5 bloques — nada de que un bloque "se vea distinto" por tener una estructura de datos distinta (ej. Soporte con SLA vs. MDM con catalogMatrix). El sistema de addons debe verse y comportarse igual en los 5 bloques aunque el contenido detrás sea distinto. Transiciones (Framer Motion) consistentes al abrir/cerrar el modal, marcar/desmarcar un addon, y actualizar el total — con soporte de `prefers-reduced-motion` ya vigente en el proyecto.
- **No se toca** contenido de negocio (precios, condiciones comerciales, textos de riesgo/impacto) salvo donde el punto 3 (addons) o el punto 4 (repricing) lo requieren explícitamente, y siempre trazable a un monto ya existente o a una fuente investigada y aprobada.

---

## Tech Stack

Sin cambios respecto a `docs/spec-react-refactor.md`: React 18 + TypeScript estricto, Vite, Tailwind CSS v4 (tokens en `@theme` dentro de `index.css`, no hay `tailwind.config.js`), Framer Motion, Vitest. Backend Express sin cambios de infraestructura (sí cambia el payload que `lib/api.ts` envía a `/api/pdf` y `/api/decision`, de forma aditiva, para incluir los addons seleccionados).

## Commands

```
Frontend dev:       cd frontend && npm run dev
Frontend build:     cd frontend && npm run build
Frontend typecheck: cd frontend && npm run typecheck
Frontend test:      cd frontend && npm run test
Frontend lint:      cd frontend && npm run lint
Backend:            npm start
```

## Project Structure

Se mantiene la estructura de `docs/spec-react-refactor.md`. Adiciones esperadas:

```
frontend/src/
  types/proposal.ts        → + AddonItem, + Selection con addons por grupo
  lib/totals.ts             → computeTotals recibe addons seleccionados, suma sobre el tier
  data/groups/*.ts          → + campo `addons: AddonItem[]` por grupo
  components/options/       → + AddonMenu (checklist con precio, estado "incluido" vs "agregar")
  components/canvas/        → CanvasStep.tsx: fila expandida por bloque (incluidos + addons + upsell)
```

## Code Style

Igual a `docs/spec-react-refactor.md` (componentes funcionales + hooks, datos de negocio en `src/data/*.ts` tipados, nunca hardcodeados en JSX, sin `any`). Se agrega:

- **Sin tamaños de fuente arbitrarios nuevos** (`text-[Npx]`) — usar los pasos de la escala tipográfica definida en `@theme`.
- **Ningún addon se define con un monto que no provenga de un `costBreakdown` existente** en el archivo de datos del bloque, salvo aprobación explícita para un ítem genuinamente nuevo.
- **Documentación de módulos no triviales**: `lib/totals.ts`, el nuevo cálculo de addons y la lógica de "incluido vs. disponible" llevan un comentario breve (una línea) explicando la invariante no obvia (p. ej. por qué un addon no se cobra si el tier ya lo incluye) — no docstrings largos, no comentarios que repitan lo que el código ya dice.
- **Autoría**: ningún commit ni comentario de código incluye coautoría de Claude/IA. Autor único: Alejandro Ramírez.
- **Tipo `AddonItem`** (nuevo en `types/proposal.ts`): incluye `recommended?: boolean` para el tick "Recomendado" en el modal, y `includedInTiers: string[]` (ids de tier que ya lo traen, para no cobrarlo dos veces).

## Testing Strategy

- **Unit (Vitest, `lib/totals.test.ts`)**: casos nuevos para addons — addon ya incluido en el tier no se cobra dos veces; addon marcado sobre un tier que no lo incluye suma correctamente a `totalUsd`/`recurUsd`; des-marcar un addon lo resta; **regresión dura**: para cada bloque, tier "solista" + combinación de addons que replica un tier superior existente debe dar el mismo total que ese tier tiene hoy en `data/groups/*.ts`.
- **Component**: `OptionCard`/`AddonMenu` (estado incluido vs. disponible vs. seleccionado), `CanvasStep` (fila expandida muestra addons correctos).
- **Verificación visual manual** (según reglas del proyecto): correr `npm run dev`, recorrer el wizard completo en 375px y desktop, con al menos una combinación de addons por bloque, antes de dar por terminada la tarea.
- `tsc --noEmit` limpio antes de cualquier build.

## Boundaries

- **Siempre**: correr `typecheck` + `test` antes de cerrar una tarea; verificar en navegador (mobile + desktop) los pasos tocados; preservar los montos comerciales ya vigentes en cualquier combinación equivalente a un tier existente salvo un ajuste específicamente auditado y aprobado (test de regresión, ver arriba); nunca agregar coautoría de Claude/IA en commits o comentarios — autor único Alejandro Ramírez.
- **Preguntar primero**: cualquier addon cuyo monto no provenga de un `costBreakdown` ya existente en el bloque; cualquier ajuste de la auditoría de tarifa horaria que exceda el ±10% de tolerancia por ítem; cualquier actualización de cifra de precio regional, tipo de cambio o inversión mínima antes de escribirla en `data/groups/*.ts`/`terms.ts`/`conditions.ts` (se presenta la tabla antes/después con fuente para aprobación en todos los casos — "flexible" no significa "silencioso"); cualquier cambio a `server.js` fuera de enriquecer el payload de `/api/pdf` y `/api/decision` con los addons seleccionados (aditivo, no rompe el contrato actual); agregar dependencias nuevas; cambiar el número total de pasos del wizard (asunción actual: se mantienen 13, los addons se integran dentro del paso "Alternativas" de cada bloque, no como pasos nuevos — corregir si esto no es lo esperado); reescribir textos de condiciones comerciales o de riesgo/impacto más allá de la pasada de redacción de microcopy; hacer `git push` al remoto (`origin` → GitHub → Coolify) — se hace recién cuando el usuario lo pida explícitamente, después de la verificación local.
- **Nunca**: inventar precios nuevos sin aprobación explícita; publicar cifras de "precio regional" sin fuente citada y revisada; reducir o resumir contenido técnico/comercial existente en nombre de "simplificar"; commitear `.env`/credenciales; tocar `data/*.json` de decisiones/consultas ya registradas.

## Success Criteria

1. La tabla de resumen del Canvas (paso 12) muestra, por bloque, el monto de Año 1 sin la etiqueta "/año" engañosa, y el monto recurrente real por separado cuando `recurUsd > 0` — verificable seleccionando MDM-D (SureMDM) y comprobando que la fila y el total superior coinciden.
2. Cada bloque de "Alternativas" (pasos 2/4/6/8/10) expone, además del tier elegido, un menú de addons con su costo, que se refleja en `totals.totalUsd`/`recurUsd` en tiempo real, sin duplicar cobros de ítems ya incluidos en el tier.
3. El Canvas final (paso 12) muestra por bloque: tier elegido + addons incluidos/agregados, de forma legible sin abrir un modal.
4. Ningún test de regresión de precios falla de forma **no intencional**: toda combinación equivalente a los tiers actuales da el mismo número que hoy, salvo los ítems específicamente ajustados y aprobados por la auditoría de tarifa horaria/precio regional (ver "Modelo de repricing") — esos cambios quedan documentados en la tabla antes/después, no son una regresión silenciosa.
5. Cero tamaños de fuente `text-[Npx]` fuera de la escala tipográfica definida (grep-eable).
6. `tsc --noEmit` y `npm run test` en verde; recorrido manual en 375px y desktop sin overflow horizontal.
7. Ningún commit de esta iteración lleva trailer de coautoría de Claude/IA.
8. La tarjeta de cada opción muestra "Desde $X"; el modal de detalle expone el menú de addons completo (con tick "Recomendado" en los sugeridos) y arma el total final ahí.
9. Existe una tabla de auditoría de tarifa horaria implícita (antes/después por ítem tocado) presentada para revisión antes de aplicar cualquier ajuste de precio.
10. Las cifras de `tcoRegional` y el tipo de cambio de referencia quedan actualizadas con datos 2026 investigados y con fuente citada, presentadas para aprobación antes de escribirse en los archivos de datos.
11. La "inversión mínima de desarrollo" deja de ser un texto fijo y queda derivada de los precios núcleo auditados de los 5 bloques, presentada para aprobación antes de reemplazar la cifra actual en `conditions.ts`.

## Despliegue

Fuera del alcance de esta iteración de desarrollo, pero así se define el flujo final: una vez verificado en local (`npm run dev`, `typecheck`, `test`, recorrido manual), se hace `git push` a `origin` (`github.com/alexdrgpy06/alystech-propuestas`) y Coolify toma el build desde ahí vía el `Dockerfile` ya existente (build multi-stage: frontend Vite → sirve `public/araucanos` con Express). **No se hace push automáticamente al cerrar tareas** — se pide confirmación explícita cuando el trabajo esté listo para subir, según el protocolo de git ya vigente en el proyecto.

## Open Questions

1. **Addons de Auditoría (C) y Soporte (D)**: la descomposición exacta core/addon (qué delta de `costBreakdown` se convierte en addon togglable vs. qué queda como diferencia inherente entre niveles de servicio no sumable) se resuelve en la fase de Plan usando el método de tarifa horaria implícita ya definido arriba. Se presenta para revisión antes de tocar esos dos archivos de datos.
2. **Payload de `/api/pdf` y `/api/decision`**: confirmar si el PDF debe listar los addons seleccionados como líneas propias dentro del desglose de costos de cada bloque (asunción: sí, mismo tratamiento que hoy tienen los `costBreakdown`).
3. **Umbral de tolerancia del ±10%** en la auditoría de tarifa horaria (ver "Modelo de repricing"): es un valor de partida propuesto, no confirmado explícitamente por el usuario — corregir si se prefiere otro número.

---

## Plan de Implementación

### Componentes y dependencias

```
types/proposal.ts (AddonItem, Selection, Totals)
        │
        ├──> lib/totals.ts (computeTotals con addons) ──> lib/totals.test.ts
        │              │
        │              └──> hooks/useProposalSelections.ts (estado de addons marcados)
        │
        ├──> data/groups/*.ts (+ campo addons[] por bloque) ──> requiere auditoría de tarifa horaria (bloque C/D) o catalogMatrix ya existente (bloque A)
        │
        └──> componentes UI:
               OptionCard ("Desde $X")
               AddonMenu (nuevo) ──> vive dentro de OptionDetailModal / CostBreakdownModal
               CanvasStep (fix bug "/año" + fila expandida con addons)
               StickyTotalBar / App.tsx footer (verificación, no debería requerir cambios)
               index.css (@theme: escala tipográfica)

lib/api.ts (buildSelectionSummaries) ──> server.js (/api/pdf, /api/decision: aditivo)
```

`index.css` (escala tipográfica) y el fix del bug de `CanvasStep.tsx` no dependen de nada de lo anterior — se hacen primero, en paralelo, sin riesgo.

### Orden de implementación

**Bloque 1 — Base técnica (sin tocar precios, bajo riesgo, primero):**
1. Fix bug "/año" en `CanvasStep.tsx` (+ verificación en `StickyTotalBar.tsx`/`App.tsx`).
2. Escala tipográfica en `index.css` `@theme` (definir los ~6-7 pasos; el reemplazo de cada `text-[Npx]` existente se hace archivo por archivo en el Bloque 4, no todo de una vez).
3. `types/proposal.ts`: agregar `AddonItem`, extender `Selection`/`Totals` para addons marcados.
4. `lib/totals.ts`: `computeTotals` acepta addons seleccionados por grupo, sin doble cobro de ítems ya incluidos en el tier — con tests de regresión (equivalencias con tiers actuales) y tests de suma/resta de addons.

**Bloque 2 — Bloque A · MDM como implementación de referencia (datos ya listos, catalogMatrix existe):**
5. `data/groups/mdm.ts`: agregar `addons: AddonItem[]` (Canal SMS $1.600, Políticas avanzadas $700, Consola a medida $3.300, Entrega de código fuente $3.500) con `includedInTiers` correcto por ítem — todos montos ya existentes, cero precios nuevos.
6. `AddonMenu` (nuevo componente) + integración en `OptionDetailModal`/`CostBreakdownModal`: checklist con precio, estado incluido/disponible/marcado, tick "Recomendado", total final.
7. `OptionCard`: precio con prefijo "Desde $X".
8. Verificación manual en navegador del bloque A completo (seleccionar cada tier, marcar/desmarcar addons, confirmar que el total no duplica cobros).

**Checkpoint 1 (con el usuario):** confirmar que el patrón de MDM (datos + UI) es el que se quiere replicar en los otros 4 bloques antes de invertir en escalarlo.

**Bloque 3 — Repricing (investigación y auditoría, se presenta antes de tocar datos):**
9. Auditoría de tarifa horaria implícita sobre los ~30 ítems de `costBreakdown` de los 5 bloques → tabla antes/después.
10. Investigación de precio regional 2026 (Paraguay/LatAm) + tipo de cambio de referencia, con fuentes citadas → propuesta de actualización.
11. Presentación de ambos resultados para aprobación — **no se escribe nada en `data/groups/*.ts`/`terms.ts` todavía en este paso.**

**Checkpoint 2 (con el usuario):** aprobar o ajustar la tabla antes/después antes del Bloque 4.

**Bloque 4 — Rollout a los 4 bloques restantes + repricing aprobado:**
12. `data/groups/srv.ts` y `net.ts`: addons por diferencia de `costBreakdown` entre tiers adyacentes (más directo que C/D, tienen estructura de tiers por capacidad técnica similar a MDM).
13. `data/groups/aud.ts`: addons (upgrade SIEM, EDR, pentest) como deltas entre tiers, aplicando los montos ya auditados/aprobados.
14. `data/groups/sup.ts`: addon de "onboarding ejecutado por Alystech" (selector de cantidad con tarifa por volumen ya documentada), tiers de SLA se mantienen mutuamente excluyentes.
15. Aplicar los ajustes de precio del Checkpoint 2 (±10% de tolerancia, cambios mayores señalados aparte) en los 5 bloques.
16. Derivar la "inversión mínima de desarrollo" de los precios núcleo finales → actualizar `conditions.ts`.
17. Reemplazo sistemático de `text-[Npx]` arbitrarios por la escala tipográfica, archivo por archivo.
18. Pasada de redacción de microcopy (labels, hints, botones) en los 5 bloques.
19. `lib/api.ts`/`server.js`: enriquecer payload de `/api/pdf` y `/api/decision` con addons seleccionados (aditivo).

**Bloque 5 — Cierre:**
20. `CanvasStep.tsx`: fila expandida final por bloque (core + addons + upsell de addons no marcados).
21. Verificación completa: `typecheck`, `test`, `lint`, recorrido manual 375px + desktop de los 13 pasos con combinaciones variadas de addons, PDF descargado con addons reflejados.
22. Checkpoint final con el usuario → recién ahí, `git push` a `origin` bajo pedido explícito (ver "Despliegue").

### Riesgos y mitigación

- **Doble cobro de addons ya incluidos en un tier** → `includedInTiers` en el modelo de datos + tests unitarios dedicados antes de tocar UI.
- **Cambiar sin querer un precio ya vigente** → tests de regresión (Bloque 1, paso 4) corren en cada bloque antes de continuar al siguiente.
- **AUD/SUP no se descomponen tan limpio como MDM** → se resuelven después de MDM (Checkpoint 1) y después de la auditoría de tarifa horaria (Checkpoint 2), no a ciegas.
- **Automatización de navegador (agent-browser) falló y cerró Chrome en esta misma conversación** → la verificación visual de esta iteración se hace con `npm run dev` + revisión manual directa (o reintentando agent-browser con cautela, un solo intento controlado), no en bucle de reintentos.
- **Cifras de precio regional sin fuente sólida** → toda cifra investigada lleva la fuente citada en la tabla de propuesta; si no hay fuente confiable para un dato puntual, se deja la cifra actual y se marca como "sin actualizar" en vez de inventar.

### Paralelizable vs. secuencial

- **Paralelo, sin dependencias entre sí**: fix del bug de `CanvasStep`, escala tipográfica base, investigación de precio regional (Bloque 3, paso 10).
- **Secuencial obligatorio**: types → totals.ts → MDM (datos + UI) → Checkpoint 1 → auditoría de tarifa horaria → Checkpoint 2 → rollout a los 4 bloques restantes → cierre.

---

## Tareas

Formato: `[ ] Tarea — Aceptación — Verificación — Archivos`

**Bloque 1**
- [ ] Fix etiqueta "/año" en tabla de resumen — Acept.: la fila de cada bloque en el Canvas muestra el monto de Año 1 sin sufijo "/año" salvo que corresponda, y un monto recurrente separado cuando `recurUsd > 0` — Verif.: seleccionar MDM-D y comprobar visualmente — Archivos: `CanvasStep.tsx`, revisar `StickyTotalBar.tsx`/`App.tsx`.
- [ ] Escala tipográfica base en `@theme` — Acept.: ~6-7 variables de tamaño de fuente definidas, documentadas — Verif.: `tsc --noEmit`/build sin errores — Archivos: `index.css`.
- [ ] `AddonItem` + extensión de `Selection`/`Totals` — Acept.: tipos compilan, sin `any` — Verif.: `npm run typecheck` — Archivos: `types/proposal.ts`.
- [ ] `computeTotals` con addons — Acept.: no duplica cobro de addons incluidos en el tier; regresión exacta vs. tiers actuales — Verif.: `npm run test` (`lib/totals.test.ts`) — Archivos: `lib/totals.ts`, `lib/totals.test.ts`, `hooks/useProposalSelections.ts`.

**Bloque 2 (MDM, referencia)**
- [ ] `addons[]` en `mdm.ts` — Acept.: 4 addons, montos existentes, `includedInTiers` correcto — Verif.: test de regresión pasa — Archivos: `data/groups/mdm.ts`.
- [ ] `AddonMenu` + integración en modal — Acept.: checklist con precio, estado incluido/disponible, tick Recomendado, total final visible — Verif.: recorrido manual — Archivos: `components/options/AddonMenu.tsx` (nuevo), `OptionDetailModal.tsx`/`CostBreakdownModal.tsx`.
- [ ] `OptionCard` "Desde $X" — Acept.: precio núcleo con prefijo — Verif.: visual — Archivos: `OptionCard.tsx`.
- [ ] Verificación manual bloque A — Acept.: sin doble cobro, sin overflow 375px — Verif.: navegador — Archivos: n/a.

**Checkpoint 1** — presentar MDM funcionando antes de continuar.

**Bloque 3 (repricing, investigación)**
- [ ] Auditoría de tarifa horaria implícita — Acept.: tabla antes/después de los ~30 ítems — Verif.: revisión humana — Archivos: entregable en la conversación/PR, no en `data/`.
- [ ] Investigación de precio regional 2026 + tipo de cambio — Acept.: cifras con fuente citada — Verif.: revisión humana — Archivos: ídem.

**Checkpoint 2** — aprobar tabla antes de tocar `data/groups/*.ts` de SRV/NET/AUD/SUP.

**Bloque 4 (rollout + repricing aplicado)**
- [ ] `addons[]` en `srv.ts`, `net.ts` — Archivos: `data/groups/srv.ts`, `data/groups/net.ts`.
- [ ] `addons[]` en `aud.ts` (upgrade SIEM/EDR/pentest como deltas) — Archivos: `data/groups/aud.ts`.
- [ ] Addon de onboarding por volumen en `sup.ts` — Archivos: `data/groups/sup.ts`.
- [ ] Aplicar ajustes de precio aprobados (±10%, tipo de cambio, tcoRegional) — Archivos: `data/groups/*.ts`, `terms.ts`.
- [ ] Derivar inversión mínima — Archivos: `conditions.ts` (o fuente dinámica según se defina en el detalle técnico).
- [ ] Reemplazo de `text-[Npx]` restantes — Archivos: todos los componentes listados en "Alcance del rediseño visual".
- [ ] Pasada de redacción de microcopy — Archivos: `data/groups/*.ts`, componentes de labels/hints.
- [ ] Payload de addons en `/api/pdf`/`/api/decision` — Archivos: `lib/api.ts`, `server.js`.

**Bloque 5 (cierre)**
- [ ] Fila expandida final en `CanvasStep.tsx` — Archivos: `CanvasStep.tsx`.
- [ ] Verificación completa (typecheck/test/lint/manual/PDF) — Archivos: n/a.
- [ ] Checkpoint final + push bajo pedido explícito.

---

## Estado al 2026-07-02

**Hecho (typecheck limpio, lint limpio, 52/52 tests en verde):**
- Fix del bug "/año" en `CanvasStep.tsx` y `OptionsStep.tsx` (Año 1 y recurrente ya no se confunden).
- Escala tipográfica (`text-3xs/2xs/md` + defaults de Tailwind) reemplazando `text-[Npx]` en: `App.tsx`, `OptionsStep`, `IntroStep`, `DiagnosticStep`, `Overview`, `GlanceGrid`, `FeatureCardGrid`, `GroupSection`, `NoteBlock`, `TcoComparisonStep`, `OptionCard`, `Badge`, `FeatureList`, `CostBreakdownTable`, `AddonMenu`, `CostBreakdownModal`, `FeatureComparisonModal`, `WizardProgress`, `CanvasStep` (parcial).
- Bug de animación de salida corregido en `CostBreakdownModal`/`FeatureComparisonModal` (el `if (!isOpen) return null` antes de `AnimatePresence` impedía que la animación de cierre corriera); se agregó cierre con Escape, scroll-lock del body, y footer de total fijo (no se pierde de vista al scrollear en mobile).
- Modelo de addons completo: `AddonItem` (`includedInTiers`, `applicableTiers`, `recommended`), `computeTotals` con addons, hook `toggleAddon`, `AddonMenu` dentro del modal de detalle, tarjetas "Desde $X".
- Addons con trazabilidad 1:1 a montos ya existentes en 4 de 5 bloques: MDM (4 addons), Servidor (nodo HA $2.400), Red (punto de acceso $350), Auditoría (SIEM/XDR $1.320 + pentest $840). Soporte (D) queda pendiente — sus tiers son SLA no descomponibles, requiere el selector de cantidad de onboarding (ver Bloque 4, tarea pendiente).
- Canvas final (paso 12) ya muestra por bloque el tier + addons cobrados/incluidos + teaser de disponibles, con subtotal por fila que cuadra con el total superior, y layout de cards en mobile (sin tabla que desborde en 375px).
- Investigación de precio regional 2026 con fuentes (ver tabla abajo) — **sin aplicar todavía**.

**Pendiente de tu aprobación antes de tocar `data/`:**
1. Tipo de cambio: 6.250 Gs actual → cotización real ronda 6.076–6.140 Gs (rango trimestral 5.987–6.223). Propuesta: ajustar a ≈6.100 Gs en `terms.ts`.
2. Comparativa MDM SaaS regional ($82/disp/año): defendible solo si se cita SureMDM Enterprise explícitamente ($86,29 real); si se mantiene como "promedio regional" sin nombrar el vendor, el promedio de mercado real es $24–72 — más bajo. Decisión pendiente: ¿citar el vendor o bajar la cifra?
3. Resto de comparativas (SOC/SIEM, EDR, virtualización, soporte MSP, hardware de servidor): la investigación concluyó "mantener" en todos los casos — no requieren cambio, solo quedan documentadas con fuente por si se quiere citarlas en el PDF.

**Pendiente de trabajo (no bloqueado, solo falta tiempo/turnos):**
- Addon de Soporte (D): selector de cantidad para onboarding ejecutado por Alystech ($24/$19/$14 por dispositivo según volumen).
- Reemplazo de `text-[Npx]` restante en `layout/` (About, ActionBar, ConditionsAccordion, ConsultaModal, DecisionModal, Hero, NextSteps, StickyTotalBar, TermsFooter), `detail-modal/` y el resto de `CanvasStep.tsx` — quedó fuera del alcance de los agentes de esta tanda.
- `OptionCard.tsx`, `OptionDetailModal.tsx` y `GroupSection.tsx` (en `components/options/` y `components/detail-modal/`) están **actualmente sin uso** — `Wizard.tsx` renderiza todo a través de `OptionsStep.tsx`/`CostBreakdownModal.tsx`. Se actualizaron igual por prolijidad, pero conviene decidir si se eliminan o se documentan como código muerto intencional.
- Payload de addons en `/api/pdf`/`/api/decision` (server.js, lib/api.ts) — el PDF descargado todavía no refleja addons seleccionados.
- Pasada de redacción de microcopy pendiente en los 5 bloques.
- Verificación visual en navegador real: no se pudo automatizar en esta máquina (agent-browser dejó Chrome inestable en un intento anterior) — el servidor de desarrollo (`npm run dev`, puerto 5183) quedó corriendo para revisión manual.

---

## Estado al 2026-07-03

**Hecho (typecheck limpio, lint limpio, 55/55 tests en verde, build en verde):**
- Payload de addons en `/api/pdf`/`/api/decision` resuelto — `buildSelectionSummaries` (`lib/api.ts`) ahora acepta `addonSelections` y agrega una sección "Complementos seleccionados" en el PDF (`server.js`), sin duplicar cobros de addons ya incluidos en el tier. Tests nuevos en `lib/api.test.ts`.
- `DecisionModal`/`ConsultaModal`/`Modal.tsx` (formularios de aceptar/rechazar/consulta) rediseñados al sistema GlassPanel/ActionButton — antes seguían con el estilo pre-rediseño (`text-[12px]`, `text-navy`, `border-line`, botones/inputs sin componentizar), siendo la parte más crítica para conversión de toda la app.
- Reemplazo de `text-[Npx]` restante completado en `layout/` (About, ActionBar, ConditionsAccordion, Hero, NextSteps, StickyTotalBar, TermsFooter), `detail-modal/` y el resto de `CanvasStep.tsx`. Todo lo que queda con `text-[Npx]` en el repo es tamaño de ícono Material Symbols (legítimo, no es texto de cuerpo).
- Bug de datos encontrado y corregido en `TcoComparisonStep.tsx`: la card de Servidor mostraba cifras inventadas en JSX ("$3.200/año" licencias de virtualización) que no existen en `data/groups/srv.ts`, contradiciendo el dato real (comparativa de hardware). Se removió el override.
- Bug encontrado y corregido: el título de cada card de comparativa regional se truncaba con un `.split(' y ')[0]` ingenuo, produciendo títulos sin sentido ("Gestión y Blindaje de la Flota..." → solo "Gestión").
- Bug crítico de deploy encontrado y corregido: la mayoría de componentes importaba `motion/react`, pero `frontend/package.json` solo declaraba `framer-motion` — localmente resolvía por accidente vía un paquete `motion` instalado en la raíz del repo (ausente en el stage aislado de Docker). Se estandarizó todo a `framer-motion`. Esto habría roto el build de Coolify pese a funcionar en local.
- `vite` fijado a `7.3.6` — la versión `^8.1.1` resolvía a `8.1.3` (rolldown-vite), con una regresión confirmada aguas arriba (vitejs/vite#22835) que rompía el build de producción.
- `useReducedMotion`/`MotionConfig` de Framer Motion nunca se usaba pese al uso extensivo de `motion.*` — el override CSS de `prefers-reduced-motion` no alcanza a las animaciones JS de Framer Motion. Se agregó `<MotionConfig reducedMotion="user">` global en `main.tsx`.
- **12 archivos de código muerto eliminados** (cero imports verificados): `OptionCard.tsx`, `GroupSection.tsx`, `OptionDetailModal.tsx`, `GroupDetailModal.tsx`, `ComparisonMatrixTable.tsx`, y los 7 componentes de layout pre-wizard (`Hero`, `About`, `ConditionsAccordion`, `NextSteps`, `TermsFooter`, `ActionBar`, `StickyTotalBar`) — nunca se conectaron al flujo del wizard actual.
- Rediseño de `Shell`/`WizardHeader`/`WizardFooter` siguiendo una referencia Stitch actualizada provista por el usuario (`stitch_alystech_responsive_wizard_system (1)/code.html` + `screen.png`, 2026-07-03): header y footer pasan a ser píldoras flotantes (`fixed`, `rounded-2xl`) en todos los breakpoints; el footer ahora es oscuro y muestra el total corriente ("Inversión Año 1") junto a Atrás/Continuar. Cards de `OptionsStep`: precio "Desde $X", botón "Ver detalles" como píldora rellena, ícono reactivo al estado de selección (antes era estático por grupo, bug real).
- Otros bugs de coherencia visual corregidos: fuente Material Symbols nunca se importaba (íconos se veían como texto literal `arrow_back`); `.progress-segment` con `height: 2px` en vez de 8px; overlay de los 3 modales con el mismo `z-50` que el footer fijo, causando que el footer se viera por encima del modal; `bg-bg` resolviendo a casi negro (texto invisible en 2 secciones, ya eliminadas); `text-blue-light`/`text-slate-light` referenciadas pero nunca definidas.

**Pendiente, gateado explícitamente (no es descuido, requiere tu aprobación):**
1. Tipo de cambio y comparativa MDM SaaS regional (ver tabla arriba) — sin aplicar.
2. Inversión mínima de desarrollo — sigue fija en `conditions.ts`, no derivada dinámicamente.
3. Addon de Soporte (D) por volumen — no construido todavía.

**Deploy**: verificación local 100% en verde. Sin `git push` — el usuario confirmó explícitamente esperar antes de pushear ("todavía no, quiero revisar primero").

---

Documento vivo — se actualiza si alguna decisión cambia durante la implementación (ver "Keeping the Spec Alive").
