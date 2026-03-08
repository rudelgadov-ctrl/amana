
## Rotación de reseñas por sesión

**Problema actual:** Google Places API siempre devuelve el mismo conjunto fijo de 5 reseñas en el mismo orden. La caché de 1 hora hace que tampoco cambien dentro de una visita.

**Solución:** Mezclar aleatoriamente el orden en cada sesión de navegador, y para el caso del español (donde Google no tiene reseñas en ese idioma), ampliar el pool combinando más reseñas curadas para tener mayor variedad visible.

---

### Cambios técnicos

**1. `src/hooks/useGoogleReviews.ts`**
- Agregar una función `shuffleArray` que usa el algoritmo Fisher-Yates para mezclar arrays aleatoriamente.
- Aplicar el shuffle **después** de recibir los datos de Google, para que cada sesión muestre el orden diferente.
- El shuffle ocurre en el cliente (no afecta el caché del servidor).

**2. `src/components/home/ReviewsSection.tsx`**
- Para el **fallback en español**: ampliar de 6 a 10 reseñas curadas para que el shuffle tenga más variedad y los visitantes frecuentes vean combinaciones distintas.
- Aplicar `useMemo` con el shuffle para que el orden se calcule una vez al montar el componente (no cambia mientras el usuario navega por el carrusel, pero sí es diferente en cada carga de página).

---

### Resultado esperado

| Situación | Comportamiento |
|---|---|
| Inglés (reseñas reales de Google) | 5 reseñas en orden aleatorio diferente cada sesión |
| Español (fallback curado) | 10 reseñas mezcladas, el carrusel muestra variedad diferente en cada visita |
| Recarga de página | Nuevo orden aleatorio |
| Navegar por el carrusel | El orden se mantiene estable (no cambia mientras usas el carrusel) |

---

### Archivos a modificar

- `src/hooks/useGoogleReviews.ts` — agregar shuffle de resultados
- `src/components/home/ReviewsSection.tsx` — ampliar fallback en español + aplicar shuffle con `useMemo`
