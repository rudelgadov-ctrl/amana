import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Original icons
import iconPulpo from '@/assets/icon-pulpo.png';
import iconAgave from '@/assets/icon-agave.png';
import iconPez from '@/assets/icon-pez.jpg';

// New carousel images
import panDeLengua from '@/assets/pan-de-lengua.jpg';
import highballGarden from '@/assets/highball-garden.jpg';
import ctComida from '@/assets/ct-comida.png';

// Featured dish images for main carousel
import conceptDish1 from '@/assets/concept-dish-1.jpg';
import conceptDish2 from '@/assets/concept-dish-2.jpg';
import conceptDish3 from '@/assets/concept-dish-3.jpg';
import conceptDish4 from '@/assets/concept-dish-4.jpg';
import conceptDish5 from '@/assets/concept-dish-5.jpg';

const conceptImages = [
  conceptDish1,
  conceptDish2,
  conceptDish3,
  conceptDish4,
  conceptDish5,
];

interface CardCarouselProps {
  images: string[];
  title: string;
}

const CardCarousel = ({ images, title }: CardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-24 h-24 rounded-full overflow-hidden group/carousel">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`${title} ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {images.length > 1 && (
        <>
          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-blueberry/70 hover:bg-blueberry text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-blueberry/70 hover:bg-blueberry text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-yolk' : 'bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ConceptSection = () => {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % conceptImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      images: [panDeLengua, iconPulpo],
      title: t.concept.cards.menu.title,
      description: t.concept.cards.menu.description,
      href: '/menu#main',
    },
    {
      images: [highballGarden, iconAgave],
      title: t.concept.cards.drinks.title,
      description: t.concept.cards.drinks.description,
      href: '/menu#drinks',
    },
    {
      images: [ctComida, iconPez],
      title: t.concept.cards.chefsTable.title,
      description: t.concept.cards.chefsTable.description,
      href: '/menu#chefs-table',
    },
  ];

  return (
    <section className="py-24 bg-sand">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Split Layout - Text + Image Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
            <p className="font-body text-asparagus text-sm tracking-widest uppercase">
              {t.concept.subtitle}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-blueberry">
              {t.concept.title}
            </h2>
            <p className="font-body text-lg text-blueberry/70 whitespace-pre-line">
              {t.concept.description}
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button
                asChild
                className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-10 py-6 text-lg transition-all duration-300"
              >
                <Link to="/menu">
                  {language === 'es' ? 'Nuestro Menú' : 'Our Menu'}
                </Link>
              </Button>
            </div>
          </div>

          {/* Featured Image Carousel */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl order-1 lg:order-2">
            {conceptImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Amana signature dish ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {conceptImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-yolk w-6' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.href}
              className="group"
            >
              <Card className="h-full border-asparagus/20 bg-sand hover:border-asparagus/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-6">
                  {/* Carousel */}
                  <div className="inline-flex items-center justify-center">
                    <CardCarousel images={card.images} title={card.title} />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl font-bold text-blueberry">
                      {card.title}
                    </h3>
                    <p className="font-body text-blueberry/60">
                      {card.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="h-0.5 w-0 bg-yolk group-hover:w-16 transition-all duration-300 mx-auto" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
