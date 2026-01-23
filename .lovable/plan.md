

# Plan: Layout Dividido para Chef's Table

## Resumen

Transformaremos la sección del Chef's Table en un diseño editorial elegante con dos columnas: una imagen/ilustración decorativa en un lado y el contenido del menú degustación en el otro.

## Diseño Visual

```text
+--------------------------------------------------+
|                                                  |
|   +-----------------------+  +----------------+  |
|   |                       |  |                |  |
|   |    ILUSTRACION        |  |  Chef's Table  |  |
|   |    (ct-comida.png)    |  |  ------------- |  |
|   |                       |  |                |  |
|   |    Con animacion      |  |  1. Curso      |  |
|   |    flotante sutil     |  |  2. Curso      |  |
|   |                       |  |  3. Curso...   |  |
|   |                       |  |                |  |
|   |                       |  |  [RESERVAR]    |  |
|   +-----------------------+  +----------------+  |
|                                                  |
+--------------------------------------------------+
```

## Caracteristicas

1. **Lado Izquierdo - Panel Visual**
   - Imagen `ct-comida.png` o `chefs-table-illustration.png`
   - Animacion `float` sutil para darle vida
   - Efecto de resplandor (glow) con `asparagus` 
   - Altura completa para impacto visual

2. **Lado Derecho - Contenido del Menu**
   - Titulo "Chef's Table" 
   - Nota sobre disponibilidad
   - Lista numerada de los 7 cursos
   - Boton CTA de reservacion

3. **Responsivo**
   - Desktop: dos columnas lado a lado
   - Mobile: imagen arriba, contenido abajo (stacked)

---

## Detalles Tecnicos

### Archivo a Modificar
- `src/pages/Menu.tsx`

### Cambios Especificos

1. **Importar imagen**
   ```typescript
   import ctComidaImg from '@/assets/ct-comida.png';
   ```

2. **Reestructurar TabsContent del Chef's Table**
   - Cambiar de layout centrado a grid de 2 columnas
   - Agregar panel izquierdo con imagen animada
   - Mantener contenido del menu en panel derecho

3. **Clases de Tailwind a utilizar**
   - Layout: `grid grid-cols-1 lg:grid-cols-2 gap-8`
   - Imagen: `animate-float` (ya existe en el proyecto)
   - Glow: `bg-asparagus/20 blur-3xl animate-gentle-pulse`
   - Contenedor imagen: `relative flex items-center justify-center`

4. **Estructura del componente**
   ```tsx
   <div className="bg-blueberry rounded-lg overflow-hidden">
     <div className="grid grid-cols-1 lg:grid-cols-2">
       {/* Panel Visual */}
       <div className="relative bg-blueberry/50 p-8 flex items-center justify-center min-h-[400px]">
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-64 h-64 bg-asparagus/20 rounded-full blur-3xl animate-gentle-pulse" />
         </div>
         <img src={ctComidaImg} className="relative z-10 w-72 h-auto animate-float drop-shadow-2xl" />
       </div>
       
       {/* Panel Contenido */}
       <div className="p-8 md:p-12 text-center lg:text-left space-y-8">
         {/* Titulo, cursos, boton CTA */}
       </div>
     </div>
   </div>
   ```

5. **Ajustes de alineacion**
   - Texto centrado en mobile (`text-center`)
   - Texto alineado izquierda en desktop (`lg:text-left`)
   - Lista de cursos con items alineados apropiadamente

