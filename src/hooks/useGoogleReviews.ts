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
  hasPreferredLanguageReviews: boolean;
}

interface GoogleReviewsResult {
  reviews: GoogleReview[];
  hasPreferredLanguageReviews: boolean;
}

export const useGoogleReviews = (language: 'es' | 'en') => {
  return useQuery({
    queryKey: ['google-reviews', language],
    queryFn: async (): Promise<GoogleReviewsResult> => {
      const { data, error } = await supabase.functions.invoke<ReviewsResponse>('get-google-reviews', {
        body: { language },
      });

      if (error) {
        // Don't break the page if the backend is temporarily unavailable.
        // The UI layer already has static fallback reviews.
        console.error('Error fetching Google reviews:', error);
        return { reviews: [], hasPreferredLanguageReviews: false };
      }

      return {
        reviews: data?.reviews || [],
        hasPreferredLanguageReviews: data?.hasPreferredLanguageReviews ?? false,
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour - reviews don't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
    // Avoid hammering the backend when Google is blocking the upstream API.
    retry: false,
  });
};
