import { useLanguage } from '@/contexts/LanguageContext';
import { useEvents } from '@/hooks/useEvents';
import { ScrollAnimation } from '@/hooks/useScrollAnimation';

const UpcomingEventsSection = () => {
  const { language, t } = useLanguage();
  const { data: events, isLoading } = useEvents(true);

  // Don't render if no events
  if (isLoading || !events || events.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 sm:mt-12 md:mt-16 pt-8 sm:pt-10 md:pt-12 border-t border-eggshell/20">
      <ScrollAnimation animation="fade-up">
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-eggshell text-center mb-6 sm:mb-8">
          {t.events?.title || (language === 'es' ? 'Próximos Eventos' : 'Upcoming Events')}
        </h3>
      </ScrollAnimation>

      <div className="space-y-4 sm:space-y-6">
        {events.map((event, index) => (
          <ScrollAnimation key={event.id} animation="fade-up" delay={100 * (index + 1)}>
            <div className="text-center">
              <p className="font-body text-sm sm:text-base text-wafer/80">
                {language === 'es' ? event.date_text_es : event.date_text_en}
              </p>
              <p className="font-display text-lg sm:text-xl md:text-2xl font-bold text-eggshell mt-1">
                {language === 'es' ? event.title_es : event.title_en}
              </p>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsSection;
