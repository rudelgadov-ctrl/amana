import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Handles URL-based language selection:
 * - Path prefixes: /en/... or /es/... set language and strip the prefix
 * - Query param: ?lang=en or ?lang=es sets language and removes the param
 */
const LanguageRouteHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const first = segments[0]?.toLowerCase();

    if (first === 'en' || first === 'es') {
      setLanguage(first as 'en' | 'es');
      const rest = '/' + segments.slice(1).join('/');
      navigate(rest + location.search + location.hash, { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const queryLang = params.get('lang')?.toLowerCase();
    if (queryLang === 'en' || queryLang === 'es') {
      setLanguage(queryLang as 'en' | 'es');
      params.delete('lang');
      const newSearch = params.toString();
      navigate(location.pathname + (newSearch ? `?${newSearch}` : '') + location.hash, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate, setLanguage]);

  return null;
};

export default LanguageRouteHandler;
