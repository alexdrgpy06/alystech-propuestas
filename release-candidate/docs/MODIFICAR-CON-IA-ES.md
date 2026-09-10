# Guía para modificar el producto con IA

## Antes de editar

1. Descomprime el ZIP en una carpeta de trabajo y ejecuta `npm ci`, `npm test` y `npm run build`.
2. Crea una copia de la configuración desde **Configurar propuesta → Exportar JSON**. No reemplaces el ejemplo sintético original.
3. Pide a la IA que modifique solamente `release-candidate` y que conserve `package-lock.json` salvo que justifique una dependencia nueva.

## Cambios que se pueden hacer desde la interfaz

En modo comercial, **Configurar propuesta** permite cambiar vendedor, cliente, título, texto descriptivo, moneda, color, condiciones, opciones, complementos y precios. Guarda o exporta el JSON. Para mover una propuesta a otro equipo, importa ese archivo JSON en el navegador destino.

## Cambios de código frecuentes

- Ejemplos base: `src/templates.mjs`.
- Traducciones de los ejemplos: `src/templateLocales.mjs`.
- Cálculos, validación y reglas de complementos: `src/domain.mjs`.
- Interfaz: `src/App.jsx` y `src/style.css`.
- PDF: `pdf.mjs`; endpoint local: `server.mjs`; endpoint de Vercel: `api/pdf.js`.

No pongas claves, contraseñas, logotipos de terceros sin permiso, datos de clientes ni precios confidenciales en el repositorio o el ZIP.

## Prompt sugerido

> Trabaja solamente en este paquete. Quiero adaptar el ejemplo `website-example` para [tipo de negocio]. Conserva la separación entre inversión inicial y cargo anual. No agregues servicios externos, seguimiento, analítica, pagos, cuentas, correos ni webhooks. Mantén todos los datos de ejemplo sintéticos. Describe los archivos que cambiarás, actualiza las pruebas pertinentes y ejecuta `npm test` y `npm run build`.

## Verificación antes de entregar

Ejecuta `npm test`, `npm run build` y `npm audit --omit=dev --package-lock-only`. Revisa `LISTING-ES.md`, `LICENSE` y `docs/LICENSES-THIRD-PARTY.md` si agregas una dependencia. Luego ejecuta `scripts/Build-OfflinePackage.ps1` para crear el ZIP limpio.
