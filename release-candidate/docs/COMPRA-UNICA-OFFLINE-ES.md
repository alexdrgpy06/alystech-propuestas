# Compra única y uso offline

Este producto se entrega una sola vez como un ZIP de código fuente. No activa suscripciones, cuentas, telemetría, DRM, pagos ni llamadas obligatorias a servicios de terceros. El comprador conserva el ZIP, lo instala en su propio equipo y decide si lo hospeda por su cuenta.

## Uso sin conexión

Después de instalar dependencias con `npm ci`, ejecuta `npm run build` y `$env:PORT=5182; node server.mjs`. Abre `http://127.0.0.1:5182/`; la aplicación y el PDF funcionan localmente. Las configuraciones, selecciones y recibos quedan en el navegador actual. Exporta el JSON para respaldar o transferir una propuesta.

La primera instalación necesita el registro npm o una caché local/corporativa que contenga las dependencias del `package-lock.json`. Para una estación aislada, prepara previamente esa caché o copia una instalación verificada junto con sus dependencias; el ZIP comercial deliberadamente no incluye `node_modules`.

## Límites del producto

El paquete no entrega hosting, dominio, copia de seguridad, soporte, migración, acceso remoto, correo, CRM, pagos, firmas electrónicas, cumplimiento legal/fiscal ni protección de datos. Cada comprador debe evaluar estos servicios si los necesita.

## Derechos y avisos

El código de este paquete se distribuye bajo el archivo `LICENSE` incluido. Los componentes de terceros conservan sus propias licencias, identificadas en `LICENSES-THIRD-PARTY.md`. El precio de una compra única remunera la entrega y cualquier servicio acordado por el vendedor; no sustituye los avisos de licencia ni restringe derechos ya concedidos por una licencia de código abierto. Confirma la titularidad de cualquier marca, imagen, texto o configuración que agregues antes de distribuirla.
