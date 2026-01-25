-- Drop existing RESTRICTIVE policies on site_translations
DROP POLICY IF EXISTS "Anyone can view translations" ON public.site_translations;
DROP POLICY IF EXISTS "CMS users can delete translations" ON public.site_translations;
DROP POLICY IF EXISTS "CMS users can insert translations" ON public.site_translations;
DROP POLICY IF EXISTS "CMS users can update translations" ON public.site_translations;

-- Recreate as PERMISSIVE policies (default behavior)
CREATE POLICY "Anyone can view translations"
ON public.site_translations
FOR SELECT
TO public
USING (true);

CREATE POLICY "CMS users can insert translations"
ON public.site_translations
FOR INSERT
TO authenticated
WITH CHECK (can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update translations"
ON public.site_translations
FOR UPDATE
TO authenticated
USING (can_manage_content(auth.uid()))
WITH CHECK (can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete translations"
ON public.site_translations
FOR DELETE
TO authenticated
USING (can_manage_content(auth.uid()));