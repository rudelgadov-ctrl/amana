import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();

  const hours = [
    { day: t.hours.monday, time: t.hours.closed, closed: true },
    { day: t.hours.tuesdayWednesday, time: t.hours.dinner, closed: false },
    { day: t.hours.thursdaySaturday, time: t.hours.lunchDinner, closed: false },
    { day: t.hours.sunday, time: t.hours.lunch, closed: false },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-blueberry">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-eggshell">
            {t.contactPage.title}
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-eggshell">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Location Card */}
              <Card className="border-asparagus/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blueberry" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-blueberry mb-2">
                        {t.contactPage.address}
                      </h3>
                      <p className="font-body text-blueberry/70">
                        Barrio Escalante, San José, Costa Rica
                      </p>
                    </div>
                  </div>

                  {/* Direction Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      asChild
                      className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body transition-all duration-300"
                    >
                      <a
                        href="https://ul.waze.com/ul?venue_id=180813923.1808401378.36293324"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Navigation size={18} />
                        Waze
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body transition-all duration-300"
                    >
                      <a
                        href="https://maps.google.com/?q=Amana+Escalante+Costa+Rica"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MapPin size={18} />
                        Google Maps
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="border-asparagus/20">
                <CardContent className="p-6 space-y-6">
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-blueberry/60">Teléfono</p>
                      <a
                        href="tel:+50661436871"
                        className="font-body text-lg text-blueberry hover:text-asparagus transition-colors"
                      >
                        {t.contactPage.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-blueberry/60">Email</p>
                      <a
                        href="mailto:info@amanacr.com"
                        className="font-body text-lg text-blueberry hover:text-asparagus transition-colors"
                      >
                        {t.contactPage.email}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-sm text-blueberry/60">WhatsApp</p>
                      <a
                        href="https://wa.me/50661436871"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-lg text-blueberry hover:text-asparagus transition-colors"
                      >
                        {t.reservation.whatsappCta}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="border-asparagus/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-blueberry" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-blueberry">
                      {t.contactPage.hoursTitle}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {hours.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-asparagus/10 last:border-0"
                      >
                        <span className="font-body text-blueberry">{item.day}</span>
                        <span
                          className={`font-body ${
                            item.closed ? 'text-asparagus' : 'text-blueberry'
                          }`}
                        >
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="lg:sticky lg:top-24">
              <div className="aspect-square lg:aspect-auto lg:h-full min-h-[400px] bg-blueberry/10 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.879!2d-84.063!3d9.936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBarrio+Escalante!5e0!3m2!1sen!2scr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Amana Location"
                  className="grayscale contrast-125"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blueberry">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eggshell mb-6">
            {t.cta.title}
          </h2>
          <Button
            asChild
            className="border-2 border-eggshell bg-transparent text-eggshell hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-10 py-6 text-lg transition-all duration-300"
          >
            <a
              href="https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.cta.button}
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
