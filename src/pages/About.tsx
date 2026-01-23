import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Award, Users } from 'lucide-react';
import chefKennethImg from '@/assets/chef-kenneth.jpg';
import teamPhoto1 from '@/assets/team-photo-1.jpg';
import teamPhoto2 from '@/assets/team-photo-2.jpg';
const About = () => {
  const {
    t
  } = useLanguage();
  const achievements = [t.about.achievement1, t.about.achievement2, t.about.achievement3];
  return <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-blueberry">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="font-body text-asparagus text-sm tracking-widest uppercase mb-4">
            {t.about.heroSubtitle}
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-eggshell">
            {t.about.heroTitle}
          </h1>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-asparagus">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-display text-4xl font-bold text-blueberry">
              {t.about.storyTitle}
            </h2>
            <div className="font-body text-lg text-blueberry/70 leading-relaxed whitespace-pre-line">
              {t.about.storyText}
            </div>
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-24 bg-wafer">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Chef Image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden order-2 lg:order-1">
              <img src={chefKennethImg} alt="Chef Kenneth" className="w-full h-full object-cover" />
            </div>

            {/* Chef Info */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-blueberry">
                  {t.about.chefTitle}
                </h2>
                <p className="font-body text-lg text-blueberry/70 leading-relaxed">
                  {t.about.chefBio}
                </p>
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-blueberry flex items-center gap-2">
                  <Award className="w-6 h-6 text-asparagus" />
                  {t.about.achievements}
                </h3>
                <ul className="space-y-3">
                  {achievements.map((achievement, index) => <li key={index} className="font-body text-blueberry/70 pl-4 border-l-2 border-asparagus">
                      {achievement}
                    </li>)}
                </ul>
              </div>

              {/* CTA */}
              <Button asChild className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-8 transition-all duration-300">
                <a href="https://www.opentable.com" target="_blank" rel="noopener noreferrer">
                  {t.nav.reserve}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-blueberry">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-6 h-6 text-asparagus" />
              <p className="font-body text-asparagus text-sm tracking-widest uppercase">
                {t.about.teamSubtitle}
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-eggshell">
              {t.about.teamTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={teamPhoto1} 
                alt="Equipo Amana" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={teamPhoto2} 
                alt="Equipo Amana" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <p className="font-body text-lg text-eggshell/70 text-center mt-8 max-w-2xl mx-auto">
            {t.about.teamDescription}
          </p>
        </div>
      </section>
    </Layout>;
};
export default About;