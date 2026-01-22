import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GoogleReview {
  id: string;
  name: string;
  text: string;
  rating: number;
  language: string;
  photoUrl: string;
  publishTime: string;
  relativeTime: string;
}

interface ReviewsResponse {
  reviews: GoogleReview[];
  total: number;
  preferredLanguage: string;
}

export const useGoogleReviews = (language: 'es' | 'en') => {
  return useQuery({
    queryKey: ['google-reviews', language],
    queryFn: async (): Promise<GoogleReview[]> => {
      const { data, error } = await supabase.functions.invoke<ReviewsResponse>('get-google-reviews', {
        body: { language },
      });

      if (error) {
        console.error('Error fetching Google reviews:', error);
        throw error;
      }

      return data?.reviews || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - reviews don't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
    retry: 2,
  });
};
