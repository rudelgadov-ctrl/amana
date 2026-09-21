import { useLanguage } from '@/contexts/LanguageContext';
import { formatCRC } from '@/lib/format';
import { cn } from '@/lib/utils';
import logoLime from '@/assets/amana-logo-lime.png';
import linocut from '@/assets/chefs-table-illustration.png';

interface GiftCardPreviewProps {
  amount: number | null;
  quantity: number;
  className?: string;
}

// Live mock-up of the physical gift card: updates as the customer picks an amount/quantity.
const GiftCardPreview = ({ amount, quantity, className }: GiftCardPreviewProps) => {
  const { t, language } = useLanguage();
  const stack = Math.min(Math.max(quantity - 1, 0), 2); // up to two cards peeking behind

  return (
    <div className={cn('relative mx-auto w-full max-w-lg', className)}>
      {/* Cards peeking behind to hint at quantity */}
      {Array.from({ length: stack }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-blueberry/70 shadow-lg transition-transform duration-500"
          style={{ transform: `translate(${(i + 1) * 10}px, ${(i + 1) * -10}px) rotate(${(i + 1) * 2}deg)` }}
        />
      ))}

      <div
        className={cn(
          'group relative aspect-[1.586/1] overflow-hidden rounded-2xl text-eggshell shadow-2xl',
          'bg-gradient-to-br from-[#013547] via-blueberry to-[#001b26]',
          'transition-transform duration-500 will-change-transform hover:-rotate-1 hover:scale-[1.02]'
        )}
      >
        {/* Brand linocut, inverted to read as white ink on navy */}
        <img
          src={linocut}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-8 w-[62%] opacity-[0.14] invert select-none transition-transform duration-700 group-hover:scale-105"
        />
        {/* Soft lime glow */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-yolk/15 blur-3xl" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <img src={logoLime} alt="Amana" className="h-6 sm:h-7 w-auto" />
            <span className="font-body text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-eggshell/70">
              {t.gift.cards.cardLabel}
            </span>
          </div>

          <div className="space-y-1">
            <p
              className={cn(
                'font-display font-bold leading-none transition-all duration-300',
                amount !== null ? 'text-4xl sm:text-5xl text-eggshell' : 'text-3xl sm:text-4xl text-eggshell/35'
              )}
              aria-live="polite"
            >
              {amount !== null ? formatCRC(amount, language) : '₡ —'}
            </p>
            <p className="font-body text-[11px] sm:text-xs text-eggshell/60">{t.gift.cards.cardFooter}</p>
          </div>
        </div>

        {quantity > 1 && (
          <span className="absolute right-4 top-12 sm:top-14 rounded-full bg-yolk px-2.5 py-1 font-body text-xs font-semibold text-blueberry shadow">
            ×{quantity}
          </span>
        )}
      </div>
    </div>
  );
};

export default GiftCardPreview;
