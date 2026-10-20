-- ===========================================
-- /eventos — client feedback
-- * "Preferencia de menú" gains "Otro - Especificar en comentarios" (the form now requires the field;
--   the column stays nullable so the previously published form keeps working until it's republished).
-- * Optional budget: amount + currency (₡ / $) + per person / total.
-- ===========================================

-- 1. Menu preference: allow 'other' (drops the original column CHECK whatever its generated name)
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

-- 2. Optional budget
ALTER TABLE public.event_requests
  ADD COLUMN budget_amount INTEGER CHECK (budget_amount IS NULL OR budget_amount BETWEEN 1 AND 1000000000),
  ADD COLUMN budget_currency TEXT CHECK (budget_currency IS NULL OR budget_currency IN ('CRC', 'USD')),
  ADD COLUMN budget_type TEXT CHECK (budget_type IS NULL OR budget_type IN ('per_person', 'total'));

-- All three together or none
ALTER TABLE public.event_requests ADD CONSTRAINT event_requests_budget_shape CHECK (
  (budget_amount IS NULL AND budget_currency IS NULL AND budget_type IS NULL)
  OR (budget_amount IS NOT NULL AND budget_currency IS NOT NULL AND budget_type IS NOT NULL)
);

-- 3. Page copy (Admin > Traducciones > "Página de Eventos")
INSERT INTO public.site_translations (section, key, text_es, text_en)
VALUES
  ('eventsPage', 'eventsPage.form.menuOther', 'Otro - Especificar en comentarios', 'Other – specify in comments'),
  ('eventsPage', 'eventsPage.form.budget', 'Presupuesto (opcional)', 'Budget (optional)'),
  ('eventsPage', 'eventsPage.form.budgetAmount', 'Monto', 'Amount'),
  ('eventsPage', 'eventsPage.form.budgetPerPerson', 'por persona', 'per person'),
  ('eventsPage', 'eventsPage.form.budgetTotal', 'total', 'total'),
  ('eventsPage', 'eventsPage.form.errorBudget', 'Ingresa un monto válido', 'Enter a valid amount')
ON CONFLICT (key) DO NOTHING;

-- The menu field is no longer optional; only touch the placeholder if nobody has edited it in the CMS.
UPDATE public.site_translations
SET text_es = 'Elige un menú', text_en = 'Choose a menu'
WHERE key = 'eventsPage.form.menuPlaceholder'
  AND text_es = 'Elige un menú (opcional)'
  AND text_en = 'Choose a menu (optional)';
