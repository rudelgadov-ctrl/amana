DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.event_requests'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%menu_preference%'
  LOOP
    EXECUTE format('ALTER TABLE public.event_requests DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.event_requests ADD CONSTRAINT event_requests_menu_preference_check CHECK (
  menu_preference IS NULL OR menu_preference IN ('three_course', 'five_six_course', 'chefs_table', 'other')
);

ALTER TABLE public.event_requests
  ADD COLUMN budget_amount INTEGER CHECK (budget_amount IS NULL OR budget_amount BETWEEN 1 AND 1000000000),
  ADD COLUMN budget_currency TEXT CHECK (budget_currency IS NULL OR budget_currency IN ('CRC', 'USD')),
  ADD COLUMN budget_type TEXT CHECK (budget_type IS NULL OR budget_type IN ('per_person', 'total'));

ALTER TABLE public.event_requests ADD CONSTRAINT event_requests_budget_shape CHECK (
  (budget_amount IS NULL AND budget_currency IS NULL AND budget_type IS NULL)
  OR (budget_amount IS NOT NULL AND budget_currency IS NOT NULL AND budget_type IS NOT NULL)
);