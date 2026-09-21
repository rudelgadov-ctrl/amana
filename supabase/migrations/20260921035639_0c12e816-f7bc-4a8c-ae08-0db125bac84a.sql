-- ===========================================
-- "Regala Amana" — gift orders (Chef's Table experience + gift cards)
-- ===========================================

-- 1. Table
CREATE TABLE public.gift_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,
  order_type TEXT NOT NULL CHECK (order_type IN ('chefs_table', 'gift_card')),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 8),
  pairing_quantity INTEGER CHECK (pairing_quantity IS NULL OR pairing_quantity BETWEEN 0 AND 8),
  unit_price INTEGER CHECK (unit_price IS NULL OR unit_price > 0),
  pairing_unit_price INTEGER CHECK (pairing_unit_price IS NULL OR pairing_unit_price >= 0),
  amount INTEGER CHECK (amount IS NULL OR amount > 0),
  total INTEGER NOT NULL CHECK (total > 0 AND total <= 10000000),
  currency TEXT NOT NULL DEFAULT 'CRC',
  first_name TEXT NOT NULL CHECK (char_length(btrim(first_name)) BETWEEN 1 AND 80),
  last_name TEXT NOT NULL CHECK (char_length(btrim(last_name)) BETWEEN 1 AND 80),
  email TEXT NOT NULL CHECK (char_length(email) <= 254 AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('payment_link', 'paypal', 'sinpe')),
  message TEXT CHECK (message IS NULL OR char_length(message) <= 80),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'paid', 'delivered', 'cancelled')),
  admin_notes TEXT,
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en')),
  -- Reserved for the future email pipeline (idempotency marker)
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Shape per order type
  CONSTRAINT gift_orders_type_shape CHECK (
    (
      order_type = 'chefs_table'
      AND unit_price IS NOT NULL
      AND pairing_quantity IS NOT NULL
      AND pairing_quantity <= quantity
      AND amount IS NULL
    )
    OR (
      order_type = 'gift_card'
      AND amount IS NOT NULL
      AND pairing_quantity IS NULL
      AND unit_price IS NULL
      AND pairing_unit_price IS NULL
    )
  ),
  -- Total must match the arithmetic
  CONSTRAINT gift_orders_total_matches CHECK (
    total = CASE order_type
      WHEN 'chefs_table' THEN quantity * unit_price + COALESCE(pairing_quantity, 0) * COALESCE(pairing_unit_price, 0)
      ELSE quantity * amount
    END
  )
);

CREATE INDEX gift_orders_created_at_idx ON public.gift_orders (created_at DESC);
CREATE INDEX gift_orders_status_idx ON public.gift_orders (status);
CREATE INDEX gift_orders_email_created_idx ON public.gift_orders (lower(email), created_at);

-- 2. Order code + server-owned fields (BEFORE INSERT trigger)
CREATE SEQUENCE public.gift_order_code_seq;

CREATE OR REPLACE FUNCTION public.gift_orders_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price INTEGER;
  v_pairing INTEGER;
  v_min INTEGER;
  v_recent INTEGER;
BEGIN
  -- Server-owned fields: never trust the client for these
  NEW.order_code := 'AM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.gift_order_code_seq')::text, 4, '0');
  NEW.status := 'new';
  NEW.admin_notes := NULL;
  NEW.notified_at := NULL;
  NEW.currency := 'CRC';
  NEW.created_at := now();
  NEW.updated_at := now();

  -- Normalise customer data
  NEW.email := lower(btrim(NEW.email));
  NEW.first_name := btrim(NEW.first_name);
  NEW.last_name := btrim(NEW.last_name);
  IF NEW.message IS NOT NULL AND btrim(NEW.message) = '' THEN
    NEW.message := NULL;
  END IF;

  -- Authoritative prices come from restaurant_info (CMS), not from the client
  IF NEW.order_type = 'chefs_table' THEN
    SELECT value::integer INTO v_price FROM public.restaurant_info WHERE key = 'gift_chefs_table_price';
    SELECT value::integer INTO v_pairing FROM public.restaurant_info WHERE key = 'gift_pairing_price';
    NEW.unit_price := COALESCE(v_price, NEW.unit_price);
    NEW.pairing_unit_price := COALESCE(v_pairing, NEW.pairing_unit_price, 0);
    NEW.pairing_quantity := COALESCE(NEW.pairing_quantity, 0);
    NEW.amount := NULL;
    NEW.total := NEW.quantity * NEW.unit_price + NEW.pairing_quantity * NEW.pairing_unit_price;
  ELSE
    SELECT value::integer INTO v_min FROM public.restaurant_info WHERE key = 'gift_card_min_amount';
    IF NEW.amount IS NULL OR NEW.amount < COALESCE(v_min, 1) THEN
      RAISE EXCEPTION 'amount_below_minimum';
    END IF;
    NEW.pairing_quantity := NULL;
    NEW.unit_price := NULL;
    NEW.pairing_unit_price := NULL;
    NEW.total := NEW.quantity * NEW.amount;
  END IF;

  -- Light abuse guard: max 5 orders per email per hour
  SELECT count(*) INTO v_recent
  FROM public.gift_orders
  WHERE lower(email) = NEW.email
    AND created_at > now() - interval '1 hour';
  IF v_recent >= 5 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.gift_orders_before_insert() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER gift_orders_before_insert
  BEFORE INSERT ON public.gift_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.gift_orders_before_insert();

