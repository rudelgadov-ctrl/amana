import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuItem {
  id: string;
  category: string;
  subcategory: string | null;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  price: string | null;
  is_available: boolean;
  sort_order: number;
}

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category')
    .order('sort_order');

  if (error) throw error;
  return data as MenuItem[];
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Group menu items by category and subcategory
export const groupMenuItems = (items: MenuItem[]) => {
  const grouped: Record<string, Record<string, MenuItem[]>> = {};

  items.forEach((item) => {
    const category = item.category;
    const subcategory = item.subcategory || 'default';

    if (!grouped[category]) {
      grouped[category] = {};
    }
    if (!grouped[category][subcategory]) {
      grouped[category][subcategory] = [];
    }
    grouped[category][subcategory].push(item);
  });

  return grouped;
};
