import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableSectionProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

// Height-auto expand/collapse using the grid-rows trick, plus a smooth scroll
// into view when opened (scroll-mt accounts for the fixed header).
const ExpandableSection = ({ isOpen, children, className }: ExpandableSectionProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        'grid scroll-mt-24 transition-[grid-template-rows] duration-500 ease-out',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        className
      )}
      aria-hidden={!isOpen}
    >
      <div className="overflow-hidden">
        {isOpen && <div className="animate-in fade-in duration-500">{children}</div>}
      </div>
    </div>
  );
};

export default ExpandableSection;
