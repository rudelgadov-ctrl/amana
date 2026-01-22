import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-dish.jpg';

const ScrollAnimationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-blueberry">
      <ContainerScroll
        titleComponent={
          <div className="space-y-4">
            <p className="font-body text-asparagus text-sm tracking-widest uppercase">
              {t.hero.location}
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-eggshell leading-tight">
              {t.hero.title}
            </h1>
            <p className="font-display text-xl md:text-2xl text-asparagus font-light italic">
              {t.hero.subtitle}
            </p>
          </div>
        }
      >
        <img
          src={heroImage}
          alt="Amana Escalante - Plato signature"
          className="w-full h-full object-cover object-center rounded-xl"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
};

export default ScrollAnimationSection;
