import { useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateGiftOrder, GiftOrderInsert } from '@/hooks/useGiftOrders';
import { formatCRC } from '@/lib/format';
import { GIFT_MESSAGE_MAX, GiftOrderDraft, PaymentMethod, isValidEmail } from '@/lib/gift';

interface GiftOrderFormProps {
  draft: GiftOrderDraft;
  onSuccess: () => void;
  onClose: () => void;
}

type FieldName = 'firstName' | 'lastName' | 'email' | 'paymentMethod';
type FieldErrors = Partial<Record<FieldName, string>>;

const inputClass = 'bg-white border-blueberry/20 text-blueberry focus-visible:ring-blueberry';

const GiftOrderForm = ({ draft, onSuccess, onClose }: GiftOrderFormProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const createOrder = useCreateGiftOrder();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — real users never fill this
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const submittingRef = useRef(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const paymentOptions: { value: PaymentMethod; label: string }[] = [
    { value: 'payment_link', label: t.gift.form.paymentLink },
    { value: 'paypal', label: t.gift.form.paypal },
    { value: 'sinpe', label: t.gift.form.sinpe },
  ];

  const summary =
    draft.type === 'chefs_table'
      ? `${t.gift.chefsTable.title} · ${draft.quantity} ${t.gift.common.guests}` +
        (draft.pairingQuantity > 0 ? ` · ${draft.pairingQuantity} ${t.gift.common.pairings}` : '')
      : `${draft.quantity} ${t.gift.common.cardsOf} ${formatCRC(draft.amount, language)}`;

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPaymentMethod('');
    setMessage('');
    setWebsite('');
    setErrors({});
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!firstName.trim()) next.firstName = t.gift.form.errorRequired;
    if (!lastName.trim()) next.lastName = t.gift.form.errorRequired;
    if (!email.trim()) next.email = t.gift.form.errorRequired;
    else if (!isValidEmail(email)) next.email = t.gift.form.errorEmail;
    if (!paymentMethod) next.paymentMethod = t.gift.form.errorRequired;
    setErrors(next);

    if (next.firstName) firstNameRef.current?.focus();
    else if (next.lastName) lastNameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();

    return Object.keys(next).length === 0;
  };

  const buildPayload = (): GiftOrderInsert => {
    const base = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      payment_method: paymentMethod as PaymentMethod,
      message: message.trim() ? message.trim().slice(0, GIFT_MESSAGE_MAX) : null,
      language,
    };

    if (draft.type === 'chefs_table') {
      return {
        ...base,
        order_type: 'chefs_table',
        quantity: draft.quantity,
        pairing_quantity: draft.pairingQuantity,
        unit_price: draft.unitPrice,
        pairing_unit_price: draft.pairingUnitPrice,
        amount: null,
        total: draft.total,
      };
    }

    return {
      ...base,
      order_type: 'gift_card',
      quantity: draft.quantity,
      pairing_quantity: null,
      unit_price: null,
      pairing_unit_price: null,
      amount: draft.amount,
      total: draft.total,
    };
  };

  const errorMessageFor = (error: unknown): string => {
    const text = error instanceof Error ? error.message : String(error ?? '');
    if (text.includes('amount_below_minimum')) return t.gift.form.errorMinAmount;
    if (text.includes('rate_limited')) return t.gift.form.errorRateLimited;
    return t.gift.form.errorGeneric;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    // Bots fill the hidden field: pretend it worked, store nothing.
    if (website) {
      resetFields();
      setIsSuccess(true);
      onSuccess();
      return;
    }

    if (!validate()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await createOrder.mutateAsync(buildPayload());
      resetFields();
      setIsSuccess(true);
      toast({ title: t.gift.form.successTitle });
      onSuccess();
    } catch (error) {
      toast({ title: errorMessageFor(error), variant: 'destructive' });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-asparagus/40 bg-white/70 p-6 sm:p-8 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 mx-auto text-asparagus" />
        <h4 className="font-display text-xl sm:text-2xl font-bold text-blueberry">{t.gift.form.successTitle}</h4>
        <p className="font-body text-sm sm:text-base text-blueberry/70 max-w-md mx-auto">{t.gift.form.successText}</p>
        <Button
          type="button"
          onClick={onClose}
          className="mt-2 border-2 border-blueberry bg-transparent text-blueberry hover:bg-cta hover:text-cta-foreground hover:border-cta font-body transition-all duration-300"
        >
          {t.gift.form.newOrder}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-1">
        <h4 className="font-display text-lg sm:text-xl font-bold text-blueberry">{t.gift.form.title}</h4>
        <p className="font-body text-xs sm:text-sm text-blueberry/70">
          <span className="font-medium">{t.gift.common.summary}:</span> {summary} ·{' '}
          <span className="font-medium">{t.gift.common.total}: {formatCRC(draft.total, language)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gift-first-name" className="text-blueberry">{t.gift.form.firstName}</Label>
          <Input
            id="gift-first-name"
            ref={firstNameRef}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={80}
            autoComplete="given-name"
            className={inputClass}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gift-last-name" className="text-blueberry">{t.gift.form.lastName}</Label>
          <Input
            id="gift-last-name"
            ref={lastNameRef}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            maxLength={80}
            autoComplete="family-name"
            className={inputClass}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gift-email" className="text-blueberry">{t.gift.form.email}</Label>
          <Input
            id="gift-email"
            ref={emailRef}
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            autoComplete="email"
            className={inputClass}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gift-payment" className="text-blueberry">{t.gift.form.paymentMethod}</Label>
          <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
            <SelectTrigger id="gift-payment" className={inputClass} aria-invalid={!!errors.paymentMethod}>
              <SelectValue placeholder={t.gift.form.paymentPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="gift-message" className="text-blueberry">{t.gift.form.message}</Label>
          <span className="text-xs text-blueberry/60">
            {message.length}/{GIFT_MESSAGE_MAX}
          </span>
        </div>
        <Textarea
          id="gift-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, GIFT_MESSAGE_MAX))}
          maxLength={GIFT_MESSAGE_MAX}
          placeholder={t.gift.form.messagePlaceholder}
          className={`${inputClass} min-h-[96px] resize-none`}
        />
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="gift-website">Website</label>
        <input
          id="gift-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="border-2 border-cta bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium px-8 py-5 transition-all duration-300 sm:shrink-0"
        >
          {isSubmitting ? t.gift.form.submitting : t.gift.form.submit}
        </Button>
        <p className="font-body text-xs sm:text-sm text-blueberry/70">{t.gift.form.note}</p>
      </div>
    </form>
  );
};

export default GiftOrderForm;
