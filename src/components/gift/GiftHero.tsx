import { ArrowDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GiftHeroProps {
  showChefsTable: boolean;
  showCards: boolean;
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Full-bleed hero with the Chef's Table video and anchors to both gift sections.
const GiftHero = ({ showChefsTable, showCards }: GiftHeroProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[70vh] sm:min-h-[78vh] flex items-end overflow-hidden bg-blueberry">
      {/* Video background; the poster is the video's first frame so the swap is seamless */}
      <video
        src="/videos/chefs-table-v2.mp4"
        poster="/videos/chefs-table-v2-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* Brand gradient so the type stays legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-blueberry via-blueberry/70 to-blueberry/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-blueberry/60 via-transparent to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14 sm:pb-20 md:pb-24">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-eggshell leading-[0.95]">
            {t.gift.title}
          </h1>
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-eggshell/80 italic">
            {t.gift.subtitle}
          </p>
          <p className="font-body text-sm sm:text-base md:text-lg text-eggshell/75 max-w-xl">
            {t.gift.heroNote}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {showChefsTable && (
              <button
                type="button"
                onClick={() => scrollTo('gift-chefs-table')}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-cta bg-cta px-5 sm:px-6 py-2.5 sm:py-3 font-body text-sm sm:text-base font-medium text-cta-foreground transition-all duration-300 hover:bg-cta/90"
              >
                {t.gift.chefsTable.title}
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            )}
            {showCards && (
              <button
                type="button"
                onClick={() => scrollTo('gift-cards')}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-eggshell/70 bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 font-body text-sm sm:text-base font-medium text-eggshell transition-all duration-300 hover:bg-cta hover:text-cta-foreground hover:border-cta"
              >
                {t.gift.cards.eyebrow}
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftHero;
