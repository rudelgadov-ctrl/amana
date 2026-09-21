import { useLanguage } from '@/contexts/LanguageContext';

// "How it works" strip under the hero — three short steps.
const GiftSteps = () => {
  const { t } = useLanguage();

  const steps = [
    { n: '01', title: t.gift.steps.step1Title, text: t.gift.steps.step1Text },
    { n: '02', title: t.gift.steps.step2Title, text: t.gift.steps.step2Text },
    { n: '03', title: t.gift.steps.step3Title, text: t.gift.steps.step3Text },
  ];

  return (
    <section className="bg-blueberry border-t border-eggshell/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="font-body text-[11px] tracking-[0.3em] uppercase text-asparagus mb-5 sm:mb-6">
          {t.gift.steps.title}
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="font-display text-3xl sm:text-4xl text-yolk leading-none">{step.n}</span>
              <div className="space-y-1 pt-1">
                <p className="font-display text-lg sm:text-xl text-eggshell">{step.title}</p>
                <p className="font-body text-sm text-eggshell/65">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default GiftSteps;
