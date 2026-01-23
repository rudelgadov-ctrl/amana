

# Plan: Corregir la Visualización del Chef's Table

## Problema Detectado

La sección Chef's Table no muestra correctamente la información porque:

1. El código actual itera sobre `chefsTableItems` esperando **múltiples items** (uno por cada tiempo)
2. La base de datos tiene **un solo item** con todos los tiempos en el campo `description`
3. Solo se muestra el nombre "Menú de 7 Tiempos" en lugar de los 7 tiempos individuales
4. El precio aparece suelto sin formato

**Datos en la base de datos:**
- Nombre: "Menú de 7 Tiempos" / "7-Course Tasting Menu"
- Descripción: Lista separada por comas con los 7 tiempos
- Precio: ₡65,000

## Solución

Modificar la lógica de renderizado para:
1. Parsear la descripción del item y separar los tiempos por comas
2. Mostrar cada tiempo como un elemento numerado
3. Mostrar el precio con formato apropiado

---

## Detalles Técnicos

### Archivo: `src/pages/Menu.tsx`

**Cambios en la sección Chef's Table (líneas 189-219):**

1. Obtener el primer (y único) item del Chef's Table
2. Parsear la descripción separando por comas para obtener los tiempos individuales
3. Mostrar el nombre del menú como subtítulo
4. Renderizar cada tiempo con su número correspondiente
5. Mostrar el precio con estilo destacado

```text
Antes:
- Se iteraba sobre chefsTableItems mostrando item.name_es/name_en
- El precio se mostraba suelto sin formato

Después:
- Se obtiene chefsTableItems[0] 
- Se parsea description_es/description_en.split(', ')
- Se muestra el nombre del menú como título secundario
- Cada tiempo parseado se muestra numerado
- El precio se muestra con estilo prominente (texto grande, color destacado)
```

### Código propuesto:

```typescript
{chefsTableItems.length > 0 && (() => {
  const item = chefsTableItems[0];
  const description = language === 'es' ? item.description_es : item.description_en;
  const courses = description ? description.split(', ') : [];
  
  return (
    <div className="max-w-md mx-auto space-y-6">
      <h4 className="font-display text-xl text-asparagus">
        {language === 'es' ? item.name_es : item.name_en}
      </h4>
      <ul className="space-y-3">
        {courses.map((course, index) => (
          <li key={index} className="font-body text-wafer flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-asparagus/30 flex items-center justify-center text-sm text-eggshell">
              {index + 1}
            </span>
            {course.trim()}
          </li>
        ))}
      </ul>
      {item.price && (
        <p className="font-display text-2xl text-asparagus mt-6">
          {item.price}
        </p>
      )}
    </div>
  );
})()}
```

## Resultado Esperado

La sección Chef's Table mostrará:
1. **Título:** "Chef's Table"
2. **Nota:** Información sobre disponibilidad
3. **Subtítulo:** "Menú de 7 Tiempos"
4. **Lista numerada:**
   - 1. Amuse-bouche del día
   - 2. Ceviche de temporada
   - 3. Sopa o crema de la casa
   - 4. Intermezzo de cítricos
   - 5. Plato principal del chef
   - 6. Pre-postre
   - 7. Postre de la casa
5. **Precio:** ₡65,000 (con estilo destacado)
6. **Botón:** Reservar

