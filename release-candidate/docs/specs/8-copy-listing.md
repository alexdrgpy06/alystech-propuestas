# SPEC: Copy Listing Verification Against Offline Package

## Problema

`LISTING-EN.md` y `LISTING-ES.md` no se contrastaron contra el paquete offline `interactive-proposal-builder-0.1.0-offline.zip` con evidencia automatizada.

## Alcance

- Claim por claim: verificar cada feature listada existe en el paquete.
- Verificar que el producto funciona offline: sin requests externas, sin backend.
- Verificar que el copy de listing (ES y EN) es una traducción completa y fiel.

## Fuera de alcance

- Pruebas visuales en navegador real (headless browser).
- Verificación pixel-perfect de layout.

## Criterios de aceptación verificables

1. **Archivos listados existen**: package.json, package-lock.json, LICENSE, src/templates.mjs, src/templateLocales.mjs, src/domain.mjs, src/App.jsx, pdf.mjs, server.mjs, api/pdf.js, tests/*.test.mjs, docs/MODIFY-WITH-AI-EN.md, docs/ONE-TIME-PURCHASE-OFFLINE-EN.md, docs/LICENSES-THIRD-PARTY.md.
2. **Tres ejemplos sintéticos**: website-example, it-example, consulting-example en templates.mjs.
3. **Ruteo ES/EN**: server.mjs maneja /es/ y /en/.
4. **Editor comercial**: App.jsx contiene campos para seller, client, currency, color, price, annual.
5. **Import/Export JSON**: App.jsx tiene botones de exportar JSON y input de importar JSON.
6. **Recibos locales**: domain.mjs exporta función `decision()` para recibos.
7. **PDF A4**: pdf.mjs usa tamaño 'A4'.
8. **Node.js 20.19+**: package.json engines especifica ">=20.19".
9. **Sin cuentas/pagos obligatorios**: LISTING no menciona subscriptions ni accounts obligatorios.
10. **Traducción completa**: LISTING-ES.md tiene el mismo número de líneas que LISTING-EN.md y las secciones corresponden correctamente.

## Como se prueba cada criterio

```bash
cd release-candidate
node tests/listing.test.mjs
# Esperado: 28/28 passing
```

## Notas de implementación

- Tests escritos con Node.js built-in test runner (`node --test`).
- `list()` recursivo verifica existencia de archivos.
- Verificación de network: la app usa solo localStorage y fetch a /api/pdf local — sin URLs externas en server.mjs ni App.jsx.
- El claim "sin backend" se verifica por ausencia de URLs externas en el código del servidor y la UI.