-- ===========================================
-- CMS SCHEMA FOR AMANA RESTAURANT
-- ===========================================

-- 1. Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Create menu_items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  price TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create site_images table
CREATE TABLE public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text_es TEXT,
  alt_text_en TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create site_translations table
CREATE TABLE public.site_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL,
  text_es TEXT NOT NULL,
  text_en TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create restaurant_info table
CREATE TABLE public.restaurant_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  value_type TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===========================================
-- HELPER FUNCTIONS (Security Definer)
-- ===========================================

-- Check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- Check if user has editor role
CREATE OR REPLACE FUNCTION public.is_editor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'editor'
  )
$$;

-- Check if user can manage content (admin or editor)
CREATE OR REPLACE FUNCTION public.can_manage_content(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_info ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- RLS POLICIES FOR user_roles (Admin only)
-- ===========================================

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ===========================================
-- RLS POLICIES FOR menu_items (Public read, CMS write)
-- ===========================================

CREATE POLICY "Anyone can view menu items"
ON public.menu_items FOR SELECT
USING (true);

CREATE POLICY "CMS users can insert menu items"
ON public.menu_items FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update menu items"
ON public.menu_items FOR UPDATE
TO authenticated
USING (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete menu items"
ON public.menu_items FOR DELETE
TO authenticated
USING (public.can_manage_content(auth.uid()));

-- ===========================================
-- RLS POLICIES FOR site_images (Public read, CMS write)
-- ===========================================

CREATE POLICY "Anyone can view site images"
ON public.site_images FOR SELECT
USING (true);

CREATE POLICY "CMS users can insert site images"
ON public.site_images FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update site images"
ON public.site_images FOR UPDATE
TO authenticated
USING (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete site images"
ON public.site_images FOR DELETE
TO authenticated
USING (public.can_manage_content(auth.uid()));

-- ===========================================
-- RLS POLICIES FOR site_translations (Public read, CMS write)
-- ===========================================

CREATE POLICY "Anyone can view translations"
ON public.site_translations FOR SELECT
USING (true);

CREATE POLICY "CMS users can insert translations"
ON public.site_translations FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update translations"
ON public.site_translations FOR UPDATE
TO authenticated
USING (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete translations"
ON public.site_translations FOR DELETE
TO authenticated
USING (public.can_manage_content(auth.uid()));

-- ===========================================
-- RLS POLICIES FOR restaurant_info (Public read, CMS write)
-- ===========================================

CREATE POLICY "Anyone can view restaurant info"
ON public.restaurant_info FOR SELECT
USING (true);

CREATE POLICY "CMS users can insert restaurant info"
ON public.restaurant_info FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update restaurant info"
ON public.restaurant_info FOR UPDATE
TO authenticated
USING (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete restaurant info"
ON public.restaurant_info FOR DELETE
TO authenticated
USING (public.can_manage_content(auth.uid()));

-- ===========================================
-- STORAGE BUCKET FOR SITE IMAGES
-- ===========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

-- Storage policies for site-images bucket
CREATE POLICY "Anyone can view site images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "CMS users can upload to site images bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images' 
  AND public.can_manage_content(auth.uid())
);

CREATE POLICY "CMS users can update site images bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images' 
  AND public.can_manage_content(auth.uid())
);

CREATE POLICY "CMS users can delete from site images bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-images' 
  AND public.can_manage_content(auth.uid())
);

-- ===========================================
-- TRIGGER FOR UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_translations_updated_at
BEFORE UPDATE ON public.site_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_info_updated_at
BEFORE UPDATE ON public.restaurant_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();