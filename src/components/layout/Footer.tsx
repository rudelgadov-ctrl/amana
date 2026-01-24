import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin, MessageCircle, Navigation, Star } from 'lucide-react';
import amanaFooterLogo from '@/assets/amana-footer-logo.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';

const TRIPADVISOR_URL = 'https://www.tripadvisor.es/Restaurant_Review-g309293-d26501860-Reviews-Amana-San_Jose_San_Jose_Metro_Province_of_San_Jose.html';

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: info } = useRestaurantInfo();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/menu', label: t.nav.menu },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const hours = [
    { day: language === 'es' ? 'Lunes' : 'Monday', time: info?.hours_monday || t.hours.closed },
    { day: language === 'es' ? 'Martes' : 'Tuesday', time: info?.hours_tuesday_wednesday || '18:00 - 22:00' },
    { day: language === 'es' ? 'Miércoles' : 'Wednesday', time: info?.hours_tuesday_wednesday || '18:00 - 22:00' },
    { day: language === 'es' ? 'Jueves' : 'Thursday', time: info?.hours_thursday_saturday || '12:00 - 16:00\n18:00 - 22:00' },
    { day: language === 'es' ? 'Viernes' : 'Friday', time: info?.hours_thursday_saturday || '12:00 - 16:00\n18:00 - 22:00' },
    { day: language === 'es' ? 'Sábado' : 'Saturday', time: info?.hours_thursday_saturday || '12:00 - 16:00\n18:00 - 22:00' },
    { day: language === 'es' ? 'Domingo' : 'Sunday', time: info?.hours_sunday || '12:00 - 16:00' },
  ];

  const address = language === 'es' ? info?.address_es : info?.address_en;

  return (
    <footer className="bg-blueberry text-eggshell">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <img src={amanaFooterLogo} alt="Amana" className="h-10 sm:h-12" />
            <p className="font-body text-sm sm:text-base text-asparagus italic">{t.footer.tagline}</p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2 sm:pt-4">
              <a
                href="https://www.instagram.com/amana.escalante/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a
                href={`https://wa.me/${info?.whatsapp || '50661436871'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.waze.com/ul?ll=9.936098,-84.064715&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="Waze"
              >
                <Navigation size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a
                href={TRIPADVISOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="TripAdvisor"
              >
                <Star size={20} className="sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-display text-base sm:text-lg font-bold">{t.footer.quickLinks}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm sm:text-base text-wafer hover:text-yolk transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-display text-base sm:text-lg font-bold">{t.footer.contact}</h4>
            <ul className="space-y-2 sm:space-y-3 font-body text-sm sm:text-base text-wafer">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-asparagus flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]" />
                <span className="text-xs sm:text-sm">{address || t.contactPage.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-asparagus sm:w-[18px] sm:h-[18px]" />
                <a
                  href={`tel:${info?.phone?.replace(/\s/g, '') || '+50661436871'}`}
                  className="hover:text-yolk transition-colors text-xs sm:text-sm"
                >
                  {info?.phone || t.contactPage.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-display text-base sm:text-lg font-bold">{t.footer.hours}</h4>
            <ul className="space-y-2 sm:space-y-2.5 font-body text-xs sm:text-sm">
              {hours.map((item, index) => (
                <li key={index} className="grid grid-cols-[80px_1fr] sm:grid-cols-[90px_1fr] gap-3 items-start">
                  <span className="text-wafer font-medium">{item.day}</span>
                  <span
                    className={`text-right whitespace-pre-line tabular-nums ${
                      item.time === t.hours.closed || item.time?.toLowerCase().includes('cerrado') || item.time?.toLowerCase().includes('closed')
                        ? 'text-asparagus'
                        : 'text-eggshell'
                    }`}
                  >
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-asparagus/20 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8">
          <p className="font-body text-xs sm:text-sm text-wafer text-center">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
