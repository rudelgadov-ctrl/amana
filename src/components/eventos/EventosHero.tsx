import { ArrowDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteImages } from '@/hooks/useSiteImages';
import heroFallback from '@/assets/eventos/hero.jpg';

const scrollToQuote = () => {
  document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Full-bleed photo hero; the image comes from Admin > Imágenes ("Eventos · Hero") with a bundled fallback.
const EventosHero = () => {
  const { t, language } = useLanguage();
  const { data: images } = useSiteImages('events-hero');
  const image = images?.[0];
  const src = image?.url || heroFallback;
  const alt = (language === 'es' ? image?.alt_text_es : image?.alt_text_en) || t.eventsPage.hero.imageAlt;

  return (
    <section className="relative min-h-[72vh] sm:min-h-[80vh] flex items-end overflow-hidden bg-blueberry">
      <img
        src={src}
        alt={alt}
        width={1600}
        height={912}
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Brand gradient so the type stays legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-blueberry via-blueberry/60 to-blueberry/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-blueberry/50 via-transparent to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14 sm:pb-20 md:pb-24">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-eggshell leading-[0.95]">
            {t.eventsPage.hero.title}
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-eggshell/80 max-w-xl">
            {t.eventsPage.hero.text}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={scrollToQuote}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-cta bg-cta px-5 sm:px-6 py-2.5 sm:py-3 font-body text-sm sm:text-base font-medium text-cta-foreground transition-all duration-300 hover:bg-cta/90"
            >
              {t.eventsPage.hero.cta}
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventosHero;
