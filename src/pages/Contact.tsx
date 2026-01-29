import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, Instagram } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

const Contact = () => {
  const { t, language } = useLanguage();
  const { data: info } = useContactInfo();

  const hours = [
    {
      day: language === 'es' ? 'Lunes' : 'Monday',
      time: info?.hoursMonday || (language === 'es' ? 'Cerrado' : 'Closed'),
      closed: true,
    },
    {
      day: language === 'es' ? 'Martes - Miércoles' : 'Tuesday - Wednesday',
      time: info?.hoursTuesdayWednesday || (language === 'es' ? 'Cena 6-10 PM' : 'Dinner 6-10 PM'),
      closed: false,
    },
    {
      day: language === 'es' ? 'Jueves - Sábado' : 'Thursday - Saturday',
      time: info?.hoursThursdaySaturday || (language === 'es' ? 'Almuerzo 12-4 PM\nCena 6-10 PM' : 'Lunch 12-4 PM\nDinner 6-10 PM'),
      closed: false,
    },
    {
      day: language === 'es' ? 'Domingo' : 'Sunday',
      time: info?.hoursSunday || (language === 'es' ? 'Almuerzo 12-4 PM' : 'Lunch 12-4 PM'),
      closed: false,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 bg-blueberry">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-eggshell">
            {t.contactPage.title}
          </h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#dad8c8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 bg-[#dad8c8]">
              {/* Location Card */}
              <Card className="border-0 bg-eggshell shadow-md">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blueberry" />
                    </div>
                    <div>
                      <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-blueberry mb-1 sm:mb-2">
                        {info?.address || t.contactPage.address}
                      </h3>
                      <p className="font-body text-xs sm:text-sm md:text-base text-blueberry/70">
                        {t.contactPage.addressLine2}
                      </p>
                    </div>
                  </div>

                  {/* Direction Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <Button
                      asChild
                      size="sm"
                      className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body transition-all duration-300 text-xs sm:text-sm"
                    >
                      <a
                        href={info?.wazeLink || 'https://www.waze.com/ul?ll=9.936098,-84.064715&navigate=yes'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 sm:gap-2"
                      >
                        <Navigation size={14} className="sm:w-[18px] sm:h-[18px]" />
                        Waze
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body transition-all duration-300 text-xs sm:text-sm"
                    >
                      <a
                        href={info?.googleMapsLink || 'https://maps.app.goo.gl/N8ZpSXeiysPdpVQc7'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 sm:gap-2"
                      >
                        <MapPin size={14} className="sm:w-[18px] sm:h-[18px]" />
                        Google Maps
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="border-0 bg-eggshell shadow-md">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Phone */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-xs sm:text-sm text-blueberry/60">
                        {language === 'es' ? 'Teléfono' : 'Phone'}
                      </p>
                      <a
                        href={`tel:${info?.phone?.replace(/\s/g, '') || '+50661436871'}`}
                        className="font-body text-sm sm:text-base md:text-lg text-blueberry hover:text-asparagus transition-colors"
                      >
                        {info?.phone || t.contactPage.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-xs sm:text-sm text-blueberry/60">Email</p>
                      <a
                        href={`mailto:${info?.email || 'info@amanacr.com'}`}
                        className="font-body text-sm sm:text-base md:text-lg text-blueberry hover:text-asparagus transition-colors break-all"
                      >
                        {info?.email || t.contactPage.email}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-xs sm:text-sm text-blueberry/60">WhatsApp</p>
                      <a
                        href={`https://wa.me/${info?.whatsapp || '50661436871'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm sm:text-base md:text-lg text-blueberry hover:text-asparagus transition-colors"
                      >
                        {t.reservation.whatsappCta}
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-blueberry" />
                    </div>
                    <div>
                      <p className="font-body text-xs sm:text-sm text-blueberry/60">Instagram</p>
                      <a
                        href="https://www.instagram.com/amana.escalante/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm sm:text-base md:text-lg text-blueberry hover:text-asparagus transition-colors"
                      >
                        {info?.instagram || '@amana.escalante'}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="border-0 bg-eggshell shadow-md">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wafer flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blueberry" />
                    </div>
                    <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-blueberry">
                      {t.contactPage.hoursTitle}
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {hours.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1.5 sm:py-2 border-b border-asparagus/10 last:border-0"
                      >
                        <span className="font-body text-xs sm:text-sm md:text-base text-blueberry">{item.day}</span>
                        <span
                          className={`font-body text-xs sm:text-sm md:text-base whitespace-pre-line text-right ${item.closed ? 'text-asparagus' : 'text-blueberry'}`}
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
            <div className="lg:sticky lg:top-24 w-full">
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-blueberry/10 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.97381735812!2d-84.0672354249697!3d9.936136390166055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e38bf3c158af%3A0xbb7bdbd36c1b3c1!2sAmana!5e0!3m2!1ses-419!2scr!4v1769273667246!5m2!1ses-419!2scr"
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
      <section className="py-10 sm:py-12 md:py-16 bg-blueberry">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-eggshell mb-4 sm:mb-6">
            {t.cta.title}
          </h2>
          <Button
            asChild
            className="border-2 border-eggshell bg-transparent text-eggshell hover:bg-cta hover:text-cta-foreground hover:border-cta font-body font-medium px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg transition-all duration-300"
          >
            <a
              href={info?.opentableLink || 'https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX'}
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
