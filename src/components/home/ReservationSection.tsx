import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenTableWidget from '@/components/OpenTableWidget';

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

          {/* OpenTable Widget */}
          <div className="bg-eggshell rounded-lg p-6 md:p-8 mb-8">
            <OpenTableWidget 
              type="standard" 
              theme="wide" 
              color={5}
              dark={false}
              className="flex justify-center"
            />
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
