

# Plan: Arreglar el mapeo de traducciones del CMS

## Problema Identificado

Las traducciones se guardan correctamente en la base de datos, pero no se muestran en el Hero porque hay un **desajuste en el formato de las claves**.

### Cómo se almacenan en la base de datos:
| section | key |
|---------|-----|
| hero | hero.ctaMenu |
| hero | hero.location |
| hero | hero.title |

### Cómo el código las busca:
El sistema busca `translationsMap['hero']['ctaMenu']`, pero la clave real almacenada es `hero.ctaMenu` (con el prefijo duplicado).

---

## Solución Propuesta

Modificar el hook `useTranslations.ts` para **extraer solo la parte de la clave después del punto**, eliminando el prefijo redundante de la sección.

### Cambio en `src/hooks/useTranslations.ts`:

```typescript
(data as TranslationRow[]).forEach((row) => {
  if (!translationsMap[row.section]) {
    translationsMap[row.section] = {};
  }
  
  // Extraer solo la parte después del punto (ej: "hero.ctaMenu" → "ctaMenu")
  const keyPart = row.key.includes('.') 
    ? row.key.split('.').slice(1).join('.') 
    : row.key;
  
  translationsMap[row.section][keyPart] = {
    es: row.text_es,
    en: row.text_en,
  };
});
```

---

## Archivos a Modificar

1. **`src/hooks/useTranslations.ts`** - Ajustar el parseo de claves para remover el prefijo de sección

---

## Resultado Esperado

- Los cambios realizados en el CMS de Traducciones se reflejarán inmediatamente en el Hero y todas las demás secciones del sitio
- No se requieren cambios en la base de datos ni en el CMS
- El sistema seguirá funcionando con el caché de 5 minutos de React Query

