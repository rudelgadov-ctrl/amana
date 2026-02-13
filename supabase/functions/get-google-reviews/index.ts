import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Amana Escalante - Barrio Escalante, San José, Costa Rica
const PLACE_ID = "ChIJr1jB84vjoI8RwbPBNr29tws";

// Simple in-memory rate limiter (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
  originalText?: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string;
}

interface PlaceDetailsResponse {
  reviews?: GoogleReview[];
}

interface TransformedReview {
  id: string;
  name: string;
  text: string;
  rating: number;
  language: string;
  photoUrl: string;
  publishTime: string;
  relativeTime: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  try {
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('GOOGLE_PLACES_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get optional language filter from request body
    let preferredLanguage = 'es';
    try {
      const body = await req.json();
      if (body.language) {
        preferredLanguage = body.language;
      }
    } catch {
      // No body or invalid JSON, use default language
    }

    // Use Places API (New) - Place Details endpoint
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
    
    console.log('Fetching reviews from Google Places API...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'reviews',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Unable to fetch reviews at this time' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data: PlaceDetailsResponse = await response.json();
    console.log('Received reviews:', data.reviews?.length || 0);

    if (!data.reviews || data.reviews.length === 0) {
      return new Response(
        JSON.stringify({ reviews: [], message: 'No reviews found' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Filter high-rated reviews (4+ stars)
    const highRatedReviews = data.reviews.filter(review => review.rating >= 4);
    console.log('High-rated reviews (4-5 stars):', highRatedReviews.length);

    // Transform reviews to a simpler format
    const transformedReviews: TransformedReview[] = highRatedReviews.map((review, index) => {
      const reviewText = review.originalText?.text || review.text?.text || '';
      const reviewLanguage = review.originalText?.languageCode || review.text?.languageCode || 'es';
      
      return {
        id: `review-${index}-${review.publishTime}`,
        name: review.authorAttribution?.displayName || 'Anonymous',
        text: reviewText,
        rating: review.rating,
        language: reviewLanguage,
        photoUrl: review.authorAttribution?.photoUri || '',
        publishTime: review.publishTime,
        relativeTime: review.relativePublishTimeDescription || '',
      };
    });

    const preferredLanguageReviews = transformedReviews.filter(
      review => review.language.startsWith(preferredLanguage)
    );
    
    const finalReviews = preferredLanguageReviews.length >= 2 
      ? preferredLanguageReviews 
      : transformedReviews;

    return new Response(
      JSON.stringify({ 
        reviews: finalReviews,
        total: finalReviews.length,
        preferredLanguage,
        hasPreferredLanguageReviews: preferredLanguageReviews.length >= 2,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-google-reviews function:', error);
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable' }),
      { 
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
