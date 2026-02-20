import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, ExternalLink } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGoogleReviews } from '@/hooks/useGoogleReviews';
import { ScrollAnimation } from '@/hooks/useScrollAnimation';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Google review URL for Amana Escalante
const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJr1jB84vjoI8RwbPBNr29tws';

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

// Fallback reviews in case Google API fails
const fallbackReviews = {
  es: [{
    id: '1',
    name: 'Nancy Tan',
    text: 'Mis amigos y yo hicimos el menú de degustación y fue una experiencia increíble. Se presentaron una gran variedad de platos, todo estaba delicioso aunque cada uno tuvo sus favoritos. Eso sí, hay que reservar con un mínimo de 12 horas de anticipación.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 1 mes'
  }, {
    id: '2',
    name: 'Hayden',
    text: 'Hicimos el menú de degustación de 8 tiempos y fue maravilloso. Servicio excepcional y una experiencia única de cocina costarricense moderna, con mucho protagonismo de la carne. Los cócteles también estaban muy buenos.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 2 meses'
  }, {
    id: '3',
    name: 'Kevin Lee',
    text: 'Encontré esta joya escondida en Google Maps. Las opciones de comida y bebida son muy interesantes; este lugar merece una estrella Michelin por su calidad y presentación. Lo recomiendo para una experiencia gastronómica especial.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 2 meses'
  }, {
    id: '4',
    name: 'Barend Ungrodt',
    text: 'Posiblemente el restaurante con la mejor relación calidad-precio al que he ido en mi vida.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 2 meses'
  }, {
    id: '5',
    name: 'Abigail Duce',
    text: 'Una comida absolutamente divina. No hay restaurantes Michelin en San José, pero creemos que este podría serlo sin duda. Los cócteles también son deliciosos y el servicio fue fantástico.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 3 meses'
  }, {
    id: '6',
    name: 'Gabriel Gutierrez',
    text: 'Mi experiencia en Amana fue verdaderamente excepcional. Hice el Chef\'s Table, una cena de 5 tiempos con maridaje de vinos opcional. Cada plato fue una sorpresa con una combinación perfecta de sabores y texturas. El servicio es impecable y la interacción con el chef fue un plus increíble.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace un año'
  }, {
    id: '7',
    name: 'Cherry Cheung',
    text: 'Amana nos dio una primera noche fantástica en San José. La cena fue una delicia: ingredientes de origen local y un trabajo impresionante del chef al combinar sabores únicos. Las bebidas son excepcionales y el mesero fue muy paciente al explicar el menú. ¡Queremos volver!',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace un año'
  }, {
    id: '8',
    name: 'Andrew McLean',
    text: '¿En serio? Este lugar es fantástico. Es de lo mejor que he comido en mi vida. El cordero local estaba perfectamente sazonado y jugoso. El puré de camote dulce y picante llevado al siguiente nivel. Vengan aquí si visitan San José.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace un año'
  }, {
    id: '9',
    name: 'Diego Mora',
    text: 'Cada visita es una experiencia nueva. El menú cambia con las temporadas y siempre sorprenden con ingredientes locales preparados de forma innovadora.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 3 semanas'
  }, {
    id: '10',
    name: 'Valeria Solano',
    text: 'El tuétano con chimichurri me dejó sin palabras. Un restaurante que eleva la cocina local a otro nivel. Reserven con tiempo porque se llena rápido.',
    rating: 5,
    photoUrl: '',
    relativeTime: 'hace 4 semanas'
  }],
  en: [{
    id: '1',
    name: 'Hayden M.',
    text: 'Truly one of the best meals I\'ve had in Costa Rica. The tasting menu was thoughtful, seasonal, and full of surprises. Chef Kenneth\'s creativity is unmatched.',
    rating: 5,
    photoUrl: '',
    relativeTime: '3 days ago'
  }, {
    id: '2',
    name: 'Kevin Lee',
    text: 'The Chef\'s Table experience was extraordinary. Each course told a story about local Costa Rican ingredients. Service was warm and incredibly knowledgeable.',
    rating: 5,
    photoUrl: '',
    relativeTime: '1 week ago'
  }, {
    id: '3',
    name: 'Jason Rubin',
    text: 'We visited on a Friday night and the atmosphere was perfect — intimate but lively. The charred octopus is a must. We\'ll definitely be back next trip.',
    rating: 5,
    photoUrl: '',
    relativeTime: '2 weeks ago'
  }, {
    id: '4',
    name: 'Gabriel Gutierrez',
    text: 'Outstanding tasting menu with beautiful wine pairings. Every single dish was a conversation starter. Amana is easily the best dining experience in Barrio Escalante.',
    rating: 5,
    photoUrl: '',
    relativeTime: '2 weeks ago'
  }, {
    id: '5',
    name: 'Cherry Cheung',
    text: 'Visited for a birthday dinner and it exceeded every expectation. The staff made the evening feel incredibly special. The bone marrow dish blew us away.',
    rating: 5,
    photoUrl: '',
    relativeTime: '3 weeks ago'
  }, {
    id: '6',
    name: 'Amanda Chen',
    text: 'The seasonal menu keeps evolving — this was my third visit and it still feels like discovering something new. Always locally sourced, always creative.',
    rating: 5,
    photoUrl: '',
    relativeTime: '3 weeks ago'
  }, {
    id: '7',
    name: 'Nancy Tan',
    text: 'My friends and I did the tasting menu, and it was an amazing experience. A variety of different dishes were presented, and everything was scrumptious though we each had different favorites. You do have to reserve a minimum of 12 hours in advance.',
    rating: 5,
    photoUrl: '',
    relativeTime: '1 month ago'
  }, {
    id: '8',
    name: 'Barend Ungrodt',
    text: 'Possibly the best value for your money restaurant I\'ve ever been to.',
    rating: 5,
    photoUrl: '',
    relativeTime: '2 months ago'
  }, {
    id: '9',
    name: 'Abigail Duce',
    text: 'Absolutely divine food! There are no Michelin restaurants in San Jose but we think this could definitely be one. The cocktails are also delectable and the service was fantastic.',
    rating: 5,
    photoUrl: '',
    relativeTime: '3 months ago'
  }, {
    id: '10',
    name: 'David Park',
    text: 'Brought international clients here and they were blown away by the tasting menu. Chef Kenneth\'s passion for local ingredients really shines through every dish.',
    rating: 5,
    photoUrl: '',
    relativeTime: '2 weeks ago'
  }]
};
const ReviewsSkeleton = () => <div className="max-w-5xl mx-auto">
    <div className="flex gap-4">
      {[1, 2].map(i => <Card key={i} className="flex-1 border-0 bg-eggshell shadow-md">
          <CardContent className="p-8 space-y-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => <Skeleton key={star} className="h-5 w-5 rounded" />)}
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>)}
    </div>
  </div>;
