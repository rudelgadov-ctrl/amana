

## Simplificar reseñas a formato manual

Eliminar toda la integración con Google Places API y dejar las reseñas como datos estáticos definidos directamente en el componente.

### Cambios

**1. `src/components/home/ReviewsSection.tsx`**
- Eliminar imports de `useGoogleReviews`, `Skeleton`, `Avatar`, `useMemo`
- Eliminar el estado de loading/error y la lógica de merge con Google
- Dejar un array simple de reseñas por idioma (ES/EN) que se pueda editar directamente en el archivo
- Mantener el shuffle por sesión con `useMemo` para variedad
- Mantener el diseño visual actual del carrusel (estrellas, tarjetas, etc.)

**2. Eliminar `src/hooks/useGoogleReviews.ts`**
- Ya no se necesita

**3. Eliminar `supabase/functions/get-google-reviews/index.ts`**
- Ya no se necesita la edge function

### Estructura resultante

```tsx
const reviews = {
  es: [
    { id: '1', name: 'María García', text: '...', rating: 5, relativeTime: '...' },
    // ... editar aquí directamente
  ],
  en: [
    { id: '1', name: 'Nancy Tan', text: '...', rating: 5, relativeTime: '...' },
    // ... editar aquí directamente
  ],
};
```

Para agregar/quitar/editar reseñas, simplemente se modifica ese objeto en el archivo.

### Archivos a modificar/eliminar
- `src/components/home/ReviewsSection.tsx` — simplificar, quitar integración Google
- `src/hooks/useGoogleReviews.ts` — eliminar
- `supabase/functions/get-google-reviews/index.ts` — eliminar

