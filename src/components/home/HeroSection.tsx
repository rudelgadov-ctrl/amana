import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImageFallback from '@/assets/hero-dish.jpg';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';
import { useSiteImages } from '@/hooks/useSiteImages';
const HeroSection = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    data: info
  } = useRestaurantInfo();
  const {
    data: heroImages
  } = useSiteImages('hero');

  // Use CMS hero image if available, otherwise use fallback
  const heroImage = heroImages && heroImages.length > 0 ? heroImages[0] : null;
  const heroSrc = heroImage?.url || heroImageFallback;
  const heroAlt = heroImage ? (language === 'es' ? heroImage.alt_text_es : heroImage.alt_text_en) || 'Amana Escalante' : 'Amana Escalante - Plato signature';
  return <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-16 md:pt-0 md:pb-0">
      {/* Background with hero image */}
      <div className="absolute inset-0">
        <img src={heroSrc} alt={heroAlt} className="w-full h-full object-cover object-center" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in text-orange-50">
          {/* Location badge */}
          <p className="font-body text-xs sm:text-sm tracking-widest uppercase text-orange-50">
            {t.hero.location}
          </p>

          {/* Main title */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-eggshell leading-tight whitespace-nowrap">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          

          {/* Description */}
          <p className="font-body text-sm sm:text-lg md:text-xl max-w-2xl mx-auto text-orange-50 text-center px-2">
            {t.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4 sm:px-0">
            <Button asChild className="border-2 border-eggshell bg-transparent text-eggshell hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300">
              <Link to="/menu">{t.hero.ctaMenu}</Link>
            </Button>
            <Button asChild className="border-2 border-eggshell bg-transparent text-eggshell hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300">
              <a href={info?.opentable_link || 'https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX'} target="_blank" rel="noopener noreferrer">
                {t.hero.ctaReserve}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on small mobile */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-asparagus rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-asparagus rounded-full" />
        </div>
      </div>
    </section>;
};
export default HeroSection;