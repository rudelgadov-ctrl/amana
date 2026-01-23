import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteImage {
  id: string;
  location: string;
  storage_path: string;
  url: string;
  alt_text_es: string | null;
  alt_text_en: string | null;
  is_active: boolean;
  sort_order: number;
}

export const useSiteImages = (location?: string) => {
  return useQuery({
    queryKey: ['site-images', location],
    queryFn: async () => {
      let query = supabase
        .from('site_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (location) {
        query = query.eq('location', location);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching site images:', error);
        throw error;
      }

      return data as SiteImage[];
    },
  });
};

export type { SiteImage };
