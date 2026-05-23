GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_editor(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.can_manage_content(uuid) TO authenticated, anon;