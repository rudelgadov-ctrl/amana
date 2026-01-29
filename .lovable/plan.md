

## Plan: Arreglar el parpadeo de textos al refrescar la página

### Problema identificado

Cuando refrescas la página, los textos aparecen mal por un momento porque:

1. La página se renderiza inmediatamente con textos "de respaldo" (hardcoded en el código)
2. Las traducciones del CMS se cargan desde el servidor (toma unos milisegundos)
3. Cuando llegan los textos del CMS, estos reemplazan a los de respaldo
4. Si son diferentes, se ve el "flash" o parpadeo

### Solución propuesta

Mostrar un estado de carga sutil mientras las traducciones están cargando, en lugar de mostrar textos que luego cambiarán.

**Opciones de implementación:**

| Opción | Descripción | Ventaja | Desventaja |
|--------|-------------|---------|------------|
| **A. Pantalla de carga mínima** | Mostrar el logo de Amana con una animación sutil mientras carga | Experiencia limpia, sin parpadeos | Pequeño retraso antes de ver contenido |
| **B. Skeleton/placeholder** | Mostrar "esqueletos" grises donde irían los textos | Usuario ve la estructura de la página | Más complejo de implementar |
| **C. Fade-in del contenido** | Esperar a tener los datos y hacer un fade-in suave | Transición elegante | Contenido no visible hasta que cargue |

**Recomendación:** Opción A - una pantalla de carga mínima y elegante con el logo de Amana que desaparece suavemente cuando las traducciones están listas.

---

### Detalles técnicos

**Archivos a modificar:**

1. **`src/components/layout/Layout.tsx`**
   - Agregar verificación del estado `isLoading` del LanguageContext
   - Mostrar un componente de carga cuando `isLoading === true`
   - Renderizar el contenido normal cuando las traducciones estén listas

2. **Crear `src/components/ui/LoadingScreen.tsx`** (nuevo)
   - Componente con el logo de Amana centrado
   - Animación sutil de "pulse" o "fade"
   - Fondo que coincida con la identidad visual del sitio

**Flujo técnico:**

```text
Usuario refresca  →  isLoading = true  →  Mostrar LoadingScreen
                           ↓
              Traducciones cargan del servidor
                           ↓
                    isLoading = false  →  Mostrar contenido real
```

**Código ejemplo del Layout modificado:**

```tsx
const Layout = ({ children }: LayoutProps) => {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
```

**Nota:** La carga es muy rápida (generalmente menos de 500ms) porque React Query tiene un cache de 5 minutos. Solo se verá en el primer refresh o cuando el cache expire.

