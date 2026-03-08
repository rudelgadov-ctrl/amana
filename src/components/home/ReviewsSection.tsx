import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, ExternalLink } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/hooks/useScrollAnimation';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJr1jB84vjoI8RwbPBNr29tws';

const reviews = {
  es: [
    { id: 'es-1', name: 'Jose Ramirez Gonzalez', text: 'Muy interesante experiencia, donde uno va conociendo sobre platos experimentales de exquisito sabor.', rating: 5, relativeTime: 'hace 20 horas' },
    { id: 'es-2', name: 'milena radulovich', text: 'Es deliciosooooo!! Todo! Los cócteles HAY que probarlos!', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-3', name: 'Brenda Becerra', text: 'Camila nos atendió estupendamente. Comida de 10 y servicio impecable. Repetiremos en nuestras siguientes visitas a Costa Rica.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-4', name: 'Carolina Chavarría Mora', text: 'Fuimos a celebrar un cumpleaños, Luis nos atendió de manera eficiente. Pedimos dos entradas y tres platos fuertes. Todo estaba delicioso. Vale la pena visitar, además el lugar es único y al ser una casa tiene espacios separados. Precios acordes a la calidad.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-5', name: 'Liftcosmicer 19', text: 'Excelente experiencia y gran cena para navidad.', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-6', name: 'Sebastian Arias', text: 'Super rica la cena navideña de cerdo volvere a comprar', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-7', name: 'Jordi ST', text: 'El lugar está decorado con muy buen gusto, el ambiente es relajante y cómodo. La protagonista es la comida: creativa, innovadora y deliciosa, con un excelente uso de ingredientes locales. El servicio impecable. El personal se toma el tiempo de explicar cada plato al servirlo. La selección musical fue genial, aunque a veces estaba un poco alta. Particularmente delicioso estaba el risotto con entraña. Recomendados!', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-8', name: 'Luis Armando Moreno Coria', text: 'La recomendaciones sobre la comida fueron excepcionales. Explican con detalle las características de cada platillo, que contiene y como se prepara. La prestación del plato se asemeja a la comida de Autor.', rating: 5, relativeTime: 'hace 3 meses' },
    { id: 'es-9', name: 'Eduardo Calderon Calderon', text: 'El nuevo chef table está increíble 👌', rating: 5, relativeTime: 'hace 3 meses' },
    { id: 'es-10', name: 'eac', text: 'Excelente servicio y la comida muy rica. Gran experiencia.!', rating: 5, relativeTime: 'hace 4 meses' },
  ],
  en: [
    { id: 'en-1', name: 'Jeremy Watt', text: 'Amazing food! Love this place, felt at home. Open kitchen. Very kind and friendly staff!', rating: 5, relativeTime: '15 hours ago' },
    { id: 'en-2', name: 'S7ARSCREAM', text: 'The Risotto is out of this world 🤩🤙', rating: 5, relativeTime: '2 weeks ago' },
    { id: 'en-3', name: 'Jeppe Hvid', text: 'Fantastic food, fantastic service and a really good price!!!! Camilla our waiter was incredible and we love every second of her service!', rating: 5, relativeTime: 'a month ago' },
    { id: 'en-4', name: 'Nancy Tan', text: 'My friends and I did the tasting menu, and it was an amazing experience. A variety of different dishes were presented, and everything was scrumptious though we each had different favorites. You do have to reserve a minimum of 12 hours in advance.', rating: 5, relativeTime: '2 months ago' },
    { id: 'en-5', name: 'Hayden', text: 'We had the 8 course tasting menu and it was wonderful. Amazing service and an exquisite (meat heavy) taste of modern Costa Rican cuisine. Great cocktails too.', rating: 5, relativeTime: '2 months ago' },
    { id: 'en-6', name: 'Kevin Lee', text: "Found this hidden gem on Google map, the food and drink choices were interesting, this place deserves a Michelin star for its quality and presentation, i was happy there weren't that many people there as i was able to enjoy my meal there in peace but i think they deserve more recognition for their work. I would recommend for a bougie food day", rating: 5, relativeTime: '2 months ago' },
    { id: 'en-7', name: 'Barend Ungrodt', text: "Possibly the best value for your money restaurant I've ever been to", rating: 5, relativeTime: '3 months ago' },
    { id: 'en-8', name: 'Abigail Duce', text: 'Absolutely divine food! There are no Michelin restaurants in San Jose but we think this could definitely be one. The cocktails are also delectable and the service was fantastic.', rating: 5, relativeTime: '3 months ago' },
    { id: 'en-9', name: 'jennifer vaandering', text: 'Best restaurant we went to in San Jose', rating: 5, relativeTime: '3 months ago' },
    { id: 'en-10', name: 'Shawna Stillwell', text: 'My partner and I came here for dinner and the food was amazing! Both of our plates were full of flavor, perfectly cooked, and innovative. We also got a non-alcoholic drink and it was delicious! We will definitely be back when we are in Costa Rica again.', rating: 5, relativeTime: '3 months ago' },
  ],
};

const getInitials = (name: string): string => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const ReviewsSection = () => {
  const { t, language } = useLanguage();

  const shuffledReviews = useMemo(() => {
    return shuffleArray(reviews[language]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#dad8c8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-primary">
        <ScrollAnimation animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blueberry">
              {t.reviews.title}
            </h2>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up" delay={150}>
          <div className="max-w-5xl mx-auto px-2 sm:px-0 border-primary">
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-2 sm:-ml-4">
                {shuffledReviews.map(review => (
                  <CarouselItem key={review.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/2">
                    <Card className="h-full border-0 bg-eggshell shadow-md">
                      <CardContent className="h-full flex flex-col justify-between p-4 pt-6 sm:p-6 sm:pt-8 md:p-8 md:pt-10">
                        <div className="flex gap-0.5 sm:gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={16} className="text-amber-400 fill-amber-400 sm:w-5 sm:h-5" />
                          ))}
                        </div>
                        <p className="font-body text-sm sm:text-base md:text-lg text-blueberry/80 italic line-clamp-4 my-4 sm:my-6">
                          "{review.text}"
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blueberry/10 flex items-center justify-center border-2 border-blueberry/10">
                            <span className="text-blueberry font-medium text-xs sm:text-sm">{getInitials(review.name)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-body font-medium text-sm sm:text-base text-blueberry">{review.name}</span>
                            {review.relativeTime && (
                              <span className="font-body text-xs sm:text-sm text-blueberry/50">{review.relativeTime}</span>
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

            <div className="mt-6 sm:mt-8 md:mt-10 text-center">
              <Button asChild variant="outline" className="border-2 border-blueberry text-blueberry bg-transparent hover:bg-yolk hover:border-yolk hover:text-blueberry transition-colors font-body text-sm sm:text-base">
                <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  {t.reviews.leaveReview}
                  <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                </a>
              </Button>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default ReviewsSection;
