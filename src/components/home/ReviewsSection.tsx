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
    { id: 'es-1', name: 'Jose Ramirez Gonzalez', text: 'Muy interesante experiencia, donde uno va conociendo sobre platos experimentales de exquisito sabor.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-2', name: 'milena radulovich', text: 'Es deliciosooooo!! Todo! Los cócteles HAY que probarlos!', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-3', name: 'Brenda Becerra', text: 'Camila nos atendió estupendamente. Comida de 10 y servicio impecable. Repetiremos en nuestras siguientes visitas a Costa Rica.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-4', name: 'Carolina Chavarría Mora', text: 'Fuimos a celebrar un cumpleaños, Luis nos atendió de manera eficiente. Pedimos dos entradas y tres platos fuertes. Todo estaba delicioso. Vale la pena visitar, además el lugar es único y al ser una casa tiene espacios separados. Precios acordes a la calidad.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-5', name: 'Liftcosmicer 19', text: 'Excelente experiencia y gran cena para navidad.', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-6', name: 'Sebastian Arias', text: 'Super rica la cena navideña de cerdo volvere a comprar', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-7', name: 'Jordi ST', text: 'El lugar está decorado con muy buen gusto, el ambiente es relajante y cómodo. La protagonista es la comida: creativa, innovadora y deliciosa, con un excelente uso de ingredientes locales. El servicio impecable. El personal se toma el tiempo de explicar cada plato al servirlo. La selección musical fue genial, aunque a veces estaba un poco alta. Particularmente delicioso estaba el risotto con entraña. Recomendados!', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-8', name: 'Luis Armando Moreno Coria', text: 'La recomendaciones sobre la comida fueron excepcionales. Explican con detalle las características de cada platillo, que contiene y como se prepara. La prestación del plato se asemeja a la comida de Autor.', rating: 5, relativeTime: 'hace 3 meses' },
    { id: 'es-9', name: 'Eduardo Calderon Calderon', text: 'El nuevo chef table está increíble 👌', rating: 5, relativeTime: 'hace 3 meses' },
    { id: 'es-10', name: 'eac', text: 'Excelente servicio y la comida muy rica. Gran experiencia.!', rating: 5, relativeTime: 'hace 4 meses' },
    { id: 'es-11', name: 'Juana Gómez', text: 'Increíble, mas que comida es una experiencia. Luis el Jefe de salón nos enamoro con sus historias, amabilidad y servicio. Es imperdible en el barrio Escalante.', rating: 5, relativeTime: 'hace 3 semanas' },
    { id: 'es-12', name: 'Marce AS', text: 'En cuanto a lugares de fine dining en Costa Rica, este es mi favorito. Tuve la dicha de ir hace un tiempo que estrenaron menú de cocteles, y simplemente impresionante, son cocteles donde no es solo la receta, sino la materia prima con la que trabajan que se nota la atención al detalle. El servicio increíble. Mi restaurante favorito para este tipo de comida por mucho.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-13', name: 'Natalia Pérez', text: 'Descubrimos este lugar por una recomendación y es excelente. Comida creativa, porciones grandes. Un pancito de cortesía riquísimo y unos cócteles increíbles. Espero volver pronto para probar más platillos.', rating: 5, relativeTime: 'hace 2 días' },
    { id: 'es-14', name: 'Pecan', text: 'Uno de los mejores lugares en San José. La comida es toda una experiencia y el servicio inigualable.', rating: 5, relativeTime: 'hace 3 semanas' },
    { id: 'es-15', name: 'Pablo Murillo', text: 'Excelente experiencia: cocina de autor realmente exquisita y original, atención cálida y cuidadosa y atmósfera agradable en un espacio muy bien diseñado.', rating: 5, relativeTime: 'hace 3 semanas' },
    { id: 'es-16', name: 'Ingrid Ortiz -Costa Rica-', text: 'Visitamos el restaurante un jueves en la noche. Se recomienda hacer reservación. Nos asignaron un area privada, que nos gustó mucho. El menú, la presentación y sabor de los platillos muy originales y de excelente sabor. Mención aparte para el Sr. Luis, quien nos atendió con mucho respeto y cortesía. Volveré para probar otras preparaciones que son diferentes a otros restaurantes.', rating: 5, relativeTime: 'hace 4 semanas' },
    { id: 'es-17', name: 'nathaly Segura', text: '¡Espléndido y cálido servicio! Los sabores son simplemente increíbles. Sin duda, un lugar al que volvería.', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-18', name: 'Jason Fallas', text: 'Vine a probar el nuevo menú de mi restaurante favorito en Barrio Escalante, estoy en shock con la caramelización y el marmoleado de este rib eye 🔥', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-19', name: 'Andrea Zúñiga Rodríguez', text: 'Delicioso, de las mejores opciones en Barrio Escalante ✨ Actualización: 2026 cambiaron el menú y aún más delicioso 🤪', rating: 5, relativeTime: 'hace un mes' },
    { id: 'es-20', name: 'Roberto Mesén Méndez', text: "Maravillosa experiencia. Mi esposa y yo fuimos a celebrar nuestro 15 aniversario de bodas y fue toda una experiencia maravillosa. Luis nos atendió de forma excelente y la experiencia del Chef's Table nos encantó. Altamente recomendado.", rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-21', name: 'Isabel Ortega', text: 'Si está en busca de toda una experiencia gastronómica, Amana definitivamente es la opción. Mi esposo y yo festejamos nuestro aniversario 15 de matrimonio y nos fuimos con una vivencia increíble tanto del local, de la atención de Luis y de la exquisita mano de los chefs.', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-22', name: 'Gabriela Romero Gonzalez', text: 'Personal muy amable y con conocimiento.', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-23', name: 'Dayana Campos', text: 'La experiencia del table chef vale muchísimo la pena. Sin duda Arte en cada bocado. El maridaje muy apropiado y atinado. Recomendación sin duda.', rating: 5, relativeTime: 'hace 2 meses' },
    { id: 'es-24', name: 'Eddy Herrera', text: 'Señores apague y vámonos, como se dice popularmente. Es indescriptible la mezcla de sabores, los platillos, el emplatado, el servicio, comida fusión costarricense. Por Dios vale cada colón que se paga. Segunda vez que venimos y si la primera fue una experiencia única, la de hoy igualó o superó esa primera vez. Un aplauso de pie al chef, a los chicos que atienden por su servicio detallado y con esa comunicación explicando cada platillo. Gracias Amana por estas experiencias únicas en gastronomía.', rating: 5, relativeTime: 'hace 2 meses' },
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
    { id: 'en-11', name: 'K Marshall', text: 'I had a great lunch here, which included a vegetarian ceviche that was great. The rolls came with a flavorful lemon vanilla butter. The service was excellent.', rating: 5, relativeTime: '5 days ago' },
    { id: 'en-12', name: 'Jen M', text: 'We arrived super late after a long bus ride, and we were welcomed in by the excellent waitress who explained the dishes in impressive English. The food was so well executed and really showed the creativity of the chef. The mackerel with pineapple was so good, as was the pork belly. Cocktails also hit it out of the park, especially the Paloma. The atmosphere was elegant yet relaxed.', rating: 5, relativeTime: '4 weeks ago' },
    { id: 'en-13', name: 'Nelly', text: "One of my fav restaurants in San Jose, walking distance from my Airbnb. My girlfriend agrees as well, got the 7 course meal at Chef's Kitchen and loved it. Got a free alcoholic welcome drink too. Chill vibes.", rating: 5, relativeTime: 'a month ago' },
    { id: 'en-14', name: 'David', text: "What a special experience. This place celebrates Costa Rican food in an incredibly unique and thoroughly way, bringing the flavours and profiles of local ingredients in a new and creative way. Chef Dhamian presented each dish with pride and passion, and you could taste that in every bite. We loved the chicken wings and the ceviche especially. The staff were friendly, courteous and attentive. I thoroughly recommend this restaurant if you're looking for a premium Costa Rican food experience.", rating: 5, relativeTime: '2 days ago' },
    { id: 'en-15', name: 'Handan Ozbek', text: 'We were so happy to have this experience on our first evening in the city. Everything we ate was delicious. The service and ambiance were also great 🙏', rating: 5, relativeTime: '2 months ago' },
    { id: 'en-16', name: 'Rob', text: 'High quality dining experience. Great friendly service.', rating: 5, relativeTime: '3 months ago' },
    { id: 'en-17', name: 'Donovan Parker', text: "My wife and I ended our last evening for our honeymoon celebration at Amana. We had a wonderful experience when choosing the 7 course Chef's Table experience! As soon as we walked in we received a warm greeting with cocktails. We elected to also do the wine pairing and it was a great experience enhancement that was thoughtfully connected to each individual dish. The chef presented each dish with a story that made them that much more special. Our favorites were the fresco de Frutas, Platonos Maduros, and Tamal de Cerdo. Would highly recommend!", rating: 5, relativeTime: '3 months ago' },
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
                      <CardContent className="h-full flex flex-col justify-between min-h-[180px] p-4 pt-6 sm:p-6 sm:pt-8 md:p-8 md:pt-10">
                        <div className="flex gap-0.5 sm:gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={16} className="text-amber-400 fill-amber-400 sm:w-5 sm:h-5" />
                          ))}
                        </div>
                        <p className="font-body text-sm sm:text-base md:text-lg text-blueberry/80 italic my-4 sm:my-6">
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
