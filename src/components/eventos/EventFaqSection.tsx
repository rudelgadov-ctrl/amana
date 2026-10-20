import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';

// FAQ accordion. Clearing a question in the CMS hides that entry.
const EventFaqSection = () => {
  const { t } = useLanguage();
  const copy = t.eventsPage.faq;

  const faqs = [
    { q: copy.q1, a: copy.a1 },
    { q: copy.q2, a: copy.a2 },
    { q: copy.q3, a: copy.a3 },
    { q: copy.q4, a: copy.a4 },
    { q: copy.q5, a: copy.a5 },
  ].filter((faq) => faq.q.trim());

  if (faqs.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-eggshell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-blueberry mb-8 sm:mb-10">
          {copy.title}
        </h2>
        <Accordion type="single" collapsible className="max-w-3xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className="border-asparagus/30">
              <AccordionTrigger className="py-5 text-left font-display text-lg sm:text-xl font-normal text-blueberry hover:no-underline hover:text-asparagus">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line font-body text-base text-blueberry/70">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default EventFaqSection;
