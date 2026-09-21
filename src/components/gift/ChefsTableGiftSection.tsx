import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { GiftSettings } from '@/hooks/useGiftSettings';
import { useSiteImages } from '@/hooks/useSiteImages';
import { formatCRC } from '@/lib/format';
import { GiftOrderDraft, QUANTITY_OPTIONS, computeChefsTableTotal } from '@/lib/gift';
import ExpandableSection from './ExpandableSection';
import photoMainFallback from '@/assets/chefs-table/ct-1.jpg';
import photoSmallFallback from '@/assets/chefs-table/ct-3.jpg';
import linocut from '@/assets/chefs-table-illustration.png';

interface ChefsTableGiftSectionProps {
  settings: GiftSettings;
  isOpen: boolean;
  resetSignal: number; // bump to clear the selections (after a successful order)
  onOrder: (draft: GiftOrderDraft) => void;
  children?: ReactNode; // the order form, rendered inside the expandable area
}

// Dark select styling for the navy configurator panel
const darkSelect =
  'h-12 bg-eggshell/10 border-eggshell/20 text-eggshell font-body text-base focus:ring-yolk focus:ring-offset-blueberry [&>svg]:text-eggshell/70';

const ChefsTableGiftSection = ({ settings, isOpen, resetSignal, onOrder, children }: ChefsTableGiftSectionProps) => {
  const { t, language } = useLanguage();
  const { data: mainImages } = useSiteImages('gift-chefs-table');
  const { data: smallImages } = useSiteImages('gift-chefs-table-2');
  const [quantity, setQuantity] = useState(1);
  const [pairing, setPairing] = useState(0);

  const photoMain = mainImages?.[0]?.url || photoMainFallback;
  const photoSmall = smallImages?.[0]?.url || photoSmallFallback;
  const altMain = (language === 'es' ? mainImages?.[0]?.alt_text_es : mainImages?.[0]?.alt_text_en) || t.gift.chefsTable.title;
  const altSmall = (language === 'es' ? smallImages?.[0]?.alt_text_es : smallImages?.[0]?.alt_text_en) || t.gift.chefsTable.title;

  // Pairing can never exceed the number of guests
  useEffect(() => {
    if (pairing > quantity) setPairing(quantity);
  }, [quantity, pairing]);

  // Clear selections after a successful order (the form stays mounted to show the confirmation)
  useEffect(() => {
    if (resetSignal === 0) return;
    setQuantity(1);
    setPairing(0);
  }, [resetSignal]);

  const total = computeChefsTableTotal(quantity, pairing, settings.chefsTablePrice, settings.pairingPrice);
  const isValid = quantity >= 1 && pairing >= 0 && pairing <= quantity && total > 0;

  const handleOrder = () => {
    if (!isValid) return;
    onOrder({
      type: 'chefs_table',
      quantity,
      pairingQuantity: pairing,
      unitPrice: settings.chefsTablePrice,
      pairingUnitPrice: settings.pairingPrice,
      total,
    });
  };

  return (
    <section id="gift-chefs-table" className="relative scroll-mt-20 overflow-hidden bg-[#dad8c8] py-14 sm:py-20 md:py-28">
      {/* Linocut watermark (brand illustration) */}
      <img
        src={linocut}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 w-[420px] sm:w-[560px] opacity-[0.07] mix-blend-multiply select-none"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Photo collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
              <img src={photoMain} alt={altMain} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-blueberry/40 via-transparent to-transparent" />
            </div>
            {/* Secondary photo */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 w-[42%] aspect-[4/5] overflow-hidden rounded-xl border-[6px] border-[#dad8c8] shadow-xl rotate-2">
              <img src={photoSmall} alt={altSmall} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* Copy + configurator */}
          <div className="lg:col-span-7 space-y-8 pt-4 lg:pt-0">
            <div className="space-y-4">
              <p className="font-body text-[11px] tracking-[0.3em] uppercase text-asparagus">{t.gift.chefsTable.eyebrow}</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-blueberry leading-[0.95]">
                {t.gift.chefsTable.title}
              </h2>
              <p className="font-body text-base sm:text-lg text-blueberry/75 max-w-xl whitespace-pre-line">
                {t.gift.chefsTable.description}
              </p>
              <p className="font-body text-blueberry pt-1">
                <span className="font-display text-3xl sm:text-4xl font-bold">{formatCRC(settings.chefsTablePrice, language)}</span>{' '}
                <span className="text-blueberry/70">{t.gift.chefsTable.perPerson}</span>
              </p>
            </div>

            {/* Ticket-like configurator */}
            <div className="relative rounded-2xl bg-blueberry text-eggshell shadow-2xl">
              {/* ticket notches */}
              <span className="absolute -left-3 top-[58%] h-6 w-6 rounded-full bg-[#dad8c8]" aria-hidden="true" />
              <span className="absolute -right-3 top-[58%] h-6 w-6 rounded-full bg-[#dad8c8]" aria-hidden="true" />

              <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ct-quantity" className="font-body text-xs tracking-[0.2em] uppercase text-eggshell/60">
                    {t.gift.chefsTable.quantityLabel}
                  </Label>
                  <Select value={String(quantity)} onValueChange={(v) => setQuantity(parseInt(v, 10))}>
                    <SelectTrigger id="ct-quantity" className={darkSelect}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUANTITY_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ct-pairing" className="font-body text-xs tracking-[0.2em] uppercase text-eggshell/60">
                    {t.gift.chefsTable.pairingLabel}
                  </Label>
                  <Select value={String(pairing)} onValueChange={(v) => setPairing(parseInt(v, 10))}>
                    <SelectTrigger id="ct-pairing" className={darkSelect}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t.gift.chefsTable.noPairing}</SelectItem>
                      {QUANTITY_OPTIONS.filter((n) => n <= quantity).map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="font-body text-xs text-eggshell/55">
                    {t.gift.chefsTable.pairingHelp} · {formatCRC(settings.pairingPrice, language)} {t.gift.chefsTable.perPerson}
                  </p>
                  {pairing > quantity && <p className="text-xs text-yolk">{t.gift.chefsTable.pairingError}</p>}
                </div>
              </div>

              <div className="mx-5 sm:mx-7 border-t border-dashed border-eggshell/25" />

              <div className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-eggshell/60">{t.gift.common.total}</p>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-yolk leading-none mt-1">
                    {formatCRC(total, language)}
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
            <div className="rounded-2xl bg-eggshell p-5 sm:p-8 shadow-lg">{children}</div>
          </div>
        </ExpandableSection>
      </div>
    </section>
  );
};

export default ChefsTableGiftSection;