CREATE TRIGGER update_gift_orders_updated_at
  BEFORE UPDATE ON public.gift_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Row Level Security
ALTER TABLE public.gift_orders ENABLE ROW LEVEL SECURITY;

-- Public visitors can create orders (bounds enforced by CHECK constraints + trigger).
-- Intentional: there is no public form elsewhere; the trigger owns prices/status and rate-limits.
CREATE POLICY "Anyone can create gift orders"
  ON public.gift_orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new' AND admin_notes IS NULL);

-- Only CMS users (admin/editor) can read and manage orders. No anonymous SELECT.
CREATE POLICY "CMS users can view gift orders"
  ON public.gift_orders FOR SELECT
  TO authenticated
  USING (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update gift orders"
  ON public.gift_orders FOR UPDATE
  TO authenticated
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete gift orders"
  ON public.gift_orders FOR DELETE
  TO authenticated
  USING (public.can_manage_content(auth.uid()));

-- 4. Gift settings (editable from /admin/gifts → Configuración)
INSERT INTO public.restaurant_info (key, value, value_type) VALUES
  ('gift_chefs_table_price', '44000', 'number'),
  ('gift_pairing_price', '20000', 'number'),
  ('gift_card_amounts', '20000,30000,40000,50000', 'list'),
  ('gift_card_min_amount', '15000', 'number'),
  ('gift_chefs_table_enabled', 'true', 'boolean'),
  ('gift_cards_enabled', 'true', 'boolean')
ON CONFLICT (key) DO NOTHING;

-- 5. Copy (editable from /admin/translations → "Regala / Gift")
INSERT INTO public.site_translations (section, key, text_es, text_en) VALUES
  ('nav', 'nav.gift', 'Regala', 'Gift'),
  ('hero', 'hero.ctaGift', 'Regala Amana', 'Gift Amana'),

  ('gift', 'gift.title', 'Regala Amana', 'Amana as a Gift'),
  ('gift', 'gift.subtitle', 'Una experiencia para compartir', 'An experience to share'),
  ('gift', 'gift.heroNote', 'Regala una noche frente a nuestra cocina abierta o una tarjeta para usar en todo Amana.', 'Gift a night in front of our open kitchen, or a card to use anywhere at Amana.'),

  ('gift', 'gift.steps.title', 'Cómo funciona', 'How it works'),
  ('gift', 'gift.steps.step1Title', 'Elige', 'Choose'),
  ('gift', 'gift.steps.step1Text', 'Escoge la experiencia o el monto de la tarjeta.', 'Pick the experience or the gift card amount.'),
  ('gift', 'gift.steps.step2Title', 'Confirma', 'Confirm'),
  ('gift', 'gift.steps.step2Text', 'Déjanos tus datos y el método de pago que prefieras.', 'Leave us your details and preferred payment method.'),
  ('gift', 'gift.steps.step3Title', 'Te contactamos', 'We reach out'),
  ('gift', 'gift.steps.step3Text', 'Coordinamos el pago y la entrega en 24-48h.', 'We arrange payment and delivery within 24-48h.'),

  ('gift', 'gift.chefsTable.eyebrow', 'La experiencia', 'The experience'),
  ('gift', 'gift.chefsTable.badge', 'Menú de 7 tiempos', '7-course menu'),
  ('gift', 'gift.chefsTable.title', 'Chef''s Table', 'Chef''s Table'),
  ('gift', 'gift.chefsTable.description', 'Nuestro menú de degustación de 7 tiempos — servido de martes a sábado por la noche, frente a nuestra cocina abierta. Reserva requerida con mínimo 12h de anticipación.', 'Our 7-course tasting menu — served Tuesday to Saturday evenings, in front of our open kitchen. Reservation required at least 12h in advance.'),
  ('gift', 'gift.chefsTable.perPerson', 'por persona', 'per person'),
  ('gift', 'gift.chefsTable.quantityLabel', 'Cantidad (personas)', 'Quantity (guests)'),
  ('gift', 'gift.chefsTable.pairingLabel', 'Maridaje', 'Wine pairing'),
  ('gift', 'gift.chefsTable.pairingHelp', 'Selección de vinos de nuestra sommelier', 'Wine selection by our sommelier'),
  ('gift', 'gift.chefsTable.noPairing', 'Sin maridaje', 'No pairing'),
  ('gift', 'gift.chefsTable.pairingError', 'El maridaje no puede superar la cantidad de personas', 'Pairing cannot exceed the number of guests'),

  ('gift', 'gift.cards.eyebrow', 'Tarjetas de regalo', 'Gift cards'),
  ('gift', 'gift.cards.cardLabel', 'Tarjeta de regalo', 'Gift card'),
  ('gift', 'gift.cards.cardFooter', 'Válida en todo Amana · Barrio Escalante', 'Valid across Amana · Barrio Escalante'),
  ('gift', 'gift.cards.title', 'Otras tarjetas de regalo', 'Other gift cards'),
  ('gift', 'gift.cards.subtitle', 'Aplicables al menú principal, Chef''s Table, eventos especiales y demás.', 'Valid for the main menu, Chef''s Table, special events and more.'),
  ('gift', 'gift.cards.quantityLabel', 'Cantidad', 'Quantity'),
  ('gift', 'gift.cards.amountLabel', 'Monto', 'Amount'),
  ('gift', 'gift.cards.otherAmount', 'Otro monto', 'Other amount'),
  ('gift', 'gift.cards.otherAmountPlaceholder', 'Ej: 25000', 'E.g. 25000'),
  ('gift', 'gift.cards.minAmount', 'Monto mínimo: {min}', 'Minimum amount: {min}'),

  ('gift', 'gift.common.total', 'Total', 'Total'),
  ('gift', 'gift.common.order', 'Ordenar', 'Order'),
  ('gift', 'gift.common.summary', 'Resumen del pedido', 'Order summary'),
  ('gift', 'gift.common.guests', 'personas', 'guests'),
  ('gift', 'gift.common.pairings', 'maridajes', 'pairings'),
  ('gift', 'gift.common.cardsOf', 'tarjeta(s) de', 'gift card(s) of'),

  ('gift', 'gift.form.title', 'Datos del pedido', 'Your details'),
  ('gift', 'gift.form.firstName', 'Nombre', 'First name'),
  ('gift', 'gift.form.lastName', 'Apellido', 'Last name'),
  ('gift', 'gift.form.email', 'Correo electrónico', 'Email'),
  ('gift', 'gift.form.paymentMethod', 'Método de pago', 'Payment method'),
  ('gift', 'gift.form.paymentPlaceholder', 'Seleccione una opción', 'Select an option'),
  ('gift', 'gift.form.paymentLink', 'Link de pago', 'Payment link'),
  ('gift', 'gift.form.paypal', 'PayPal', 'PayPal'),
  ('gift', 'gift.form.sinpe', 'SINPE Móvil', 'SINPE Móvil'),
  ('gift', 'gift.form.message', '¿Quisiera incluir algún mensaje?', 'Would you like to include a message?'),
  ('gift', 'gift.form.messagePlaceholder', 'Dedicatoria o comentario (opcional)', 'Dedication or comment (optional)'),
  ('gift', 'gift.form.submit', 'Confirmar orden', 'Confirm order'),
  ('gift', 'gift.form.submitting', 'Enviando...', 'Sending...'),
  ('gift', 'gift.form.note', 'Nuestro equipo le estará contactando para realizar y confirmar el pago en un periodo de 24-48h.', 'Our team will contact you to process and confirm payment within 24-48 hours.'),
  ('gift', 'gift.form.successTitle', '¡Gracias por su pedido!', 'Thank you for your order!'),
  ('gift', 'gift.form.successText', 'Hemos recibido su solicitud. Le contactaremos por correo en un plazo de 24-48h para coordinar el pago.', 'We have received your request. We will email you within 24-48 hours to arrange payment.'),
  ('gift', 'gift.form.newOrder', 'Hacer otro pedido', 'Place another order'),
  ('gift', 'gift.form.errorRequired', 'Este campo es requerido', 'This field is required'),
  ('gift', 'gift.form.errorEmail', 'Ingrese un correo válido', 'Please enter a valid email'),
  ('gift', 'gift.form.errorMinAmount', 'El monto es menor al mínimo permitido', 'The amount is below the minimum'),
  ('gift', 'gift.form.errorRateLimited', 'Ha enviado demasiados pedidos. Intente más tarde.', 'Too many orders sent. Please try again later.'),
  ('gift', 'gift.form.errorGeneric', 'No se pudo enviar el pedido. Intente de nuevo.', 'The order could not be sent. Please try again.')
ON CONFLICT (key) DO NOTHING;