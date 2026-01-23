import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenTableWidget from '@/components/OpenTableWidget';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';

const ReservationSection = () => {
  const { t } = useLanguage();
  const { data: info } = useRestaurantInfo();

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-blueberry">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-eggshell">
              {t.reservation.title}
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-asparagus">{t.reservation.subtitle}</p>
          </div>

          {/* OpenTable Widget */}
          <div className="rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 bg-[#dad8c8]">
            <OpenTableWidget
              type="standard"
              theme="wide"
              color={5}
              dark={false}
              className="flex justify-center"
            />
          </div>

          {/* Group note with WhatsApp */}
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="font-body text-sm sm:text-base text-wafer">{t.reservation.groupNote}</p>
            <Button
              asChild
              variant="outline"
              className="border-asparagus text-asparagus hover:bg-asparagus/10 hover:text-eggshell font-body text-sm sm:text-base"
            >
              <a
                href={`https://wa.me/${info?.whatsapp || '50661436871'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
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