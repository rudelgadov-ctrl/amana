import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readSiteImageCache, saveSiteImageCache, warmPageImages, type SiteImage } from '@/lib/siteImageCache';

export const siteImagesQueryOptions = {
  queryKey: ['site-images'],
  staleTime: 60_000,
  gcTime: 30 * 60_000,
  initialData: readSiteImageCache,
  // Persisted data paints immediately but is always checked against the CMS.
  initialDataUpdatedAt: 0,
  queryFn: async () => {
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    const images = (data || []) as SiteImage[];
    saveSiteImageCache(images);
    warmPageImages(images, window.location.pathname);
    return images;
  },
};

export const useSiteImages = (location?: string) => {
  return useQuery({
    ...siteImagesQueryOptions,
    select: (images: SiteImage[]) => location ? images.filter(image => image.location === location) : images,
  });
};

export type { SiteImage };
