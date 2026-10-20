import { ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteImages } from '@/hooks/useSiteImages';

interface MenuCardProps {
  location: string;
  title: string;
  text: string;
  price: string;
}

// Each card photo is its own slot in Admin > Imágenes ("Eventos · Menú …"); until one is uploaded a neutral placeholder is shown.
// Dish photos are usually portrait and dark, so the frame is 4:5 and centered on the plate.
const MenuCard = ({ location, title, text, price }: MenuCardProps) => {
  const { language } = useLanguage();
  const { data: images } = useSiteImages(location);
  const image = images?.[0];
  const alt = (language === 'es' ? image?.alt_text_es : image?.alt_text_en) || title;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-asparagus/30 bg-white">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-blueberry/5">
        {image?.url ? (
          <img
            src={image.url}
            alt={alt}
            loading="lazy"
            width={800}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-blueberry/25" aria-hidden="true">
            <ImageIcon className="h-10 w-10" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="font-display text-2xl text-blueberry">{title}</h3>
        {text && <p className="mt-2 font-body text-blueberry/70">{text}</p>}
        {price && <p className="mt-auto pt-6 font-display text-xl sm:text-2xl font-bold text-blueberry">{price}</p>}
      </div>
    </div>
  );
};

// Menu cards + pricing notes and conditions. Prices are plain CMS text so each language can format them.
const EventMenusSection = () => {
  const { t } = useLanguage();
  const copy = t.eventsPage.menus;

  const menus = [
    { location: 'events-menu-1', title: copy.menu1Title, text: copy.menu1Text, price: copy.menu1Price },
    { location: 'events-menu-2', title: copy.menu2Title, text: copy.menu2Text, price: copy.menu2Price },
    { location: 'events-menu-3', title: copy.menu3Title, text: copy.menu3Text, price: copy.menu3Price },
  ].filter((menu) => menu.title.trim());

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-eggshell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-blueberry mb-8 sm:mb-10">
          {copy.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {menus.map((menu) => (
            <MenuCard key={menu.location} {...menu} />
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