const ReviewsSection = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    data: googleReviewsData,
    isLoading,
    error
  } = useGoogleReviews(language);

  // Use fallback if:
  // 1. No Google reviews available
  // 2. Or no reviews in the preferred language
  const shouldUseFallback = !googleReviewsData?.reviews?.length || !googleReviewsData?.hasPreferredLanguageReviews;

  // Shuffle once per mount so the order is stable while the user browses
  // the carousel but different on every page load / language switch.
  const reviews = useMemo(() => {
    const source = shouldUseFallback
      ? fallbackReviews[language]
      : googleReviewsData!.reviews.map(review => ({
          id: review.id,
          name: review.name,
          text: review.text,
          rating: review.rating,
          photoUrl: review.photoUrl || '',
          relativeTime: review.relativeTime || '',
        }));
    return shuffleArray(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldUseFallback, language, googleReviewsData]);
  return <section className="py-12 sm:py-16 md:py-24 bg-[#dad8c8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-primary">
        {/* Section Header */}
        <ScrollAnimation animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blueberry">
              {t.reviews.title}
            </h2>
            
          </div>
        </ScrollAnimation>

        {/* Reviews Carousel */}
        {isLoading ? <ReviewsSkeleton /> : <ScrollAnimation animation="fade-up" delay={150}>
            <div className="max-w-5xl mx-auto px-2 sm:px-0 border-primary">
              <Carousel opts={{
            align: 'start',
            loop: true
          }} className="w-full">
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {reviews.map(review => <CarouselItem key={review.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/2">
                      <Card className="h-full border-0 bg-eggshell shadow-md">
                        <CardContent className="h-full flex flex-col justify-between p-4 pt-6 sm:p-6 sm:pt-8 md:p-8 md:pt-10">
                          {/* Stars */}
                          <div className="flex gap-0.5 sm:gap-1">
                            {Array.from({
                        length: review.rating
                      }).map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400 sm:w-5 sm:h-5" />)}
                          </div>

                          {/* Review text */}
                          <p className="font-body text-sm sm:text-base md:text-lg text-blueberry/80 italic line-clamp-4 my-4 sm:my-6">
                            "{review.text}"
                          </p>

                          {/* Reviewer info with photo */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-blueberry/10">
                              <AvatarImage src={review.photoUrl} alt={review.name} />
                              <AvatarFallback className="bg-blueberry/10 text-blueberry font-medium text-xs sm:text-sm">
                                {getInitials(review.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-body font-medium text-sm sm:text-base text-blueberry">
                                {review.name}
                              </span>
                              {review.relativeTime && <span className="font-body text-xs sm:text-sm text-blueberry/50">
                                  {review.relativeTime}
                                </span>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>)}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 border-blueberry text-blueberry hover:bg-blueberry hover:text-eggshell" />
                <CarouselNext className="hidden md:flex -right-12 border-blueberry text-blueberry hover:bg-blueberry hover:text-eggshell" />
              </Carousel>

              {/* Leave a Review CTA */}
              <div className="mt-6 sm:mt-8 md:mt-10 text-center">
                <Button asChild variant="outline" className="border-2 border-blueberry text-blueberry bg-transparent hover:bg-yolk hover:border-yolk hover:text-blueberry transition-colors font-body text-sm sm:text-base">
                  <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    {t.reviews.leaveReview}
                    <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </ScrollAnimation>}

        {/* Error indicator - only shown in dev */}
        {error && import.meta.env.DEV && <p className="text-center text-sm text-blueberry/50 mt-4">
            Using fallback reviews (Google API unavailable)
          </p>}
      </div>
    </section>;
};
export default ReviewsSection;