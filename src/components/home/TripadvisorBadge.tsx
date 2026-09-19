import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Embed codes provided by Tripadvisor for the Travelers' Choice 2026 award.
// The two versions only differ in the widget id, its language and the domain
// the badge links to.
const WIDGETS = {
  en: {
    uniq: '183',
    lang: 'en_US',
    href: 'https://www.tripadvisor.com/Restaurant_Review-g309293-d26501860-Reviews-Amana-San_Jose_San_Jose_Metro_Province_of_San_Jose.html',
  },
  es: {
    uniq: '751',
    lang: 'es_MX',
    href: 'https://www.tripadvisor.com.mx/Restaurant_Review-g309293-d26501860-Reviews-Amana-San_Jose_San_Jose_Metro_Province_of_San_Jose.html',
  },
} as const;

const LOCATION_ID = '26501860';
const YEAR = '2026';
const BADGE_IMG = 'https://static.tacdn.com/img2/travelers_choice/widgets/tchotel_2026_L.png';

const TripadvisorBadge = () => {
  const { language } = useLanguage();
  const widget = WIDGETS[language];
  const containerId = `TA_certificateOfExcellence${widget.uniq}`;

  // Tripadvisor's embed is a <script> tag, which React does not execute from
  // JSX, so it is injected here and swapped whenever the language changes.
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.jscache.com/wejs?wtype=certificateOfExcellence&uniq=${widget.uniq}&locationId=${LOCATION_ID}&lang=${widget.lang}&year=${YEAR}&display_version=2`;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [widget]);

  // Same markup the widget renders, so the badge shows even before the
  // script loads (or if it is blocked).
  return (
    <div key={containerId} id={containerId} className="TA_certificateOfExcellence">
      <ul className="TA_links list-none m-0 p-0">
        <li>
          <a href={widget.href} target="_blank" rel="noopener noreferrer" aria-label="Tripadvisor Travelers' Choice 2026">
            <img
              src={BADGE_IMG}
              alt="Tripadvisor Travelers' Choice 2026"
              className="widCOEImg block w-[110px] sm:w-[130px] h-auto"
              id="CDSWIDCOELOGO"
              loading="lazy"
              width={200}
              height={262}
            />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TripadvisorBadge;
