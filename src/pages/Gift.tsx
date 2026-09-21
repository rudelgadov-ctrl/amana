import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useGiftSettings, defaultGiftSettings } from '@/hooks/useGiftSettings';
import { Skeleton } from '@/components/ui/skeleton';
import GiftHero from '@/components/gift/GiftHero';
import GiftSteps from '@/components/gift/GiftSteps';
import ChefsTableGiftSection from '@/components/gift/ChefsTableGiftSection';
import GiftCardSection from '@/components/gift/GiftCardSection';
import GiftOrderForm from '@/components/gift/GiftOrderForm';
import { GiftOrderDraft, OrderType } from '@/lib/gift';

const Gift = () => {
  const { data: settings, isLoading } = useGiftSettings();

  const [activeSection, setActiveSection] = useState<OrderType | null>(null);
  const [draft, setDraft] = useState<GiftOrderDraft | null>(null);
  const [formKey, setFormKey] = useState(0); // remount the form on each new "Ordenar"
  const [resetSignal, setResetSignal] = useState(0); // clears section selections after success

  const openOrder = (nextDraft: GiftOrderDraft) => {
    setDraft(nextDraft);
    setActiveSection(nextDraft.type);
    setFormKey((k) => k + 1);
  };

  const handleSuccess = () => {
    // Keep the confirmation visible; clear the selections in both sections
    setResetSignal((n) => n + 1);
  };

  const handleClose = () => {
    setActiveSection(null);
    setDraft(null);
  };

  const effective = settings ?? defaultGiftSettings;

  const renderForm = (type: OrderType) =>
    activeSection === type && draft ? (
      <GiftOrderForm key={formKey} draft={draft} onSuccess={handleSuccess} onClose={handleClose} />
    ) : null;

  return (
    <Layout>
      <GiftHero showChefsTable={effective.chefsTableEnabled} showCards={effective.cardsEnabled} />
      <GiftSteps />

      {isLoading ? (
        <section className="bg-[#dad8c8] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Skeleton className="h-80 w-full rounded-2xl bg-eggshell/60" />
            <Skeleton className="h-80 w-full rounded-2xl bg-eggshell/60" />
          </div>
        </section>
      ) : (
        <>
          {effective.chefsTableEnabled && (
            <ChefsTableGiftSection
              settings={effective}
              isOpen={activeSection === 'chefs_table'}
              resetSignal={resetSignal}
              onOrder={openOrder}
            >
              {renderForm('chefs_table')}
            </ChefsTableGiftSection>
          )}

          {effective.cardsEnabled && (
            <GiftCardSection
              settings={effective}
              isOpen={activeSection === 'gift_card'}
              resetSignal={resetSignal}
              onOrder={openOrder}
            >
              {renderForm('gift_card')}
            </GiftCardSection>
          )}
        </>
      )}
    </Layout>
  );
};

export default Gift;
