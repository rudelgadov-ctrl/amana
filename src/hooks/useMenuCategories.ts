import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuCategory {
  id: string;
  value: string;
  label_es: string;
  label_en: string;
  parent_value: string | null;
  sort_order: number;
  is_active: boolean;
}

const fetchMenuCategories = async (): Promise<MenuCategory[]> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data as MenuCategory[];
};

export const useMenuCategories = () => {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: fetchMenuCategories,
    staleTime: 1000 * 60 * 5,
  });
};
