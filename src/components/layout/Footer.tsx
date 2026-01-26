import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin, MessageCircle, Star, Facebook, CalendarCheck } from 'lucide-react';
import amanaFooterLogo from '@/assets/amana-footer-logo.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRestaurantInfo } from '@/hooks/useRestaurantInfo';

const TRIPADVISOR_URL = 'https://www.tripadvisor.es/Restaurant_Review-g309293-d26501860-Reviews-Amana-San_Jose_San_Jose_Metro_Province_of_San_Jose.html';
const OPENTABLE_URL = 'https://www.opentable.com/r/amana-san-jose-1160';
const FACEBOOK_URL = 'https://www.facebook.com/amana.escalante';

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
    { day: language === 'es' ? 'Lunes' : 'Monday', time: language === 'es' ? 'Cerrado' : 'Closed', closed: true },
    { day: language === 'es' ? 'Martes - Miércoles' : 'Tuesday - Wednesday', time: language === 'es' ? 'Cena 6-10 PM' : 'Dinner 6-10 PM', closed: false },
    { day: language === 'es' ? 'Jueves - Sábado' : 'Thursday - Saturday', time: language === 'es' ? 'Almuerzo 12-4 PM, Cena 6-10 PM' : 'Lunch 12-4 PM, Dinner 6-10 PM', closed: false },
    { day: language === 'es' ? 'Domingo' : 'Sunday', time: language === 'es' ? 'Almuerzo 12-4 PM' : 'Lunch 12-4 PM', closed: false },
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
                href={OPENTABLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="OpenTable"
              >
                <CalendarCheck size={20} className="sm:w-6 sm:h-6" />
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
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} className="sm:w-6 sm:h-6" />
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
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <h4 className="font-display text-base sm:text-lg font-bold">{t.footer.hours}</h4>
            <div className="space-y-2 sm:space-y-2.5">
              {hours.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-2 py-1.5 sm:py-2 border-b border-asparagus/20 last:border-0"
                >
                  <span className="font-body text-xs sm:text-sm text-wafer flex-shrink-0">{item.day}</span>
                  <span
                    className={`font-body text-xs sm:text-sm text-right ${
                      item.closed ? 'text-asparagus' : 'text-eggshell'
                    }`}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
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
