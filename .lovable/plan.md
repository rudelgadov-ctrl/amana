
# Plan: Corregir la Discrepancia de Categorías entre el CMS y la Página Pública del Menú

## Diagnóstico del Problema

He identificado que el Admin CMS y la página pública del Menú usan **diferentes estructuras de categorías** para las bebidas:

| CMS Admin (actual) | Base de Datos (correcta) | Página Pública (esperada) |
|-------------------|--------------------------|---------------------------|
| `cocktails` | `drinks` + subcategory `cocktails` | `drinks` + `cocktails` |
| `lowAlcohol` | `drinks` + subcategory `low_alcohol` | `drinks` + `low_alcohol` |
| `wines` + sub `red` | `drinks` + subcategory `red_wine` | `drinks` + `red_wine` |

Los items de bebidas creados desde el CMS **no aparecen** en la página pública porque el CMS guarda `category: 'cocktails'` en lugar de `category: 'drinks'` + `subcategory: 'cocktails'`.

## Solución

Actualizar el Admin CMS (`src/pages/admin/AdminMenu.tsx`) para que use la misma estructura de categorías que la página pública.

### Cambios a realizar:

1. **Actualizar el listado de categorías principales**:
   - Mantener: `starters`, `mains`, `desserts`, `chefs_table`
   - Agregar: `drinks` (para todas las bebidas)
   - Eliminar: `cocktails`, `lowAlcohol`, `wines`

2. **Agregar subcategorías para bebidas**:
   - `cocktails` - Cócteles
   - `low_alcohol` - Bajo/Sin Alcohol
   - `red_wine` - Vino Tinto
   - `white_wine` - Vino Blanco
   - `rose_wine` - Vino Rosado
   - `sparkling_wine` - Vino Espumante

3. **Modificar la lógica del formulario**:
   - Mostrar selector de subcategoría cuando `category === 'drinks'`
   - Guardar correctamente `category: 'drinks'` + la subcategoría seleccionada

4. **Actualizar el filtro de categorías** para incluir las nuevas opciones

---

## Sección Técnica

### Archivo a modificar:
`src/pages/admin/AdminMenu.tsx`

### Cambios específicos:

```text
1. Líneas 30-37: Reemplazar el array `categories` con:
   - starters (Entradas)
   - mains (Platos Fuertes)  
   - desserts (Postres)
   - drinks (Bebidas)
   - chefs_table (Chef's Table)

2. Líneas 39-44: Reemplazar `wineSubcategories` con `drinksSubcategories`:
   - cocktails (Cócteles)
   - low_alcohol (Bajo/Sin Alcohol)
   - red_wine (Vino Tinto)
   - white_wine (Vino Blanco)
   - rose_wine (Vino Rosado)
   - sparkling_wine (Vino Espumante)

3. Líneas 119-122: Actualizar lógica de guardado
   - Cambiar condición de 'wines' a 'drinks'

4. Líneas 253-270: Actualizar condición del selector de subcategoría
   - Cambiar de 'wines' a 'drinks'
   - Usar las nuevas subcategorías de bebidas
```

### Resultado esperado:
- Los nuevos items de bebidas creados desde el CMS aparecerán correctamente en la página pública
- La estructura de datos será consistente entre el CMS y el frontend
- Los items existentes de bebidas (que ya tienen el formato correcto) seguirán funcionando
