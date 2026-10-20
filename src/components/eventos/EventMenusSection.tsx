import { useLanguage } from '@/contexts/LanguageContext';

// Menu cards + pricing notes and conditions. Prices are plain CMS text so each language can format them.
const EventMenusSection = () => {
  const { t } = useLanguage();
  const copy = t.eventsPage.menus;

  const menus = [
    { title: copy.menu1Title, text: copy.menu1Text, price: copy.menu1Price },
    { title: copy.menu2Title, text: copy.menu2Text, price: copy.menu2Price },
    { title: copy.menu3Title, text: copy.menu3Text, price: copy.menu3Price },
  ].filter((menu) => menu.title.trim());

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-eggshell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-blueberry mb-8 sm:mb-10">
          {copy.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {menus.map((menu) => (
            <div key={menu.title} className="flex flex-col rounded-2xl border border-asparagus/30 bg-white p-6 sm:p-8">
              <h3 className="font-display text-2xl text-blueberry">{menu.title}</h3>
              {menu.text && <p className="mt-2 font-body text-blueberry/70">{menu.text}</p>}
              {menu.price && (
                <p className="mt-auto pt-6 font-display text-xl sm:text-2xl font-bold text-blueberry">{menu.price}</p>
              )}
            </div>
          ))}
        </div>

        {copy.pricesNote && <p className="mt-6 font-body text-sm text-blueberry/60">{copy.pricesNote}</p>}

        {(copy.conditionsTitle || copy.conditionsText) && (
          <div className="mt-8 rounded-2xl border border-asparagus/30 p-6 sm:p-8">
            <h3 className="font-display text-xl text-blueberry">{copy.conditionsTitle}</h3>
            <p className="mt-2 font-body text-blueberry/70 whitespace-pre-line">{copy.conditionsText}</p>
          </div>
        )}

        {copy.customBudget && (
          <div className="mt-5 rounded-2xl bg-cta p-6 sm:p-8 text-cta-foreground">
            <p className="font-body text-lg font-medium">{copy.customBudget}</p>
          </div>
        )}

        {copy.invoiceNote && <p className="mt-4 font-body text-xs text-blueberry/60">{copy.invoiceNote}</p>}
      </div>
    </section>
  );
};

export default EventMenusSection;
