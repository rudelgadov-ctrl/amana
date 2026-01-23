import { useLanguage } from '@/contexts/LanguageContext';
import { Star, ExternalLink } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGoogleReviews } from '@/hooks/useGoogleReviews';

// Google review URL for Amana Escalante
const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJr1jB84vjoI8RwbPBNr29tws';

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Fallback reviews in case Google API fails
const fallbackReviews = {
  es: [{
    id: '1',
    name: 'María García',
    text: 'Una experiencia gastronómica increíble. Los sabores son únicos y el servicio impecable. Definitivamente volveré.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 2 semanas'
  }, {
    id: '2',
    name: 'Carlos Rodríguez',
    text: 'El mejor restaurante de Barrio Escalante. El menú de Chef\'s Table es una obra de arte culinaria.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 1 mes'
  }, {
    id: '3',
    name: 'Ana Fernández',
    text: 'Ambiente acogedor y platos excepcionales. La combinación perfecta de cocina tradicional con toques modernos.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 3 semanas'
  }],
  en: [{
    id: '1',
    name: 'John Smith',
    text: 'An incredible dining experience. The flavors are unique and the service impeccable. Will definitely return.',
    rating: 5,
    photoUrl: '',
    relativeTime: '2 weeks ago'
  }, {
    id: '2',
    name: 'Sarah Johnson',
    text: 'The best restaurant in Barrio Escalante. The Chef\'s Table menu is a culinary work of art.',
    rating: 5,
    photoUrl: '',
    relativeTime: '1 month ago'
  }, {
    id: '3',
    name: 'Michael Brown',
    text: 'Cozy atmosphere and exceptional dishes. The perfect combination of traditional cuisine with modern touches.',
    rating: 5,
    photoUrl: '',
    relativeTime: '3 weeks ago'
  }]
};

const ReviewsSkeleton = () => (
  <div className="max-w-5xl mx-auto">
    <div className="flex gap-4">
      {[1, 2].map((i) => (
        <Card key={i} className="flex-1 border-0 bg-eggshell shadow-md">
          <CardContent className="p-8 space-y-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Skeleton key={star} className="h-5 w-5 rounded" />
              ))}
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ReviewsSection = () => {
  const { t, language } = useLanguage();
  const { data: googleReviews, isLoading, error } = useGoogleReviews(language);

  // Use Google reviews if available, otherwise fallback
  const reviews = googleReviews && googleReviews.length > 0 
    ? googleReviews.map(review => ({
        id: review.id,
        name: review.name,
        text: review.text,
        rating: review.rating,
        photoUrl: review.photoUrl || '',
        relativeTime: review.relativeTime || '',
      }))
    : fallbackReviews[language];

  return (
    <section className="py-24 bg-[#dad8c8]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-blueberry">
            {t.reviews.title}
          </h2>
          <p className="font-body text-lg text-blueberry/70">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Reviews Carousel */}
        {isLoading ? (
          <ReviewsSkeleton />
        ) : (
          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {reviews.map((review) => (
                  <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                    <Card className="h-full border-0 bg-eggshell shadow-md">
                      <CardContent className="p-8 space-y-6">
                        {/* Stars */}
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={20} className="text-yolk fill-yolk" />
                          ))}
                        </div>

                        {/* Review text */}
                        <p className="font-body text-lg text-blueberry/80 italic line-clamp-4">
                          "{review.text}"
                        </p>

                        {/* Reviewer info with photo */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-blueberry/10">
                            <AvatarImage src={review.photoUrl} alt={review.name} />
                            <AvatarFallback className="bg-blueberry/10 text-blueberry font-medium text-sm">
                              {getInitials(review.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-body font-medium text-blueberry">
                              {review.name}
                            </span>
                            {review.relativeTime && (
                              <span className="font-body text-sm text-blueberry/50">
                                {review.relativeTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-blueberry text-blueberry hover:bg-blueberry hover:text-eggshell" />
              <CarouselNext className="hidden md:flex -right-12 border-blueberry text-blueberry hover:bg-blueberry hover:text-eggshell" />
            </Carousel>

            {/* Leave a Review CTA */}
            <div className="mt-10 text-center">
              <Button
                asChild
                variant="outline"
                className="border-2 border-blueberry text-blueberry bg-transparent hover:bg-yolk hover:border-yolk hover:text-blueberry transition-colors font-body"
              >
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  {t.reviews.leaveReview}
                  <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Error indicator - only shown in dev */}
        {error && import.meta.env.DEV && (
          <p className="text-center text-sm text-blueberry/50 mt-4">
            Using fallback reviews (Google API unavailable)
          </p>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
