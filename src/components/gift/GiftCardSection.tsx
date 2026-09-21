import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { GiftSettings } from '@/hooks/useGiftSettings';
import { formatCRC, parseAmountInput } from '@/lib/format';
import { GiftOrderDraft, QUANTITY_OPTIONS, computeGiftCardTotal } from '@/lib/gift';
import { cn } from '@/lib/utils';
import ExpandableSection from './ExpandableSection';
import GiftCardPreview from './GiftCardPreview';

interface GiftCardSectionProps {
  settings: GiftSettings;
  isOpen: boolean;
  resetSignal: number; // bump to clear the selections (after a successful order)
  onOrder: (draft: GiftOrderDraft) => void;
  children?: ReactNode; // the order form, rendered inside the expandable area
}

const lightSelect = 'h-12 bg-white border-blueberry/20 text-blueberry font-body text-base focus:ring-blueberry';

const GiftCardSection = ({ settings, isOpen, resetSignal, onOrder, children }: GiftCardSectionProps) => {
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [preset, setPreset] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState('');

  // Clear selections after a successful order (the form stays mounted to show the confirmation)
  useEffect(() => {
    if (resetSignal === 0) return;
    setQuantity(1);
    setPreset(null);
    setCustomInput('');
  }, [resetSignal]);

  const customAmount = parseAmountInput(customInput);
  const customTooLow = customAmount !== null && customAmount < settings.cardMinAmount;
  const amount = preset ?? (customAmount !== null && !customTooLow ? customAmount : null);
  const total = amount !== null ? computeGiftCardTotal(quantity, amount) : null;
  const isValid = amount !== null && total !== null && total > 0;

  const choosePreset = (value: number) => {
    setPreset(value);
    setCustomInput('');
  };

  const handleCustomChange = (value: string) => {
    setCustomInput(value);
    if (value.trim()) setPreset(null);
  };

  const handleOrder = () => {
    if (!isValid || amount === null || total === null) return;
    onOrder({ type: 'gift_card', quantity, amount, total });
  };

  const minText = t.gift.cards.minAmount.replace('{min}', formatCRC(settings.cardMinAmount, language));

  return (
    <section id="gift-cards" className="relative scroll-mt-20 overflow-hidden bg-eggshell py-14 sm:py-20 md:py-28">
      {/* Subtle sand blob behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-sand/70 blur-3xl"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Live card preview */}
          <div className="lg:col-span-6 px-2 sm:px-6 pt-6">
            <GiftCardPreview amount={amount} quantity={quantity} />
          </div>

          {/* Copy + configurator */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-asparagus">{t.gift.cards.eyebrow}</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-blueberry leading-[0.95]">
                {t.gift.cards.title}
              </h2>
              <p className="font-body text-base sm:text-lg text-blueberry/75 max-w-xl">{t.gift.cards.subtitle}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="font-body text-xs tracking-[0.2em] uppercase text-blueberry/60">{t.gift.cards.amountLabel}</Label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {settings.cardAmounts.map((value) => {
                    const selected = preset === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => choosePreset(value)}
                        aria-pressed={selected}
                        className={cn(
                          'rounded-full border-2 px-5 sm:px-6 py-2.5 font-display text-lg sm:text-xl transition-all duration-300',
                          selected
                            ? 'border-blueberry bg-blueberry text-yolk shadow-md scale-[1.03]'
                            : 'border-blueberry/30 bg-transparent text-blueberry hover:border-blueberry hover:bg-blueberry hover:text-eggshell'
                        )}
                      >
                        {formatCRC(value, language)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="gc-custom" className="font-body text-xs tracking-[0.2em] uppercase text-blueberry/60">
                    {t.gift.cards.otherAmount}
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-display text-lg text-blueberry/50">₡</span>
                    <Input
                      id="gc-custom"
                      inputMode="numeric"
                      value={customInput}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      placeholder={t.gift.cards.otherAmountPlaceholder}
                      className="h-12 bg-white border-blueberry/20 text-blueberry font-body text-base focus-visible:ring-blueberry pl-9"
                      aria-invalid={customTooLow}
                    />
                  </div>
                  <p className={cn('font-body text-xs', customTooLow ? 'text-destructive' : 'text-blueberry/55')}>{minText}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gc-quantity" className="font-body text-xs tracking-[0.2em] uppercase text-blueberry/60">
                    {t.gift.cards.quantityLabel}
                  </Label>
                  <Select value={String(quantity)} onValueChange={(v) => setQuantity(parseInt(v, 10))}>
                    <SelectTrigger id="gc-quantity" className={lightSelect}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUANTITY_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-t border-dashed border-blueberry/20 pt-6">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-blueberry/60">{t.gift.common.total}</p>
                  <p className={cn('font-display text-3xl sm:text-4xl font-bold leading-none mt-1', total !== null ? 'text-blueberry' : 'text-blueberry/30')}>
                    {total !== null ? formatCRC(total, language) : '₡ —'}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleOrder}
                  disabled={!isValid}
                  className="h-12 rounded-full border-2 border-cta bg-cta px-8 font-body text-base font-medium text-cta-foreground transition-all duration-300 hover:bg-cta/90"
                >
                  {t.gift.common.order}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Order form expands full width under the section */}
        <ExpandableSection isOpen={isOpen}>
          <div className="pt-8 lg:pt-12">
            <div className="rounded-2xl bg-[#dad8c8] p-5 sm:p-8 shadow-lg">{children}</div>
          </div>
        </ExpandableSection>
      </div>
    </section>
  );
};

export default GiftCardSection;
