# Spec: Clarificar qué es el producto (release-candidate/) vs laboratorio (repo raiz)

## Contexto

El issue #7 plantea una ambigüedad entre dos componentes en el repositorio:
- El producto que se vende: `release-candidate/` (interactive-proposal-builder 0.1.0, 28 tests, offline)
- El repo raiz: un servidor Express con `pdfkit` y `nodemailer`

Esta es la misma clase de problema que ya tuvo QR y que resolvió haciendo que el demo público sea el paquete (ver `docs/QR_DEMO_VS_PACKAGE_DECISION.md` en `whop-product-lab` como precedente).

## Assumptions (corregir si alguna es incorrecta)

1. El producto comercial es exclusivamente lo contenido en `release-candidate/` 
2. El servidor Express en la raiz es una herramienta de laboratorio o desarrollo, no parte del producto vendido
3. Cualquier cosa en la raiz que no sea estrictamente necesaria para construir/empaquetar/validar el producto debe excluirse del artefacto comercial
4. El README debe comunicar claramente en la primera pantalla qué es cada cosa

## Objective

Resolver la ambigüedad entre el producto y el laboratorio mediante:
1. Documentar explícitamente qué es cada cosa
2. Actualizar el README raiz para que quede claro en la primera pantalla
3. Excluir el laboratorio del artefacto comercial ZIP si corresponde (como hizo QR)
4. Proveer evidencia reproducible de que el ZIP comercial no contiene lo que no es producto

## Tech Stack

- Ninguno (tarea de documentación y configuración)
- Posiblemente `git` y `.gitattributes` para exclusión de archivos

## Commands

```
# Para verificar el contenido del producto
ls -la release-candidate/

# Para verificar lo que se incluiría en un zip
git ls-files

# Para crear un zip de prueba del producto
cd release-candidate && zip -r ../product-test.zip . && cd ..

# Para verificar lo que contiene el zip
unzip -l product-test.zip
```

## Alcance

**Incluye:**
- Escribir documentación clara en el README raiz sobre qué es producto vs laboratorio
- Actualizar `.gitattributes` si es necesario para excluir archivos de laboratorio del ZIP comercial
- Verificar que el ZIP resultante contiene solo el producto

**Excluye:**
- Modificar el código del producto o del laboratorio
- Cambiar la funcionalidad de cualquiera de los dos componentes
- Hacer cambios en otros repositorios

## Testing Strategy

- Verificar visualmente que el README comunica claramente la distinción
- Verificar que `git ls-files` muestra qué archivos serían incluidos
- Verificar que un ZIP creado siguiendo las convenciones contiene solo lo esperado
- Comparar con el ZIP actual para confirmar mejoras

## Boundaries

- **Siempre:** ser preciso y factual en la documentación
- **Preguntar primero:** antes de hacer cambios que afecten cómo se construye o distribuye el producto
- **Nunca:** asumir que algo es parte del producto sin verificarlo contra los requerimientos comerciales

## Success Criteria

- Un recién llegado que clona el repo entiende en 30 segundos cuál es el producto (`release-candidate/`)
- El ZIP comercial generado siguiendo las prácticas del repo no contiene el laboratorio/servidor Express
- El README raiz comunica claramente en la primera pantalla qué es cada cosa

## Open Questions

- ¿El servidor Express en la raiz tiene algún propósito en el flujo de construcción/validación del producto que requiera que quede incluido en ciertos artifacts pero no en otros?
- ¿Hay scripts o configuraciones en la raiz que son necesarios para construir el producto pero no parte del producto mismo?

## Implementation Plan

1. **Investigación:** Examinar qué contiene exactamente `release-candidate/` y qué contiene la raiz
2. **Documentación:** Actualizar README raiz con explicación clara
3. **Configuración:** Determinar si se necesita `.gitattributes` para excluir laboratorio del ZIP comercial
4. **Verificación:** Crear ZIP de prueba y validar su contenido
5. **Evidencia:** Proveer comandos exactos y su salida como evidencia en el issue