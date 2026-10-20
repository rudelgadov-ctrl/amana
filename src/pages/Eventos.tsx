import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import EventosHero from '@/components/eventos/EventosHero';
import EventTypesSection from '@/components/eventos/EventTypesSection';
import EventSpacesSection from '@/components/eventos/EventSpacesSection';
import EventMenusSection from '@/components/eventos/EventMenusSection';
import EventStepsSection from '@/components/eventos/EventStepsSection';
import EventQuoteForm from '@/components/eventos/EventQuoteForm';
import EventFaqSection from '@/components/eventos/EventFaqSection';

// Page-specific <title> and meta description (from the CMS); restored when leaving the page.
const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousTitle = document.title;
    const previousDescription = meta?.content;

    if (title) document.title = title;
    if (meta && description) meta.content = description;

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== undefined) meta.content = previousDescription;
    };
  }, [title, description]);
};

const Eventos = () => {
  const { t } = useLanguage();
  usePageMeta(t.eventsPage.meta.title, t.eventsPage.meta.description);

  return (
    <Layout>
      <EventosHero />
      <EventTypesSection />
      <EventSpacesSection />
      <EventMenusSection />
      <EventStepsSection />
      <EventQuoteForm />
      <EventFaqSection />
    </Layout>
  );
};

export default Eventos;
