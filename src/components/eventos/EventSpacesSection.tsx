import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteImages } from '@/hooks/useSiteImages';
import salonAzulFallback from '@/assets/eventos/salon-azul.jpg';
import salonVerdeFallback from '@/assets/eventos/salon-verde.jpg';
import salonPrincipalFallback from '@/assets/eventos/salon-principal.jpg';
import chefsTableFallback from '@/assets/eventos/chefs-table.jpg';

interface SpaceCardProps {
  location: string;
  fallback: string;
  name: string;
  tag: string;
  capacity: string;
}

// Each photo is its own slot in Admin > Imágenes ("Eventos · …"), with the bundled image as fallback.
const SpaceCard = ({ location, fallback, name, tag, capacity }: SpaceCardProps) => {
  const { language } = useLanguage();
  const { data: images } = useSiteImages(location);
  const image = images?.[0];
  const alt = (language === 'es' ? image?.alt_text_es : image?.alt_text_en) || name;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-eggshell shadow-sm">
      <img
        src={image?.url || fallback}
        alt={alt}
        loading="lazy"
        width={944}
        height={704}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-blueberry">{name}</h3>
        {tag && <p className="mt-1 font-body text-sm text-blueberry/60">{tag}</p>}
        <p className="mt-auto pt-3 font-body font-medium text-blueberry">{capacity}</p>
      </div>
    </div>
  );
};

const EventSpacesSection = () => {
  const { t } = useLanguage();
  const copy = t.eventsPage.spaces;

  const spaces: SpaceCardProps[] = [
    { location: 'events-space-azul', fallback: salonAzulFallback, name: copy.azulName, tag: copy.azulTag, capacity: copy.azulCapacity },
    { location: 'events-space-verde', fallback: salonVerdeFallback, name: copy.verdeName, tag: copy.verdeTag, capacity: copy.verdeCapacity },
    {
      location: 'events-space-principal',
      fallback: salonPrincipalFallback,
      name: copy.principalName,
      tag: copy.principalTag,
      capacity: copy.principalCapacity,
    },
    {
      location: 'events-space-chefs-table',
      fallback: chefsTableFallback,
      name: copy.chefsName,
      tag: copy.chefsTag,
      capacity: copy.chefsCapacity,
    },
  ];

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#dad8c8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-blueberry mb-8 sm:mb-10">
          {copy.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {spaces.map((space) => (
            <SpaceCard key={space.location} {...space} />
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-blueberry p-6 md:p-8 text-eggshell">
          <h3 className="font-display text-2xl">{copy.fullTitle}</h3>
          <p className="mt-2 font-body text-eggshell/75">{copy.fullText}</p>
        </div>
      </div>
    </section>
  );
};

export default EventSpacesSection;
