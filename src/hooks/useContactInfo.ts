import { useTranslations } from './useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  wazeLink: string;
  googleMapsLink: string;
  opentableLink: string;
  hoursMonday: string;
  hoursTuesdayWednesday: string;
  hoursThursdaySaturday: string;
  hoursSunday: string;
}

const defaultInfo: ContactInfo = {
  phone: '+506 6143-6871',
  email: 'info@amanacr.com',
  address: '125m oeste del Fresh Market, Barrio Escalante',
  whatsapp: '+506 6143-6871',
  instagram: '@amana.escalante',
  wazeLink: 'https://www.waze.com/ul?ll=9.936098,-84.064715&navigate=yes',
  googleMapsLink: 'https://maps.app.goo.gl/N8ZpSXeiysPdpVQc7',
  opentableLink: 'https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX',
  hoursMonday: 'Cerrado',
  hoursTuesdayWednesday: 'Cena 6-10 PM',
  hoursThursdaySaturday: 'Almuerzo 12-4 PM\nCena 6-10 PM',
  hoursSunday: 'Almuerzo 12-4 PM',
};

export const useContactInfo = (): { data: ContactInfo | undefined; isLoading: boolean } => {
  const { data: translations, isLoading } = useTranslations();
  const { language } = useLanguage();

  if (!translations || !translations.contactInfo) {
    return { data: defaultInfo, isLoading };
  }

  const get = (key: string): string => {
    return translations.contactInfo?.[key]?.[language] ?? defaultInfo[key as keyof ContactInfo] ?? '';
  };

  const data: ContactInfo = {
    phone: get('phone'),
    email: get('email'),
    address: get('address'),
    whatsapp: get('whatsapp').replace(/\D/g, ''),
    instagram: get('instagram'),
    wazeLink: get('wazeLink'),
    googleMapsLink: get('googleMapsLink'),
    opentableLink: get('opentableLink'),
    hoursMonday: get('hoursMonday'),
    hoursTuesdayWednesday: get('hoursTuesdayWednesday'),
    hoursThursdaySaturday: get('hoursThursdaySaturday'),
    hoursSunday: get('hoursSunday'),
  };

  return { data, isLoading };
};
