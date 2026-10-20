import { useLanguage } from '@/contexts/LanguageContext';

// "How it works" — four numbered steps. Clearing a step in the CMS hides it and renumbers the rest.
const EventStepsSection = () => {
  const { t } = useLanguage();
  const copy = t.eventsPage.steps;

  const steps = [copy.step1, copy.step2, copy.step3, copy.step4].filter((step) => step.trim());

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-blueberry">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-eggshell mb-8 sm:mb-10">
          {copy.title}
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <li key={step}>
              <span className="font-display text-4xl sm:text-5xl text-yolk leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 font-body text-eggshell/80">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default EventStepsSection;
