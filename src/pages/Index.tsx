import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ConceptSection from '@/components/home/ConceptSection';
import ReservationSection from '@/components/home/ReservationSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ConceptSection />
      <ReservationSection />
      <ReviewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
