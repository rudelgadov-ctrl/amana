import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';

// Original icons
import iconPulpo from '@/assets/icon-pulpo.png';
import iconAgave from '@/assets/icon-agave.png';
import iconPez from '@/assets/icon-pez.jpg';

// Full images
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
  const [showImage, setShowImage] = useState(false);

  const toggleImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImage(!showImage);
  };

  return (
    <Link to={card.href} className="group block h-full">
      <Card className="relative h-80 border-asparagus/20 bg-sand hover:border-asparagus/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        {/* Original card content */}
        <CardContent 
          className={`absolute inset-0 p-8 flex flex-col items-center justify-center text-center space-y-6 transition-opacity duration-500 ${
            showImage ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full overflow-hidden">
            <img 
              src={card.icon} 
              alt={card.title} 
              className="w-full h-full object-cover"
            />
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

        {/* Full image view */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            showImage ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={card.fullImage}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleImage}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-blueberry/80 hover:bg-blueberry text-white flex items-center justify-center transition-all duration-300 z-10"
          aria-label={showImage ? "Ver información" : "Ver imagen"}
        >
          {showImage ? (
            <X className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </Card>
    </Link>
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

  const cards: CardData[] = [
    {
      icon: iconPulpo,
      fullImage: panDeLengua,
      title: t.concept.cards.menu.title,
      description: t.concept.cards.menu.description,
      href: '/menu#main',
    },
    {
      icon: iconAgave,
      fullImage: highballGarden,
      title: t.concept.cards.drinks.title,
      description: t.concept.cards.drinks.description,
      href: '/menu#drinks',
    },
    {
      icon: iconPez,
      fullImage: ctComida,
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
            <FlipCard key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
