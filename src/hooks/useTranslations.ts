import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TranslationRow {
  id: string;
  section: string;
  key: string;
  text_es: string;
  text_en: string;
}

export interface TranslationsMap {
  [section: string]: {
    [key: string]: {
      es: string;
      en: string;
    };
  };
}

const fetchTranslations = async (): Promise<TranslationsMap> => {
  const { data, error } = await supabase
    .from('site_translations')
    .select('*')
    .order('section');

  if (error) throw error;

  // Transform flat array into nested object by section and key
  const translationsMap: TranslationsMap = {};
  
  (data as TranslationRow[]).forEach((row) => {
    if (!translationsMap[row.section]) {
      translationsMap[row.section] = {};
    }
    translationsMap[row.section][row.key] = {
      es: row.text_es,
      en: row.text_en,
    };
  });

  return translationsMap;
};

export const useTranslations = () => {
  return useQuery({
    queryKey: ['site-translations'],
    queryFn: fetchTranslations,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Helper to get a translation value with fallback
export const getTranslation = (
  translations: TranslationsMap | undefined,
  section: string,
  key: string,
  language: 'es' | 'en',
  fallback: string = ''
): string => {
  return translations?.[section]?.[key]?.[language] ?? fallback;
};
