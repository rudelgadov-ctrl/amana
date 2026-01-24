
# Plan: Mostrar Reseñas Fallback en Español cuando no hay suficientes reseñas en español

## Problema Identificado
Actualmente, cuando el idioma del sitio es español pero la API de Google solo devuelve reseñas en inglés, el sistema muestra esas reseñas en inglés en lugar de usar las reseñas de respaldo (fallback) en español.

## Solucion Propuesta
Modificar la respuesta de la Edge Function para incluir un indicador de si se encontraron reseñas en el idioma preferido, y actualizar el frontend para usar las reseñas fallback cuando no haya reseñas en el idioma correcto.

## Cambios Necesarios

### 1. Edge Function: `supabase/functions/get-google-reviews/index.ts`
Agregar un campo `hasPreferredLanguageReviews` a la respuesta para indicar si se encontraron reseñas en el idioma solicitado.

**Cambios:**
- Agregar campo `hasPreferredLanguageReviews: boolean` en la respuesta
- Este campo sera `true` solo si hay al menos 2 reseñas en el idioma preferido

### 2. Hook: `src/hooks/useGoogleReviews.ts`
Actualizar la interfaz de respuesta para incluir el nuevo campo y pasarlo al frontend.

**Cambios:**
- Agregar `hasPreferredLanguageReviews` a la interfaz `ReviewsResponse`
- Retornar un objeto con `reviews` y `hasPreferredLanguageReviews` en lugar de solo el array

### 3. Componente: `src/components/home/ReviewsSection.tsx`
Modificar la logica para usar fallback cuando no hay reseñas en el idioma preferido.

**Cambios:**
- Actualizar la logica de seleccion de reseñas para verificar `hasPreferredLanguageReviews`
- Si `hasPreferredLanguageReviews` es `false` y el idioma es español, usar `fallbackReviews.es`

## Flujo de Datos Actualizado

```text
+-------------------+     +----------------------+     +-------------------+
| Usuario en ES     | --> | Edge Function        | --> | Frontend          |
+-------------------+     +----------------------+     +-------------------+
                          |                      |     |                   |
                          | Google tiene 5       |     | hasPreferred      |
                          | reseñas en EN,       |     | = false           |
                          | 0 en ES              |     |                   |
                          |                      |     | Usa fallback ES   |
                          | hasPreferred = false |     |                   |
                          +----------------------+     +-------------------+
```

## Detalles Tecnicos

### Edge Function - Respuesta modificada
```typescript
return new Response(
  JSON.stringify({ 
    reviews: finalReviews,
    total: finalReviews.length,
    preferredLanguage,
    hasPreferredLanguageReviews: preferredLanguageReviews.length >= 2,
  }),
  // ...
);
```

### Hook - Interface actualizada
```typescript
interface GoogleReviewsResult {
  reviews: GoogleReview[];
  hasPreferredLanguageReviews: boolean;
}

export const useGoogleReviews = (language: 'es' | 'en') => {
  return useQuery({
    queryKey: ['google-reviews', language],
    queryFn: async (): Promise<GoogleReviewsResult> => {
      // ...
      return {
        reviews: data?.reviews || [],
        hasPreferredLanguageReviews: data?.hasPreferredLanguageReviews ?? false,
      };
    },
    // ...
  });
};
```

### Componente - Logica de seleccion
```typescript
const { data: googleReviewsData, isLoading, error } = useGoogleReviews(language);

// Usar fallback si:
// 1. No hay reseñas de Google
// 2. O no hay reseñas en el idioma preferido
const shouldUseFallback = 
  !googleReviewsData?.reviews?.length || 
  !googleReviewsData?.hasPreferredLanguageReviews;

const reviews = shouldUseFallback 
  ? fallbackReviews[language]
  : googleReviewsData.reviews.map(review => ({
      id: review.id,
      name: review.name,
      text: review.text,
      rating: review.rating,
      photoUrl: review.photoUrl || '',
      relativeTime: review.relativeTime || ''
    }));
```

## Resultado Esperado
- Cuando el usuario esta en español y Google tiene reseñas en español: se muestran las reseñas de Google
- Cuando el usuario esta en español pero Google solo tiene reseñas en ingles: se muestran las reseñas fallback en español
- Cuando el usuario esta en ingles: mismo comportamiento (fallback en ingles si no hay reseñas en ingles)
