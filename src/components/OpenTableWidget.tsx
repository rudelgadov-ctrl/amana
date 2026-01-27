import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OpenTableWidgetProps {
  type?: 'standard' | 'wide' | 'tall' | 'button';
  theme?: 'standard' | 'neutral' | 'gold' | 'green' | 'blue' | 'red' | 'teal';
  color?: number;
  dark?: boolean;
  className?: string;
}

const RESTAURANT_RID = '1366720';

const OpenTableWidget = ({
  type = 'standard',
  theme = 'teal',
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

    // Create script element with cache-busting timestamp
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    const timestamp = Date.now();
    script.src = `https://www.opentable.com/widget/reservation/loader?rid=${RESTAURANT_RID}&type=${type}&theme=${theme}&color=${color}&dark=${dark}&iframe=true&domain=com&lang=${langCode}&newtab=false&overlay=true&ot_source=Restaurant%20website&cfe=true&t=${timestamp}`;

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
        width: '100%',
        minHeight: type === 'button' ? '50px' : 'auto',
      }}
    />
  );
};

export default OpenTableWidget;
