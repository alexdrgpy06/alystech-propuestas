# Empieza aquí — Interactive Proposal Builder

1. Instala Node.js 20.19 o posterior.
2. Ejecuta `npm install`.
3. Ejecuta `npm test` y `npm run build`.
4. Ejecuta `npm run build` y `PORT=5182 node server.mjs` (PowerShell: `$env:PORT=5182; node server.mjs`).
5. Abre la URL local, elige un ejemplo, selecciona una opción y un complemento, abre el resumen y descarga el PDF.
6. En modo comercial, usa **Configurar propuesta**, guarda una copia local y exporta la configuración JSON.
7. Para revisar la experiencia de cliente, abre la URL con `?client=1`; para una prueba segura, usa `?demo=1`.

Los ejemplos son sintéticos. Las selecciones y recibos de decisión quedan en el navegador y no se envían automáticamente. El paquete no incluye hosting, pagos, CRM, firmas, correo, webhooks ni un servicio multi-evento.
