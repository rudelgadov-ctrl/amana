import { useRef, useState } from 'react';
import { format, startOfToday } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateEventRequest, EventRequestInsert } from '@/hooks/useEventRequests';
import { cn } from '@/lib/utils';
import { isValidEmail } from '@/lib/gift';
import {
  BUDGET_CURRENCIES,
  BUDGET_CURRENCY_SYMBOL,
  BudgetCurrency,
  BudgetType,
  DEFAULT_BUDGET_CURRENCY,
  DEFAULT_BUDGET_TYPE,
  DEFAULT_EVENT_SPACE,
  DEFAULT_EVENT_TYPE,
  EVENT_COMMENTS_MAX,
  EVENT_COMPANY_MAX,
  EVENT_EMAIL_MAX,
  EVENT_GUESTS_MAX,
  EVENT_GUESTS_MIN,
  EVENT_NAME_MAX,
  EVENT_PHONE_MAX,
  EVENT_PHONE_MIN,
  EventSpace,
  EventType,
  MenuPreference,
  capacityExceeded,
  isAllowedEventDate,
  needsCustomQuote,
  parseBudgetAmount,
  toISODate,
} from '@/lib/eventRequests';

type FieldName = 'name' | 'email' | 'phone' | 'date' | 'guests' | 'menu' | 'budget' | 'form';
type FieldErrors = Partial<Record<FieldName, string>>;

const inputClass = 'bg-white border-blueberry/20 text-blueberry focus-visible:ring-blueberry';

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1.5 text-xs text-destructive">{message}</p> : null;

const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-lg border-l-4 border-asparagus bg-eggshell px-4 py-3 font-body text-sm text-blueberry">
    {children}
  </p>
);

// Budget box shows grouped digits as you type: "25000" → "25.000" (es) / "25,000" (en).
const groupDigits = (digits: string, language: 'es' | 'en') =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, language === 'es' ? '.' : ',');

const parseGuests = (value: string): number | undefined => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
};

