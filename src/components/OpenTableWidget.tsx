import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OpenTableWidgetProps {
  type?: 'standard' | 'wide' | 'tall' | 'button';
  theme?: 'standard' | 'wide' | 'tall';
  color?: number;
  dark?: boolean;
  className?: string;
}

const RESTAURANT_RID = '1366720';

const OpenTableWidget = ({
  type = 'standard',
  theme = 'wide',
  color = 5,
  dark = false,
  className = '',
}: OpenTableWidgetProps) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptId = `opentable-script-${type}`;

  useEffect(() => {
    // Remove existing script if any
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Determine language code
    const langCode = language === 'es' ? 'es-MX' : 'en-US';

    // Create script element
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.opentable.com/widget/reservation/loader?rid=${RESTAURANT_RID}&type=${type}&theme=${theme}&color=${color}&dark=${dark}&iframe=true&domain=com&lang=${langCode}&newtab=false&overlay=true&ot_source=Restaurant%20website&cfe=true`;

    // Append script to container
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [language, type, theme, color, dark, scriptId]);

  return (
    <div 
      ref={containerRef} 
      className={`opentable-widget-container ${className}`}
      style={{ 
        minHeight: type === 'button' ? '50px' : 'auto',
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto'
      }}
    />
  );
};

export default OpenTableWidget;
