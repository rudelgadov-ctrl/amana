import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import amanaLogo from '@/assets/amana-logo.png';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/menu', label: t.nav.menu },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isMobileMenuOpen
          ? 'bg-blueberry shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={amanaLogo}
              alt="Amana"
              className="h-10 lg:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'font-body text-sm tracking-wide transition-colors duration-200',
                  isActive(link.href)
                    ? 'text-yolk'
                    : 'text-eggshell hover:text-asparagus'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Language toggle + Reserve button */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="font-body text-sm text-eggshell hover:text-asparagus transition-colors px-2 py-1 border border-asparagus/30 rounded"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </button>

            {/* Reserve Button - Uses CTA color (Yolk) */}
            <Button
              asChild
              className="bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium px-6"
            >
              <a
                href="https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.nav.reserve}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-eggshell p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-blueberry border-t border-asparagus/20 py-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'font-body text-lg py-2 transition-colors',
                    isActive(link.href)
                      ? 'text-yolk'
                      : 'text-eggshell hover:text-asparagus'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-4 pt-4 border-t border-asparagus/20">
                <button
                  onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                  className="font-body text-sm text-eggshell border border-asparagus/30 rounded px-3 py-2"
                >
                  {language === 'es' ? 'English' : 'Español'}
                </button>

                <Button
                  asChild
                  className="bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium flex-1"
                >
                  <a
                    href="https://www.opentable.com/restref/client/?rid=1366720&restref=1366720&lang=es-MX"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.nav.reserve}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
