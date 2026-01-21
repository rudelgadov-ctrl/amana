import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

// Placeholder reviews - will be replaced with Google Places API
const placeholderReviews = {
  es: [
    {
      id: 1,
      name: 'María García',
      text: 'Una experiencia gastronómica increíble. Los sabores son únicos y el servicio impecable. Definitivamente volveré.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      text: 'El mejor restaurante de Barrio Escalante. El menú de Chef\'s Table es una obra de arte culinaria.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Ana Fernández',
      text: 'Ambiente acogedor y platos excepcionales. La combinación perfecta de cocina tradicional con toques modernos.',
      rating: 5,
    },
  ],
  en: [
    {
      id: 1,
      name: 'John Smith',
      text: 'An incredible dining experience. The flavors are unique and the service impeccable. Will definitely return.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      text: 'The best restaurant in Barrio Escalante. The Chef\'s Table menu is a culinary work of art.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Michael Brown',
      text: 'Cozy atmosphere and exceptional dishes. The perfect combination of traditional cuisine with modern touches.',
      rating: 5,
    },
  ],
};

const ReviewsSection = () => {
  const { t, language } = useLanguage();
  const reviews = placeholderReviews[language];

  return (
    <section className="py-24 bg-wafer">
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
                          <Star
                            key={i}
                            size={20}
                            className="text-yolk fill-yolk"
                          />
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="font-body text-lg text-blueberry/80 italic">
                        "{review.text}"
                      </p>

                      {/* Reviewer name */}
                      <p className="font-body font-medium text-blueberry">
                        — {review.name}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-blueberry text-blueberry hover:bg-blueberry hover:text-eggshell" />
            <CarouselNext className="hidden md:flex -right-12 border-blueberry text-blueberry hover:bg-blueberry hover:text-eggshell" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