// Quote request form (#cotizar). Saves to event_requests; the notify-event-request Edge Function
// then emails the customer and Amana.
const EventQuoteForm = () => {
  const { t, language } = useLanguage();
  const copy = t.eventsPage.form;
  const createRequest = useCreateEventRequest();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<EventType>(DEFAULT_EVENT_TYPE);
  const [date, setDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guests, setGuests] = useState('');
  const [space, setSpace] = useState<EventSpace>(DEFAULT_EVENT_SPACE);
  const [menu, setMenu] = useState<MenuPreference | ''>('');
  const [budgetCurrency, setBudgetCurrency] = useState<BudgetCurrency>(DEFAULT_BUDGET_CURRENCY);
  const [budgetDigits, setBudgetDigits] = useState('');
  const [budgetType, setBudgetType] = useState<BudgetType>(DEFAULT_BUDGET_TYPE);
  const [comments, setComments] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — real users never fill this
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const submittingRef = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const guestsRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);

  const locale = language === 'es' ? es : enUS;
  const guestCount = parseGuests(guests);
  const showCustomQuote = needsCustomQuote(date, guestCount);
  const exceededCapacity = capacityExceeded(space, guestCount);

  const typeOptions: { value: EventType; label: string }[] = [
    { value: 'corporate', label: copy.typeCorporate },
    { value: 'celebration', label: copy.typeCelebration },
    { value: 'launch', label: copy.typeLaunch },
    { value: 'other', label: copy.typeOther },
  ];

  const spaceOptions: { value: EventSpace; label: string }[] = [
    { value: 'salon_azul', label: copy.spaceAzul },
    { value: 'salon_verde', label: copy.spaceVerde },
    { value: 'salon_principal', label: copy.spacePrincipal },
    { value: 'chefs_table', label: copy.spaceChefs },
    { value: 'full_restaurant', label: copy.spaceFull },
    { value: 'combination', label: copy.spaceCombination },
  ];

  // Same titles as the menu cards, so hiding a menu in the CMS also removes it here.
  const menuOptions = (
    [
      { value: 'three_course', label: t.eventsPage.menus.menu1Title },
      { value: 'five_six_course', label: t.eventsPage.menus.menu2Title },
      { value: 'chefs_table', label: t.eventsPage.menus.menu3Title },
      { value: 'other', label: copy.menuOther },
    ] as { value: MenuPreference; label: string }[]
  ).filter((option) => option.label.trim());

  const budgetAmount = parseBudgetAmount(budgetDigits);

  // Editing a field clears its error (and any form-level error) right away.
  const clearError = (field: FieldName) =>
    setErrors((prev) => (prev[field] || prev.form ? { ...prev, [field]: undefined, form: undefined } : prev));

  const formatDate = (value: Date) => {
    const text = format(value, language === 'es' ? "EEEE d 'de' MMMM, yyyy" : 'EEEE, MMMM d, yyyy', { locale });
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = copy.errorRequired;
    if (!email.trim()) next.email = copy.errorRequired;
    else if (!isValidEmail(email)) next.email = copy.errorEmail;
    if (!phone.trim()) next.phone = copy.errorRequired;
    else if (phone.trim().length < EVENT_PHONE_MIN) next.phone = copy.errorPhone;
    if (!date || !isAllowedEventDate(date)) next.date = copy.errorDate;
    if (!guestCount || guestCount < EVENT_GUESTS_MIN || guestCount > EVENT_GUESTS_MAX) next.guests = copy.errorGuests;
    if (menuOptions.length > 0 && !menu) next.menu = copy.errorRequired;
    if (budgetDigits && !budgetAmount) next.budget = copy.errorBudget;
    setErrors(next);

    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.phone) phoneRef.current?.focus();
    else if (next.date) dateRef.current?.focus();
    else if (next.guests) guestsRef.current?.focus();
    else if (next.menu) menuRef.current?.focus();
    else if (next.budget) budgetRef.current?.focus();

    return Object.keys(next).length === 0;
  };

  const buildPayload = (): EventRequestInsert => ({
    name: name.trim(),
    company: company.trim() || null,
    email: email.trim(),
    phone: phone.trim(),
    event_type: eventType,
    event_date: toISODate(date as Date),
    guests: guestCount as number,
    space,
    menu_preference: menu || null,
    budget_amount: budgetAmount ?? null,
    budget_currency: budgetAmount ? budgetCurrency : null,
    budget_type: budgetAmount ? budgetType : null,
    comments: comments.trim() ? comments.trim().slice(0, EVENT_COMMENTS_MAX) : null,
    language,
  });

  const errorsFor = (error: unknown): FieldErrors => {
    // supabase-js returns PostgrestError as a plain { message, code, ... } object, not an Error.
    const text =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error ?? '');
    if (text.includes('invalid_event_date')) return { date: copy.errorDate };
    if (text.includes('rate_limited')) return { form: copy.errorRateLimited };
    return { form: copy.errorGeneric };
  };

  const showSuccess = () => {
    setIsSuccess(true);
    requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    // Bots fill the hidden field: pretend it worked, store nothing.
    if (website) {
      showSuccess();
      return;
    }

    if (!validate()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await createRequest.mutateAsync(buildPayload());
      showSuccess();
    } catch (error) {
      setErrors(errorsFor(error));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="cotizar" className="scroll-mt-20 py-14 sm:py-20 md:py-24 bg-[#dad8c8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-blueberry mb-8 sm:mb-10">
          {copy.title}
        </h2>

        {isSuccess ? (
          <div className="max-w-3xl rounded-2xl bg-cta p-6 sm:p-8 text-cta-foreground flex items-start gap-4">
            <CheckCircle2 className="h-7 w-7 shrink-0" />
            <p className="font-body text-lg sm:text-xl font-medium">{copy.success}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-w-3xl rounded-2xl bg-eggshell p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <Label htmlFor="event-name" className="text-blueberry">{copy.name} *</Label>
              <Input
                id="event-name"
                ref={nameRef}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError('name');
                }}
                maxLength={EVENT_NAME_MAX}
                autoComplete="name"
                className={cn(inputClass, 'mt-1.5')}
                aria-invalid={!!errors.name}
              />
              <FieldError message={errors.name} />
            </div>

            <div>
              <Label htmlFor="event-company" className="text-blueberry">{copy.company}</Label>
              <Input
                id="event-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={EVENT_COMPANY_MAX}
                autoComplete="organization"
                className={cn(inputClass, 'mt-1.5')}
              />
            </div>

            <div>
              <Label htmlFor="event-email" className="text-blueberry">{copy.email} *</Label>
              <Input
                id="event-email"
                ref={emailRef}
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                maxLength={EVENT_EMAIL_MAX}
                autoComplete="email"
                className={cn(inputClass, 'mt-1.5')}
                aria-invalid={!!errors.email}
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <Label htmlFor="event-phone" className="text-blueberry">{copy.phone} *</Label>
              <Input
                id="event-phone"
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError('phone');
                }}
                maxLength={EVENT_PHONE_MAX}
                autoComplete="tel"
                className={cn(inputClass, 'mt-1.5')}
                aria-invalid={!!errors.phone}
              />
              <FieldError message={errors.phone} />
            </div>

            <div>
              <Label htmlFor="event-type" className="text-blueberry">{copy.eventType}</Label>
              <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                <SelectTrigger id="event-type" className={cn(inputClass, 'mt-1.5')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event-date" className="text-blueberry">{copy.date} *</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="event-date"
                    ref={dateRef}
                    type="button"
                    variant="outline"
                    className={cn(
                      inputClass,
                      'mt-1.5 w-full justify-start font-body font-normal hover:bg-white hover:text-blueberry',
                      !date && 'text-blueberry/50'
                    )}
                    aria-invalid={!!errors.date}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {date ? formatDate(date) : copy.datePlaceholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => {
                      setDate(value);
                      setCalendarOpen(false);
                      clearError('date');
                    }}
                    locale={locale}
                    fromDate={startOfToday()}
                    disabled={[{ dayOfWeek: [0, 1] }, { before: startOfToday() }]}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FieldError message={errors.date} />
            </div>

            <div>
              <Label htmlFor="event-guests" className="text-blueberry">{copy.guests} *</Label>
              <Input
                id="event-guests"
                ref={guestsRef}
                type="number"
                inputMode="numeric"
                min={EVENT_GUESTS_MIN}
                max={EVENT_GUESTS_MAX}
                value={guests}
                onChange={(e) => {
                  setGuests(e.target.value);
                  clearError('guests');
                }}
                className={cn(inputClass, 'mt-1.5')}
                aria-invalid={!!errors.guests}
              />
              <FieldError message={errors.guests} />
            </div>

            <div>
              <Label htmlFor="event-space" className="text-blueberry">{copy.space}</Label>
              <Select value={space} onValueChange={(v) => setSpace(v as EventSpace)}>
                <SelectTrigger id="event-space" className={cn(inputClass, 'mt-1.5')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {spaceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {menuOptions.length > 0 && (
              <div>
                <Label htmlFor="event-menu" className="text-blueberry">{copy.menu} *</Label>
                <Select
                  value={menu}
                  onValueChange={(v) => {
                    setMenu(v as MenuPreference);
                    clearError('menu');
                  }}
                >
                  <SelectTrigger
                    id="event-menu"
                    ref={menuRef}
                    className={cn(inputClass, 'mt-1.5')}
                    aria-invalid={!!errors.menu}
                  >
                    <SelectValue placeholder={copy.menuPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.menu} />
              </div>
            )}

            <div>
              <Label htmlFor="event-budget" className="text-blueberry">{copy.budget}</Label>
              <div className="mt-1.5 flex gap-2">
                <Select value={budgetCurrency} onValueChange={(v) => setBudgetCurrency(v as BudgetCurrency)}>
                  <SelectTrigger className={cn(inputClass, 'w-[68px] shrink-0')} aria-label={`${copy.budget}: ₡ / $`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {BUDGET_CURRENCY_SYMBOL[currency]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="event-budget"
                  ref={budgetRef}
                  inputMode="numeric"
                  autoComplete="off"
                  value={groupDigits(budgetDigits, language)}
                  onChange={(e) => {
                    setBudgetDigits(e.target.value.replace(/\D/g, '').slice(0, 10));
                    clearError('budget');
                  }}
                  placeholder={copy.budgetAmount}
                  className={cn(inputClass, 'min-w-0 flex-1')}
                  aria-invalid={!!errors.budget}
                />
                <Select value={budgetType} onValueChange={(v) => setBudgetType(v as BudgetType)}>
                  <SelectTrigger className={cn(inputClass, 'w-[124px] shrink-0')} aria-label={copy.budget}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_person">{copy.budgetPerPerson}</SelectItem>
                    <SelectItem value="total">{copy.budgetTotal}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FieldError message={errors.budget} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="event-comments" className="text-blueberry">{copy.comments}</Label>
              <Textarea
                id="event-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value.slice(0, EVENT_COMMENTS_MAX))}
                maxLength={EVENT_COMMENTS_MAX}
                rows={4}
                className={cn(inputClass, 'mt-1.5 resize-none')}
              />
            </div>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="event-website">Website</label>
              <input
                id="event-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {(showCustomQuote || exceededCapacity || errors.form) && (
              <div className="md:col-span-2 space-y-3">
                {showCustomQuote && <Note>{copy.customQuoteNote}</Note>}
                {exceededCapacity && <Note>{copy.capacityNote.replace('{capacity}', String(exceededCapacity))}</Note>}
                {errors.form && <p className="font-body text-sm text-destructive">{errors.form}</p>}
              </div>
            )}

            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full border-2 border-cta bg-cta text-cta-foreground hover:bg-cta/90 font-body font-medium px-8 py-5 transition-all duration-300"
              >
                {isSubmitting ? copy.submitting : copy.submit}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default EventQuoteForm;
