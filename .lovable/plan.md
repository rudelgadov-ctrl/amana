

# Reemplazar Imagen del Chef Kenneth

## Descripción

Reemplazar la foto actual del Chef Kenneth en la página "About" con la nueva imagen profesional en blanco y negro que muestra al chef trabajando en la cocina con un atún.

## Cambios a Realizar

### 1. Copiar la Nueva Imagen

Copiar la imagen subida (`DSC8846.jpg`) a la carpeta de assets del proyecto, reemplazando o renombrando según sea necesario.

**Ubicación destino:** `src/assets/chef-kenneth.jpg`

### 2. Actualizar la Referencia (si es necesario)

El archivo `src/pages/About.tsx` ya importa la imagen como:
```typescript
import chefKennethImg from '@/assets/chef-kenneth.jpg';
```

Si reemplazamos el archivo directamente con el mismo nombre (`chef-kenneth.jpg`), no se requieren cambios en el código.

## Archivos Afectados

| Archivo | Acción |
|---------|--------|
| `src/assets/chef-kenneth.jpg` | Reemplazar con la nueva imagen |

## Resultado Esperado

La sección del Chef en la página "About" mostrará la nueva foto en blanco y negro del chef trabajando con el atún, en lugar de la imagen anterior.

---

## Detalles Técnicos

- La nueva imagen se importará como módulo ES6 a través del bundler de Vite
- El formato JPG es compatible y se optimizará automáticamente durante el build
- La imagen mantiene el aspect ratio de 3/4 definido en el contenedor CSS

