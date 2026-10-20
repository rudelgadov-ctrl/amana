import { useLanguage } from '@/contexts/LanguageContext';

// Three event categories. Clearing a title in the CMS hides that card.
const EventTypesSection = () => {
  const { t } = useLanguage();
  const copy = t.eventsPage.types;

  const types = [
    { title: copy.type1Title, text: copy.type1Text },
    { title: copy.type2Title, text: copy.type2Text },
    { title: copy.type3Title, text: copy.type3Text },
  ].filter((type) => type.title.trim());

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-eggshell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-blueberry mb-8 sm:mb-10">
          {copy.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {types.map((type) => (
            <div key={type.title} className="rounded-2xl border border-asparagus/30 bg-white p-6 sm:p-8">
              <div className="h-0.5 w-10 bg-asparagus mb-5" aria-hidden="true" />
              <h3 className="font-display text-2xl text-blueberry">{type.title}</h3>
              {type.text && <p className="mt-3 font-body text-blueberry/70">{type.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypesSection;
