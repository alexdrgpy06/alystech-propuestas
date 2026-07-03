# Handoff Document: Propuestas Técnicas — Alystech

Este documento detalla el estado actual del proyecto, la arquitectura, la lógica de cálculo financiero y los pasos recomendados para la siguiente etapa de desarrollo.

---

## 1. Arquitectura del Proyecto

* **Core**: React 18, TypeScript, Vite.
* **Estilos**: Tailwind CSS con un sistema de tokens configurado en `index.css`.
* **Layout Principal**: Single-page Wizard estructurado en 13 pasos independientes (diagnósticos y alternativas técnicas intercalados).
* **Enrutamiento**: Controlado por estado del asistente (`currentStep`) en `App.tsx`.

---

## 2. Estructura de Datos y Módulos

El contenido y costos de las alternativas técnicas se gestionan en archivos TypeScript estructurados en `frontend/src/data/groups/`:

* **Bloque A - Gestión Móvil** (`mdm.ts`): Plataforma MDM Knox (Base, Completa, A Medida, SureMDM Cloud).
* **Bloque B.1 - Servidores** (`srv.ts`): Servidores físicos (Rack Reacondicionado, Torre Nuevo Dell, HA Cluster).
* **Bloque B.2 - Red Perimetral** (`net.ts`): Conectividad y seguridad LAN (Existente, Básico, Completo, Premium SD-WAN).
* **Bloque C - Seguridad Informática** (`aud.ts`): Auditoría, remediación y monitoreo SIEM (Hardening, SIEM local, Antivirus EDR Enterprise, Pentesting).
* **Bloque D - Continuidad Operativa** (`sup.ts`): Abonos de soporte unificado (Básico, Estándar, Prioritario, Dedicado).

---

## 3. Lógica de Totales y Costos Anuales (`totals.ts`)

La sumatoria de los costos de la propuesta se realiza dinámicamente según la opción activa de cada bloque:

* **Inversión Año 1 (`totalUsd`)**: Es la suma del precio inicial (`priceUsd`) de cada opción seleccionada. Este costo ya incluye el hardware, licenciamiento del primer año y la ingeniería inicial de puesta en marcha.
* **Costo Recurrente Anual (`recurUsd`)**: Suma las suscripciones o abonos que se renuevan en los años 2 y 3.
  * **Soporte (D)**: Aporta su abono anual correspondiente.
  * **Auditoría/SIEM (C)**: Aporta el licenciamiento anual del Antivirus EDR o el agente SIEM según la opción.
  * **MDM (A)**: Si se selecciona SureMDM (MDM-D), aporta el licenciamiento cloud recurrente por dispositivo.

### Modelo Financiero a 3 Años (TCO)
En `TcoComparisonStep.tsx`, la comparativa excluye el hardware de adquisición para concentrarse en servicios profesionales:
* `alystechDev` (Costo único de desarrollo) = `totalUsd - hwUsd - recurUsd`
* `alystechSupport3Years` (3 años acumulados de soporte y abonos) = `recurUsd * 3`
* `alystechTotal3Years` = `alystechDev + alystechSupport3Years`

---

## 4. Mejoras Recientes Implementadas

* **Ficha de Detalles**: Agregamos un modal dinámico (`CostBreakdownModal.tsx`) que detalla la descripción, features específicas e inversión de cada opción.
* **Ajuste de Scroll y Overflow**: Removimos restricciones flexbox de centrado vertical forzado en `App.tsx` para evitar recortes tipográficos en pantallas compactas.
* **Tabla de Resumen Canvas**: Diseñamos una tabla simétrica en el paso final que agrupa las selecciones de forma ejecutiva con enlaces directos a sus detalles.

---

## 5. Próximos Pasos Recomendados

1. **Integración del Motor PDF**: Configurar la exportación final a PDF del Project Canvas detallado en el paso 13.
2. **Revisión de Textos con Cliente**: Validar con el cliente la redacción en tercera persona formal para asegurar alineación ejecutiva.
3. **Guardrails y Cláusulas**: Definir los términos legales y comerciales en la plantilla de contrato para anexarlos a la descarga del presupuesto.
