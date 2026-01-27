import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Award, Users } from 'lucide-react';
import chefKennethImg from '@/assets/chef-kenneth.jpg';
import restaurantInteriorImg from '@/assets/restaurant-interior.jpg';
import TeamPhotoCarousel from '@/components/about/TeamPhotoCarousel';
const About = () => {
  const {
    t
  } = useLanguage();
  const achievements = [t.about.achievement1, t.about.achievement2, t.about.achievement3];
  return <Layout>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 bg-blueberry">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-eggshell">
            {t.about.heroTitle}
          </h1>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-asparagus">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-4 sm:space-y-6 lg:order-1">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blueberry">
                {t.about.storyTitle}
              </h2>
              <div className="font-body text-sm sm:text-base md:text-lg text-blueberry/70 leading-relaxed whitespace-pre-line">
                {t.about.storyText}
              </div>
            </div>

            {/* Image */}
            <div className="aspect-square max-w-sm mx-auto lg:max-w-md rounded-lg overflow-hidden lg:order-2">
              
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-blueberry">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-asparagus" />
              <p className="font-body text-asparagus text-xs sm:text-sm tracking-widest uppercase">
                {t.about.teamSubtitle}
              </p>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-eggshell">
              {t.about.teamTitle}
            </h2>
          </div>

          <TeamPhotoCarousel />

          <p className="font-body text-sm sm:text-base md:text-lg text-eggshell/70 text-center mt-6 sm:mt-8 max-w-2xl mx-auto">
            {t.about.teamDescription}
          </p>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-wafer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            {/* Chef Image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden lg:order-1">
              <img src={chefKennethImg} alt="Chef Kenneth" className="w-full h-full object-cover" />
            </div>

            {/* Chef Info */}
            <div className="space-y-6 sm:space-y-8 lg:order-2">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blueberry">
                  {t.about.chefTitle}
                </h2>
                <p className="font-body text-sm sm:text-base md:text-lg text-blueberry/70 leading-relaxed">
                  {t.about.chefBio}
                </p>
              </div>

              {/* Achievements */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-blueberry flex items-center gap-2">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-asparagus" />
                  {t.about.achievements}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {achievements.map((achievement, index) => <li key={index} className="font-body text-sm sm:text-base text-blueberry/70 pl-3 sm:pl-4 border-l-2 border-asparagus">
                      {achievement}
                    </li>)}
                </ul>
              </div>

              {/* CTA */}
              <Button asChild className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-6 sm:px-8 transition-all duration-300">
                
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default About;