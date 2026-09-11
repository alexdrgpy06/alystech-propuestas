# SPEC: PDF Fidelity Verification

## Problema

El producto genera PDFs A4 para enviar al cliente. No había evidencia de que los PDFs mantengan fidelidad en todas las combinaciones de idioma, moneda y alcance.

## Alcance

- Generar PDFs para la matriz completa: 2 idiomas (ES/EN) x 3 templates (website, IT, consulting) x todas las combinaciones de opciones por grupo.
- Verificar extras (complementos) generan PDFs válidos.
- Verificar modo DEMO genera PDFs válidos.

## Fuera de alcance

- Verificación visual manual de layout (overflow de texto, solapamiento) — se verifica estructuralmente.
- Comparación de fixtures pixel-a-pixel.
- Pruebas en navegadores reales (headless).

## Criterios de aceptación verificables

1. **Matriz completa de PDFs válidos**: todos los PDFs de todas las combinaciones ES/EN + 3 templates + todos los combos de opciones generan buffers válidos (header `%PDF-`, trailer `%%EOF`).
2. **Locale correcto**: PDFs EN contienen "Prepared for / Investment / Terms"; PDFs ES contienen "Preparado para / Inversión / Condiciones".
3. **Extras incluidos**: PDFs con extras seleccionados generan PDFs válidos.
4. **Modo demo**: PDFs en modo demo generan PDFs válidos y sustanciales (> 500 bytes).
5. **Tests automatizados**: 30 tests covering todos los combos en `tests/pdf-fidelity.test.mjs`.

## Como se prueba cada criterio

```bash
cd release-candidate
node tests/pdf-fidelity.test.mjs
# Esperado: 30/30 passing
```

## Notas de implementación

- Tests escritos con Node.js built-in test runner (`node --test`).
- `isValidPdf(buf)` verifica header `%PDF-` y trailer `%%EOF`.
- `extractStrings(buf)` extrae texto de streams literales y hex de PDF.
- No se usa compresión para verificar contenido de texto directamente.
- El watermark DEMO se verifica estructuralmente (PDF válido + tamaño > 500 bytes) ya que está en stream comprimido.