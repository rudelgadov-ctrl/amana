import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';

const CTASection = () => {
  const { t } = useLanguage();
  const { data: info } = useRestaurantInfo();

  return (
    <section className="py-24 bg-blueberry relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-asparagus/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yolk/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Title */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-eggshell leading-tight">
            {t.cta.title}
          </h2>

          {/* Subtitle */}
          <p className="font-body text-xl text-asparagus">{t.cta.subtitle}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              className="border-2 border-eggshell bg-transparent text-eggshell hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-10 py-6 text-lg transition-all duration-300"
            >
              <a
                href={info?.opentable_link || 'https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.cta.button}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-asparagus text-asparagus hover:bg-asparagus/10 hover:text-eggshell font-body px-10 py-6 text-lg"
            >
              <Link to="/menu">{t.cta.menuLink}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
