import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with hero image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Amana Escalante - Plato signature" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-blueberry/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Location badge */}
          <p className="font-body text-asparagus text-sm tracking-widest uppercase">
            {t.hero.location}
          </p>

          {/* Main title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-eggshell leading-tight">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="font-display text-2xl md:text-3xl text-asparagus font-light italic">
            {t.hero.subtitle}
          </p>

          {/* Description */}
          <p className="font-body text-lg md:text-xl text-wafer max-w-2xl mx-auto">
            {t.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              className="bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium px-8 py-6 text-lg"
            >
              <Link to="/menu">{t.hero.ctaMenu}</Link>
            </Button>
            <Button
              asChild
              className="bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium px-8 py-6 text-lg"
            >
              <a
                href="https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.hero.ctaReserve}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-asparagus rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-asparagus rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
