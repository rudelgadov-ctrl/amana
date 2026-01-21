import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const ReservationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-blueberry">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-eggshell">
              {t.reservation.title}
            </h2>
            <p className="font-body text-lg text-asparagus">
              {t.reservation.subtitle}
            </p>
          </div>

          {/* OpenTable Widget Placeholder */}
          <div className="bg-eggshell/5 border border-asparagus/20 rounded-lg p-8 mb-8">
            <div className="text-center space-y-6">
              {/* Placeholder for OpenTable widget */}
              <div className="py-12 border-2 border-dashed border-asparagus/30 rounded-lg">
                <p className="font-body text-wafer">
                  OpenTable Widget
                </p>
                <p className="font-body text-sm text-asparagus mt-2">
                  (Widget se integrará próximamente)
                </p>
              </div>

              {/* Reserve CTA Button */}
              <Button
                asChild
                className="bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium px-8 py-6 text-lg"
              >
                <a
                  href="https://www.opentable.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.nav.reserve}
                </a>
              </Button>
            </div>
          </div>

          {/* Group note with WhatsApp */}
          <div className="text-center space-y-4">
            <p className="font-body text-wafer">
              {t.reservation.groupNote}
            </p>
            <Button
              asChild
              variant="outline"
              className="border-asparagus text-asparagus hover:bg-asparagus/10 hover:text-eggshell font-body"
            >
              <a
                href="https://wa.me/50661436871"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle size={18} />
                {t.reservation.whatsappCta}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
