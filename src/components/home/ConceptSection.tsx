import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import iconPulpo from '@/assets/icon-pulpo.png';
import iconAgave from '@/assets/icon-agave.png';
import iconPez from '@/assets/icon-pez.jpg';

const ConceptSection = () => {
  const { t, language } = useLanguage();

  const cards = [
    {
      image: iconPulpo,
      title: t.concept.cards.menu.title,
      description: t.concept.cards.menu.description,
      href: '/menu#main',
    },
    {
      image: iconAgave,
      title: t.concept.cards.drinks.title,
      description: t.concept.cards.drinks.description,
      href: '/menu#drinks',
    },
    {
      image: iconPez,
      title: t.concept.cards.chefsTable.title,
      description: t.concept.cards.chefsTable.description,
      href: '/menu#chefs-table',
    },
  ];

  return (
    <section className="py-24 bg-sand">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="font-body text-asparagus text-sm tracking-widest uppercase">
            {t.concept.subtitle}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-blueberry">
            {t.concept.title}
          </h2>
          <p className="font-body text-lg text-blueberry/70">
            {t.concept.description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <Button
            asChild
            className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-10 py-6 text-lg transition-all duration-300"
          >
            <Link to="/menu">
              {language === 'es' ? 'Nuestro Menú' : 'Our Menu'}
            </Link>
          </Button>
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
                  {/* Image */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full overflow-hidden">
                    <img 
                      src={card.image} 
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
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
