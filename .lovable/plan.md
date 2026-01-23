

# Plan: Corregir las Categorías del Menú

## Problema Detectado
El menú no muestra ningún item porque hay una discrepancia entre las categorías definidas en el código y las que existen en la base de datos:

- **Código actual:** `starter`, `main`, `dessert`, `cocktail`, `low_alcohol`, `wine`
- **Base de datos:** `starters`, `mains`, `desserts`, `drinks` (con subcategorías)

## Solución

Actualizar el archivo `src/pages/Menu.tsx` para que las categorías coincidan con la estructura de la base de datos.

### Cambios necesarios:

1. **Actualizar `categoryLabels`** - Cambiar las claves para que coincidan:
   - `starter` → `starters`
   - `main` → `mains`  
   - `dessert` → `desserts`
   - Mantener `drinks` como categoría principal (no separar cocktail/wine)

2. **Actualizar `mainMenuCategories`** - Cambiar el array:
   ```
   Antes: ['starter', 'main', 'dessert']
   Después: ['starters', 'mains', 'desserts']
   ```

3. **Actualizar la lógica de bebidas** - Cambiar para usar `drinks` como categoría principal y filtrar por subcategorías (`cocktails`, `low_alcohol`, `white_wine`, `red_wine`, `rose_wine`, `sparkling_wine`)

4. **Corregir advertencia de React** - El componente `Skeleton` necesita usar `forwardRef` para evitar la advertencia en consola

---

## Detalles Técnicos

### Archivo: `src/pages/Menu.tsx`

**Líneas 10-18** - Actualizar categoryLabels:
```typescript
const categoryLabels: Record<string, { es: string; en: string }> = {
  starters: { es: 'Entradas', en: 'Starters' },
  mains: { es: 'Platos Fuertes', en: 'Mains' },
  desserts: { es: 'Postres', en: 'Desserts' },
  drinks: { es: 'Bebidas', en: 'Drinks' },
  chefs_table: { es: "Chef's Table", en: "Chef's Table" },
};
```

**Líneas 21-26** - Actualizar subcategoryLabels para vinos:
```typescript
const subcategoryLabels: Record<string, { es: string; en: string }> = {
  cocktails: { es: 'Cócteles', en: 'Cocktails' },
  low_alcohol: { es: 'Cócteles Bajos/Sin Alcohol', en: 'Low/No Alcohol' },
  red_wine: { es: 'Vino Tinto', en: 'Red Wine' },
  white_wine: { es: 'Vino Blanco', en: 'White Wine' },
  rose_wine: { es: 'Vino Rosado', en: 'Rosé Wine' },
  sparkling_wine: { es: 'Vino Espumante', en: 'Sparkling Wine' },
};
```

**Línea 72** - Actualizar mainMenuCategories:
```typescript
const mainMenuCategories = ['starters', 'mains', 'desserts'];
```

**Líneas 119-176** - Refactorizar sección de bebidas para iterar sobre subcategorías de `drinks`

### Archivo: `src/components/ui/skeleton.tsx`

Agregar `forwardRef` para eliminar la advertencia de React

