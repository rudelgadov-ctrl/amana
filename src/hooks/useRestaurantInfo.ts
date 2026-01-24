import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RestaurantInfoRow {
  id: string;
  key: string;
  value: string;
  value_type: string;
}

export interface RestaurantInfo {
  phone: string;
  email: string;
  address_es: string;
  address_en: string;
  whatsapp: string;
  instagram: string;
  waze_link: string;
  google_maps_link: string;
  opentable_link: string;
  hours_monday: string;
  hours_tuesday_wednesday: string;
  hours_thursday_saturday: string;
  hours_sunday: string;
}

const defaultInfo: RestaurantInfo = {
  phone: '+506 6143-6871',
  email: 'info@amanacr.com',
  address_es: '125m oeste del Fresh Market de Barrio Escalante',
  address_en: '125m west of Fresh Market, Barrio Escalante',
  whatsapp: '50661436871',
  instagram: '@amana.escalante',
  waze_link: 'https://ul.waze.com/ul?venue_id=180813923.1808401378.36293324',
  google_maps_link: 'https://maps.app.goo.gl/yourlink',
  opentable_link: 'https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX',
  hours_monday: 'Cerrado / Closed',
  hours_tuesday_wednesday: '6-10 PM',
  hours_thursday_saturday: '12-4 PM, 6-10 PM',
  hours_sunday: '12-4 PM',
};

const fetchRestaurantInfo = async (): Promise<RestaurantInfo> => {
  const { data, error } = await supabase
    .from('restaurant_info')
    .select('*');

  if (error) throw error;

  // Transform array into object
  const info: Record<string, string> = {};
  (data as RestaurantInfoRow[]).forEach((row) => {
    info[row.key] = row.value;
  });

  return {
    phone: info.phone || defaultInfo.phone,
    email: info.email || defaultInfo.email,
    address_es: info.address_es || defaultInfo.address_es,
    address_en: info.address_en || defaultInfo.address_en,
    whatsapp: (info.whatsapp || defaultInfo.whatsapp).replace(/\D/g, ''),
    instagram: info.instagram || defaultInfo.instagram,
    waze_link: info.waze_link || defaultInfo.waze_link,
    google_maps_link: info.google_maps_link || defaultInfo.google_maps_link,
    opentable_link: info.opentable_link || defaultInfo.opentable_link,
    hours_monday: info.hours_monday || defaultInfo.hours_monday,
    hours_tuesday_wednesday: info.hours_tuesday_wednesday || defaultInfo.hours_tuesday_wednesday,
    hours_thursday_saturday: info.hours_thursday_saturday || defaultInfo.hours_thursday_saturday,
    hours_sunday: info.hours_sunday || defaultInfo.hours_sunday,
  };
};

export const useRestaurantInfo = () => {
  return useQuery({
    queryKey: ['restaurant-info'],
    queryFn: fetchRestaurantInfo,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
