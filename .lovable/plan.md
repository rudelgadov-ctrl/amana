

# Plan: Sección de Próximos Eventos con CMS

## Resumen
Agregaremos una sección de "Próximos Eventos" dentro de la franja azul de reservaciones, conectada al CMS para que puedas agregar, editar y eliminar eventos fácilmente con soporte bilingue (ES/EN).

## Diseño Visual

La sección se verá así dentro de la franja azul:

```text
┌─────────────────────────────────────────────────────┐
│                  Reserva tu Mesa                     │
│              [Widget de OpenTable]                   │
│     Para grupos de 14+... [Botón WhatsApp]           │
│─────────────────────────────────────────────────────│
│                                                      │
│                  Próximos Eventos                    │
│                                                      │
│              14 de febrero                           │
│            Menú de San Valentín                      │
│                                                      │
│               8 de marzo                             │
│          Cena del Día de la Mujer                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

Cada evento mostrara:
- **Fecha**: texto normal, color claro
- **Nombre del evento**: texto destacado/negrita

## Cambios a Implementar

### 1. Nueva tabla en la base de datos: `events`

Crearemos una tabla con estos campos:
- `id` - identificador unico
- `date_text_es` - fecha en espanol (ej: "14 de febrero")
- `date_text_en` - fecha en ingles (ej: "February 14")
- `title_es` - nombre del evento en espanol
- `title_en` - nombre del evento en ingles
- `is_active` - para activar/desactivar eventos
- `sort_order` - para ordenar los eventos
- `created_at`, `updated_at` - timestamps

Las politicas de seguridad (RLS) seran:
- Lectura publica para mostrar en el sitio
- Escritura solo para usuarios del CMS (admin/editor)

### 2. Nuevo hook: `useEvents`

Un hook de React para obtener los eventos activos desde la base de datos, similar a como funcionan `useMenuItems` y `useTranslations`.

### 3. Nueva seccion de administracion: `/admin/events`

Una pagina en el CMS con:
- Lista de eventos existentes
- Boton "Agregar Evento"
- Campos para fecha (ES/EN) y titulo (ES/EN)
- Toggle para activar/desactivar
- Arrastrar para reordenar (o campo de orden)
- Botones de editar/eliminar

### 4. Actualizar el componente `ReservationSection`

Expandiremos la seccion azul para incluir:
- Titulo "Proximos Eventos" / "Upcoming Events"
- Lista de eventos desde la base de datos
- Solo se muestra si hay eventos activos

### 5. Agregar "Eventos" al menu lateral del CMS

Nuevo item en el sidebar con icono de calendario.

### 6. Agregar traducciones para los textos fijos

Nuevas entradas en `site_translations`:
- `events.title` = "Proximos Eventos" / "Upcoming Events"

---

## Detalles Tecnicos

### Migracion SQL

```sql
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date_text_es TEXT NOT NULL,
  date_text_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Politica de lectura publica
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

-- Politicas de escritura para CMS
CREATE POLICY "CMS users can insert events"
  ON public.events FOR INSERT
  WITH CHECK (can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update events"
  ON public.events FOR UPDATE
  USING (can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete events"
  ON public.events FOR DELETE
  USING (can_manage_content(auth.uid()));
```

### Archivos a crear

| Archivo | Descripcion |
|---------|-------------|
| `src/hooks/useEvents.ts` | Hook para obtener eventos |
| `src/pages/admin/AdminEvents.tsx` | Pagina de gestion de eventos |
| `src/components/home/UpcomingEventsSection.tsx` | Componente que muestra los eventos |

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/home/ReservationSection.tsx` | Agregar UpcomingEventsSection debajo |
| `src/components/admin/AdminSidebar.tsx` | Agregar enlace a Eventos |
| `src/App.tsx` | Agregar ruta `/admin/events` |
| `src/contexts/LanguageContext.tsx` | Agregar traducciones de eventos |
| `src/components/admin/AdminLayout.tsx` | Agregar invalidacion de cache de eventos |

---

## Resultado Final

Podras gestionar eventos desde el CMS asi:

1. Ir a **Eventos** en el menu lateral
2. Click en **Agregar Evento**
3. Llenar:
   - Fecha ES: "14 de febrero"
   - Fecha EN: "February 14"
   - Titulo ES: "Menu de San Valentin"
   - Titulo EN: "Valentine's Day Menu"
4. Guardar

El evento aparecera automaticamente en el sitio publico, dentro de la seccion azul de reservaciones.

