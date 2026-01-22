import Layout from '@/components/layout/Layout';
import ScrollAnimationSection from '@/components/home/ScrollAnimationSection';
import ConceptSection from '@/components/home/ConceptSection';
import ReservationSection from '@/components/home/ReservationSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <ScrollAnimationSection />
      <ConceptSection />
      <ReservationSection />
      <ReviewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
