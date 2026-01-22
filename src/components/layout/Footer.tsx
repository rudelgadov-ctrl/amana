import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin, MessageCircle } from 'lucide-react';
import amanaIcon from '@/assets/amana-logo.png';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/menu', label: t.nav.menu },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const hours = [
    { day: t.hours.monday, time: t.hours.closed },
    { day: t.hours.tuesdayWednesday, time: t.hours.dinner },
    { day: t.hours.thursdaySaturday, time: t.hours.lunchDinner },
    { day: t.hours.sunday, time: t.hours.lunch },
  ];

  return (
    <footer className="bg-blueberry text-eggshell">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={amanaIcon} alt="Amana" className="h-12" />
            <p className="font-body text-asparagus italic">{t.footer.tagline}</p>
            
            {/* Social Icons */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://instagram.com/amanacr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://wa.me/50661436871"
                target="_blank"
                rel="noopener noreferrer"
                className="text-asparagus hover:text-yolk transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-wafer hover:text-yolk transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold">{t.footer.contact}</h4>
            <ul className="space-y-3 font-body text-wafer">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-asparagus flex-shrink-0 mt-0.5" />
                <span>{t.contactPage.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-asparagus" />
                <a href="tel:+50661436871" className="hover:text-yolk transition-colors">
                  {t.contactPage.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold">{t.footer.hours}</h4>
            <ul className="space-y-2 font-body text-sm">
              {hours.map((item, index) => (
                <li key={index} className="flex justify-between gap-4">
                  <span className="text-wafer">{item.day}</span>
                  <span className={item.time === t.hours.closed ? 'text-asparagus' : 'text-eggshell'}>
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-asparagus/20 mt-12 pt-8">
          <p className="font-body text-sm text-wafer text-center">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
