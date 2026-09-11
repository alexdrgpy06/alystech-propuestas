# Alystech Propuestas

## 📦 Producto vs 🔬 Laboratorio

**Producto comercial (lo que se vende):** `release-candidate/`
- Interactive Proposal Builder 0.1.0
- Paquete listo para entregar al cliente final
- Contiene: aplicación interactiva, documentación de ventas, scripts de construcción
- **Este es el producto que se entrega como ZIP comercial**

**Laboratorio de desarrollo (herramientas internas):** Raíz del repositorio
- Servidor Express para gestión de decisiones y consultas (`server.js`)
- Herramientas de construcción y despliegue (`build.py`, `Dockerfile`)
- Documentación interna del proyecto (`AUDIT.md`, `HANDOFF.md`, etc.)
- Configuración de desarrollo (`.env.example`, etc.)
- **Estas son herramientas internas, NO parte del producto vendido**

## 🚨 Importante para compradores y agentes

Al clonar este repositorio:
- El **producto** está exclusivamente en el directorio `release-candidate/`
- Todo lo demás en la raíz son **herramientas de laboratorio** usadas para construir, probar y gestionar el producto
- El ZIP comercial generado para entrega al cliente contiene **únicamente** lo que está en `release-candidate/`

## 📋 Cómo verificar qué es el producto

```bash
# Listar contenido del producto
ls -la release-candidate/

# Ver qué archivos serían incluidos en un paquete estándar
git ls-files

# Crear paquete de prueba del producto (excluyendo laboratorio)
cd release-candidate && zip -r ../product-preview.zip . && cd ..

# Ver contenido del paquete
unzip -l product-preview.zip
```

Para más detalles sobre el producto, ver:
- `release-candidate/README.md` - documentación del producto
- `RELEASE_CANDIDATE.md` - explicación adicional en la raíz
- `docs/QR_DEMO_VS_PACKAGE_DECISION.md` - precedente de cómo se resolvió ambigüedad similar