

# Plan: Ajustar la Paleta del Widget de OpenTable

## Situación Actual

El widget de OpenTable está configurado con:
- `type="standard"` 
- `theme="standard"`
- `color={5}` (este parámetro parece no tener efecto real)
- `dark={false}`

El fondo del contenedor ya usa el color Sand (#dad8c8) que combina bien con la marca.

## Opciones de Personalización de OpenTable

OpenTable ofrece estos temas de color:
- Standard (gris/neutro)
- Neutral
- Gold
- **Green** - verde que combinaría con Asparagus
- Blue
- Red
- **Teal** - verde azulado que combinaría bien con la paleta

## Cambio Propuesto

Cambiaré el widget para usar el tema **"teal"** o **"green"** que son los más cercanos al color Asparagus (#7A9A8A) de la marca Amana.

### Archivo a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/home/ReservationSection.tsx` | Cambiar `theme="standard"` por `theme="teal"` |

### Código Actualizado

```tsx
// Antes
<OpenTableWidget 
  type="standard" 
  theme="standard" 
  color={5} 
  dark={false} 
  className="flex justify-center items-center" 
/>

// Después
<OpenTableWidget 
  type="standard" 
  theme="teal" 
  color={5} 
  dark={false} 
  className="flex justify-center items-center" 
/>
```

También actualizaré el componente `OpenTableWidget.tsx` para que el tipo de `theme` incluya las opciones correctas de OpenTable.

## Resultado Visual

El widget tendrá un tono verde-azulado que armoniza mejor con:
- El fondo Sand del contenedor
- El color Asparagus usado en botones y acentos
- La paleta general de la marca Amana

