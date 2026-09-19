import { useLanguage } from '@/contexts/LanguageContext';
import badgeImg from '@/assets/tripadvisor-travelers-choice-2026.png';

// Tripadvisor Travelers' Choice 2026. The badge links to the restaurant's
// Tripadvisor page in the visitor's language.
const TRIPADVISOR_URLS = {
  en: 'https://www.tripadvisor.com/Restaurant_Review-g309293-d26501860-Reviews-Amana-San_Jose_San_Jose_Metro_Province_of_San_Jose.html',
  es: 'https://www.tripadvisor.com.mx/Restaurant_Review-g309293-d26501860-Reviews-Amana-San_Jose_San_Jose_Metro_Province_of_San_Jose.html',
} as const;

const TripadvisorBadge = () => {
  const { language } = useLanguage();

  return (
    <a
      href={TRIPADVISOR_URLS[language]}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tripadvisor Travelers' Choice 2026"
      className="block transition-transform hover:scale-105"
    >
      <img
        src={badgeImg}
        alt="Tripadvisor Travelers' Choice 2026"
        className="block w-[120px] sm:w-[140px] h-auto"
        width={427}
        height={520}
      />
    </a>
  );
};

export default TripadvisorBadge;
