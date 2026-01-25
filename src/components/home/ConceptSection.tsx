import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ScrollAnimation } from '@/hooks/useScrollAnimation';
import { useSiteImages } from '@/hooks/useSiteImages';

// Icons for cards
import iconAgave from '@/assets/icon-agave.png';
import iconPez from '@/assets/icon-pez.jpg';
import iconPulpo from '@/assets/icon-pulpo.png';

// Full images for cards
import panDeLengua from '@/assets/pan-de-lengua.jpg';
import highballGarden from '@/assets/highball-garden.jpg';
import chefsTableIllustration from '@/assets/chefs-table-illustration.png';

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
const fallbackCarouselImages = [
  dishHokkaido,
  dishRisottoHongos,
  dishRisotto,
  dishTortellini,
  dishTuetano,
  dishCalamar,
  dishLangosta,
  dishCeviche,
  dishChuleton,
  dishMacarela,
];
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

const FlipCard = ({ card }: FlipCardProps) => {
  return (
    <Link to={card.href} className="group block h-full">
      <Card className="relative border-asparagus/20 bg-sand hover:border-asparagus/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        {/* Image on top */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
          <img
            src={card.fullImage}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Card content below */}
        <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full -mt-10 sm:-mt-12 md:-mt-14 border-4 border-sand bg-sand relative z-10 p-2">
            <img 
              src={card.icon} 
              alt={card.title} 
              className="w-full h-full object-contain"
            />
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
    </Link>
  );
};

const ConceptSection = () => {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch carousel images from CMS
  const { data: cmsCarouselImages } = useSiteImages('carousel');
  
  // Use CMS images if available, otherwise use fallback local images
  const carouselImages = cmsCarouselImages && cmsCarouselImages.length > 0
    ? cmsCarouselImages.map(img => ({ url: img.url, alt: language === 'es' ? img.alt_text_es : img.alt_text_en }))
    : fallbackCarouselImages.map((url, i) => ({ url, alt: `Amana signature dish ${i + 1}` }));

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const cards: CardData[] = [
    {
      icon: iconPulpo,
      fullImage: panDeLengua,
      title: t.concept.cards.menu.title,
      description: t.concept.cards.menu.description,
      href: '/menu?tab=main',
    },
    {
      icon: iconAgave,
      fullImage: highballGarden,
      title: t.concept.cards.drinks.title,
      description: t.concept.cards.drinks.description,
      href: '/menu?tab=drinks',
    },
    {
      icon: iconPez,
      fullImage: chefsTableIllustration,
      title: t.concept.cards.chefsTable.title,
      description: t.concept.cards.chefsTable.description,
      href: '/menu?tab=chefs-table',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-sand">
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
                <Button
                  asChild
                  className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg transition-all duration-300"
                >
                  <Link to="/menu">
                    {language === 'es' ? 'Nuestro Menú' : 'Our Menu'}
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>

          {/* Featured Image Carousel */}
          <ScrollAnimation animation="slide-left" delay={200} className="order-1 lg:order-2">
            <div className="relative aspect-square sm:aspect-[4/5] lg:aspect-[4/5] max-w-sm sm:max-w-md lg:max-w-lg mx-auto overflow-hidden rounded-xl sm:rounded-2xl">
              {/* Render a single image to avoid crossfade double-exposure */}
              <img
                key={carouselImages[currentImageIndex]?.url || currentImageIndex}
                src={carouselImages[currentImageIndex]?.url}
                alt={
                  carouselImages[currentImageIndex]?.alt ||
                  `Amana signature dish ${currentImageIndex + 1}`
                }
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
              />
              
              {/* Image indicators */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-yolk w-4 sm:w-6' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cards.map((card, index) => (
            <ScrollAnimation key={index} animation="fade-up" delay={index * 100}>
              <FlipCard card={card} />
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
