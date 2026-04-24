-- Tabla para gestionar categorías y subcategorías del menú
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label_es TEXT NOT NULL,
  label_en TEXT NOT NULL,
  parent_value TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (value, parent_value)
);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu categories"
ON public.menu_categories FOR SELECT
USING (true);

CREATE POLICY "CMS users can insert menu categories"
ON public.menu_categories FOR INSERT TO authenticated
WITH CHECK (can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update menu categories"
ON public.menu_categories FOR UPDATE TO authenticated
USING (can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete menu categories"
ON public.menu_categories FOR DELETE TO authenticated
USING (can_manage_content(auth.uid()));

CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: categorías principales (parent_value = NULL)
INSERT INTO public.menu_categories (value, label_es, label_en, parent_value, sort_order) VALUES
('starters', 'Entradas', 'Starters', NULL, 1),
('mains', 'Platos Fuertes', 'Main Courses', NULL, 2),
('desserts', 'Postres', 'Desserts', NULL, 3),
('drinks', 'Bebidas', 'Drinks', NULL, 4),
('chefs_table', 'Chef''s Table', 'Chef''s Table', NULL, 5);

-- Seed: subcategorías de bebidas
INSERT INTO public.menu_categories (value, label_es, label_en, parent_value, sort_order) VALUES
('cocktails', 'Cocteles', 'Cocktails', 'drinks', 1),
('low_alcohol', 'Cocteles Bajos/Sin Alcohol', 'Low/Non-Alcoholic', 'drinks', 2),
('red_wine', 'Vino Tinto', 'Red Wine', 'drinks', 3),
('white_wine', 'Vino Blanco', 'White Wine', 'drinks', 4),
('rose_wine', 'Vino Rosado', 'Rosé Wine', 'drinks', 5),
('sparkling_wine', 'Vino Espumante', 'Sparkling Wine', 'drinks', 6);