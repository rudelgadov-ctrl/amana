import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteImages } from '@/hooks/useSiteImages';
import { isVideoUrl } from '@/lib/media';

// Fallback when the CMS has no active media for this location
const FALLBACK_VIDEO = '/videos/chefs-table-v2.mp4';

const ChefsTablePhotoCarousel = () => {
  const { language } = useLanguage();
  // Managed from Admin > Imágenes, location "menu-chefs-table" (image or video)
  const { data: cmsMedia } = useSiteImages('menu-chefs-table');
  const media = cmsMedia?.[0];

  const src = media?.url || FALLBACK_VIDEO;
  const alt = (language === 'es' ? media?.alt_text_es : media?.alt_text_en) || "Chef's Table";
  const mediaClassName = 'h-auto w-full md:max-h-[450px] lg:max-h-[500px]';

  return (
    <div className="relative inline-flex rounded-lg overflow-hidden shadow-lg">
      {isVideoUrl(src) ? (
        <video
          key={src}
          src={src}
          className={mediaClassName}
          aria-label={alt}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img src={src} alt={alt} className={`${mediaClassName} object-cover`} />
      )}
    </div>
  );
};
export default ChefsTablePhotoCarousel;
