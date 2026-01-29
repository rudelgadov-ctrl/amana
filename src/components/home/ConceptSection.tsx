import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '@/hooks/useScrollAnimation';
import { useSiteImages } from '@/hooks/useSiteImages';

// Icons for cards
import iconAgave from '@/assets/icon-agave.png';
import iconPez from '@/assets/icon-pez.jpg';
import iconPulpo from '@/assets/icon-pulpo.png';

// Full images for cards (fallbacks)
import panDeLenguaFallback from '@/assets/pan-de-lengua.jpg';
import highballGardenFallback from '@/assets/highball-garden.jpg';
import chefsTableGifFallback from '@/assets/concept-chefs-table.gif';

// Featured dish images for main carousel (fallbacks)
import dishHokkaido from '@/assets/dish-hokkaido.jpg';
import dishRisottoHongos from '@/assets/dish-risotto-hongos.jpg';
import dishRisotto from '@/assets/dish-risotto.jpg';
import dishTortellini from '@/assets/dish-tortellini.jpg';
import dishTuetano from '@/assets/dish-tuetano.jpg';
import dishCalamar from '@/assets/dish-calamar.jpg';
import dishLangosta from '@/assets/dish-langosta.jpg';
import dishCeviche from '@/assets/dish-ceviche.jpg';
import dishChuleton from '@/assets/dish-chuleton.jpg';
import dishMacarela from '@/assets/dish-macarela.jpg';

// Fallback images when CMS is empty
const fallbackCarouselImages = [dishHokkaido, dishRisottoHongos, dishRisotto, dishTortellini, dishTuetano, dishCalamar, dishLangosta, dishCeviche, dishChuleton, dishMacarela];
interface CardData {
  icon: string;
  fullImage: string;
  title: string;
  description: string;
  href: string;
}
interface FlipCardProps {
  card: CardData;
}
const FlipCard = ({
  card
}: FlipCardProps) => {
  return <Link to={card.href} className="group block h-full">
      <Card className="relative border-asparagus/20 bg-sand hover:border-asparagus/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        {/* Image on top */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
          <img src={card.fullImage} alt={card.title} className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-fill" />
        </div>

        {/* Card content below */}
        <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full -mt-10 sm:-mt-12 md:-mt-14 border-4 border-sand bg-sand relative z-10 p-2">
            <img src={card.icon} alt={card.title} className="w-full h-full object-contain" />
          </div>

          {/* Content */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-blueberry">
              {card.title}
            </h3>
            <p className="font-body text-sm sm:text-base text-blueberry/60 line-clamp-2">
              {card.description}
            </p>
          </div>

          {/* Hover indicator */}
          <div className="h-0.5 w-0 bg-yolk group-hover:w-12 md:group-hover:w-16 transition-all duration-300 mx-auto" />
        </CardContent>
      </Card>
    </Link>;
};
const ConceptSection = () => {
  const { t, language } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Embla carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Fetch carousel images from CMS
  const { data: cmsCarouselImages } = useSiteImages('carousel');
  
  // Fetch card images from CMS
  const { data: cardMenuImages } = useSiteImages('card-menu');
  const { data: cardDrinksImages } = useSiteImages('card-drinks');
  const { data: cardChefsTableImages } = useSiteImages('card-chefs-table');

  // Use CMS images if available, otherwise use fallback local images
  const carouselImages = cmsCarouselImages && cmsCarouselImages.length > 0 ? cmsCarouselImages.map(img => ({
    url: img.url,
    alt: language === 'es' ? img.alt_text_es : img.alt_text_en
  })) : fallbackCarouselImages.map((url, i) => ({
    url,
    alt: `Amana signature dish ${i + 1}`
  }));

  // Card images with CMS support
  const menuCardImage = cardMenuImages?.[0]?.url || panDeLenguaFallback;
  const drinksCardImage = cardDrinksImages?.[0]?.url || highballGardenFallback;
  const chefsTableCardImage = cardChefsTableImages?.[0]?.url || chefsTableGifFallback;

  const cards: CardData[] = [{
    icon: iconPulpo,
    fullImage: menuCardImage,
    title: t.concept.cards.menu.title,
    description: t.concept.cards.menu.description,
    href: '/menu?tab=main'
  }, {
    icon: iconAgave,
    fullImage: drinksCardImage,
    title: t.concept.cards.drinks.title,
    description: t.concept.cards.drinks.description,
    href: '/menu?tab=drinks'
  }, {
    icon: iconPez,
    fullImage: chefsTableCardImage,
    title: t.concept.cards.chefsTable.title,
    description: t.concept.cards.chefsTable.description,
    href: '/menu?tab=chefs-table'
  }];
  return <section className="py-12 sm:py-16 md:py-24 bg-sand">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Layout - Text + Image Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20">
          {/* Text Content */}
          <ScrollAnimation animation="slide-right" className="order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <p className="font-body text-asparagus text-xs sm:text-sm tracking-widest uppercase">
                {t.concept.subtitle}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blueberry">
                {t.concept.title}
              </h2>
              <p className="font-body text-base sm:text-lg text-blueberry/70 whitespace-pre-line">
                {t.concept.description}
              </p>
              
              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <Button asChild className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg transition-all duration-300">
                  <Link to="/menu">
                    {language === 'es' ? 'Nuestro Menú' : 'Our Menu'}
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>

          {/* Featured Image Carousel - Instagram-style sliding */}
          <ScrollAnimation animation="slide-left" delay={200} className="order-1 lg:order-2">
            <div className="relative aspect-square sm:aspect-[4/5] lg:aspect-[4/5] max-w-sm sm:max-w-md lg:max-w-lg mx-auto overflow-hidden rounded-xl sm:rounded-2xl">
              <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                  {carouselImages.map((img, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 h-full">
                      <img 
                        src={img.url} 
                        alt={img.alt || `Amana signature dish ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image indicators */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                {carouselImages.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => scrollTo(index)} 
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-yolk w-4 sm:w-6' : 'bg-white/50 hover:bg-white/80'}`} 
                    aria-label={`View image ${index + 1}`} 
                  />
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cards.map((card, index) => <ScrollAnimation key={index} animation="fade-up" delay={index * 100}>
              <FlipCard card={card} />
            </ScrollAnimation>)}
        </div>
      </div>
    </section>;
};
export default ConceptSection;