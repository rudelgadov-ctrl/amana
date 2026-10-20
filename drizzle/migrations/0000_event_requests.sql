-- ===========================================
-- /eventos — quote requests for private events
-- Copy lives in site_translations (section 'eventsPage', editable in Admin > Traducciones).
-- Requests are managed in Admin > Solicitudes de eventos (/admin/event-requests).
-- ===========================================

-- 1. Table
CREATE TABLE public.event_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  company TEXT CHECK (company IS NULL OR char_length(company) <= 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 254 AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  phone TEXT NOT NULL CHECK (char_length(btrim(phone)) BETWEEN 6 AND 30),
  event_type TEXT NOT NULL CHECK (event_type IN ('corporate', 'celebration', 'launch', 'other')),
  event_date DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests BETWEEN 1 AND 500),
  space TEXT NOT NULL CHECK (
    space IN ('salon_azul', 'salon_verde', 'salon_principal', 'chefs_table', 'full_restaurant', 'combination')
  ),
  menu_preference TEXT CHECK (
    menu_preference IS NULL OR menu_preference IN ('three_course', 'five_six_course', 'chefs_table')
  ),
  comments TEXT CHECK (comments IS NULL OR char_length(comments) <= 2000),
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'proposal_sent', 'confirmed', 'completed', 'declined')
  ),
  admin_notes TEXT,
  -- Set by the notify-event-request Edge Function once the automatic emails go out (idempotency marker)
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX event_requests_created_at_idx ON public.event_requests (created_at DESC);
CREATE INDEX event_requests_status_idx ON public.event_requests (status);
CREATE INDEX event_requests_email_created_idx ON public.event_requests (lower(email), created_at);

-- 2. Request code + server-owned fields (BEFORE INSERT trigger)
CREATE SEQUENCE public.event_request_code_seq;

CREATE OR REPLACE FUNCTION public.event_requests_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent INTEGER;
  v_today DATE := (now() AT TIME ZONE 'America/Costa_Rica')::date;
BEGIN
  -- Server-owned fields: never trust the client for these
  NEW.request_code := 'EV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.event_request_code_seq')::text, 4, '0');
  NEW.status := 'new';
  NEW.admin_notes := NULL;
  NEW.notified_at := NULL;
  NEW.created_at := now();
  NEW.updated_at := now();

  -- Normalise customer data
  NEW.email := lower(btrim(NEW.email));
  NEW.name := btrim(NEW.name);
  NEW.phone := btrim(NEW.phone);
  IF NEW.company IS NOT NULL AND btrim(NEW.company) = '' THEN
    NEW.company := NULL;
  ELSIF NEW.company IS NOT NULL THEN
    NEW.company := btrim(NEW.company);
  END IF;
  IF NEW.comments IS NOT NULL AND btrim(NEW.comments) = '' THEN
    NEW.comments := NULL;
  END IF;

  -- Events run Tuesday to Saturday, never in the past (Costa Rica time)
  IF NEW.event_date < v_today OR extract(isodow FROM NEW.event_date) NOT BETWEEN 2 AND 6 THEN
    RAISE EXCEPTION 'invalid_event_date';
  END IF;

  -- Light abuse guard: max 5 requests per email per hour
  SELECT count(*) INTO v_recent
  FROM public.event_requests
  WHERE lower(email) = NEW.email
    AND created_at > now() - interval '1 hour';
  IF v_recent >= 5 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.event_requests_before_insert() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER event_requests_before_insert
  BEFORE INSERT ON public.event_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.event_requests_before_insert();

CREATE TRIGGER update_event_requests_updated_at
  BEFORE UPDATE ON public.event_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Row Level Security
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;

-- Public visitors can create requests (bounds enforced by CHECK constraints + trigger).
CREATE POLICY "Anyone can create event requests"
  ON public.event_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new' AND admin_notes IS NULL);

-- Only CMS users (admin/editor) can read and manage requests. No anonymous SELECT.
CREATE POLICY "CMS users can view event requests"
  ON public.event_requests FOR SELECT
  TO authenticated
  USING (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can update event requests"
  ON public.event_requests FOR UPDATE
  TO authenticated
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "CMS users can delete event requests"
  ON public.event_requests FOR DELETE
  TO authenticated
  USING (public.can_manage_content(auth.uid()));

-- 4. Grants
GRANT INSERT ON public.event_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_requests TO authenticated;
GRANT ALL ON public.event_requests TO service_role;
GRANT USAGE ON SEQUENCE public.event_request_code_seq TO anon, authenticated, service_role;

-- 5. Page copy (Admin > Traducciones > "Página de Eventos"; nav link under "Navegación").
-- An empty text hides that item on the page (event types, menus, steps, FAQ entries).
INSERT INTO public.site_translations (section, key, text_es, text_en)
VALUES
  ('nav', 'nav.events', 'Eventos', 'Events'),
  ('eventsPage', 'eventsPage.meta.title', 'Eventos en Amana | Barrio Escalante', 'Events at Amana | Barrio Escalante'),
  ('eventsPage', 'eventsPage.meta.description', 'Cenas corporativas, celebraciones y lanzamientos en Barrio Escalante. Salones privados de 8 a 42 personas.', 'Corporate dinners, celebrations and launches in Barrio Escalante. Private rooms for 8 to 42 guests.'),
  ('eventsPage', 'eventsPage.hero.title', 'Eventos en Amana', 'Events at Amana'),
  ('eventsPage', 'eventsPage.hero.text', 'Cenas corporativas, celebraciones y lanzamientos en Barrio Escalante, con la cocina de todos los días.', 'Corporate dinners, celebrations and launches in Barrio Escalante, with the same cooking we serve every day.'),
  ('eventsPage', 'eventsPage.hero.cta', 'Cotiza tu evento', 'Get a quote'),
  ('eventsPage', 'eventsPage.hero.imageAlt', 'Salón montado para un evento', 'Room set up for an event'),
  ('eventsPage', 'eventsPage.types.title', 'Tipos de evento', 'Types of events'),
  ('eventsPage', 'eventsPage.types.type1Title', 'Cenas corporativas', 'Corporate dinners'),
  ('eventsPage', 'eventsPage.types.type1Text', 'Cierres de año, cenas con clientes, equipos de trabajo.', 'Year-end parties, client dinners, team gatherings.'),
  ('eventsPage', 'eventsPage.types.type2Title', 'Celebraciones', 'Celebrations'),
  ('eventsPage', 'eventsPage.types.type2Text', 'Cumpleaños, aniversarios, compromisos, graduaciones, reuniones familiares.', 'Birthdays, anniversaries, engagements, graduations, family gatherings.'),
  ('eventsPage', 'eventsPage.types.type3Title', 'Lanzamientos y presentaciones', 'Launches and presentations'),
  ('eventsPage', 'eventsPage.types.type3Text', 'Lanzamiento de marcas y productos, conferencias, exposiciones.', 'Brand and product launches, conferences, exhibitions.'),
  ('eventsPage', 'eventsPage.spaces.title', 'Espacios', 'Spaces'),
  ('eventsPage', 'eventsPage.spaces.azulName', 'Salón Azul', 'Blue Room'),
  ('eventsPage', 'eventsPage.spaces.azulTag', 'Privado', 'Private'),
  ('eventsPage', 'eventsPage.spaces.azulCapacity', 'Hasta 8 personas sentadas', 'Up to 8 seated guests'),
  ('eventsPage', 'eventsPage.spaces.verdeName', 'Salón Verde', 'Green Room'),
  ('eventsPage', 'eventsPage.spaces.verdeTag', 'Privado', 'Private'),
  ('eventsPage', 'eventsPage.spaces.verdeCapacity', 'Hasta 12 personas sentadas', 'Up to 12 seated guests'),
  ('eventsPage', 'eventsPage.spaces.principalName', 'Salón principal', 'Main dining room'),
  ('eventsPage', 'eventsPage.spaces.principalTag', '', ''),
  ('eventsPage', 'eventsPage.spaces.principalCapacity', 'Hasta 22 personas sentadas', 'Up to 22 seated guests'),
  ('eventsPage', 'eventsPage.spaces.chefsName', 'Chef''s Table', 'Chef''s Table'),
  ('eventsPage', 'eventsPage.spaces.chefsTag', 'Degustación frente a la cocina abierta', 'Tasting menu in front of the open kitchen'),
  ('eventsPage', 'eventsPage.spaces.chefsCapacity', 'Hasta 8 personas', 'Up to 8 guests'),
  ('eventsPage', 'eventsPage.spaces.fullTitle', 'Restaurante completo', 'Full restaurant'),
  ('eventsPage', 'eventsPage.spaces.fullText', 'Hasta 42 personas sentadas, distribuidas entre nuestros salones. Cotización a la medida.', 'Up to 42 seated guests across our rooms. Custom quote.'),
  ('eventsPage', 'eventsPage.menus.title', 'Menús', 'Menus'),
  ('eventsPage', 'eventsPage.menus.menu1Title', 'Menú de 3 tiempos', '3-course menu'),
  ('eventsPage', 'eventsPage.menus.menu1Text', 'Entrada, plato fuerte y postre.', 'Starter, main course and dessert.'),
  ('eventsPage', 'eventsPage.menus.menu1Price', 'Desde ₡25.000 por persona', 'From ₡25,000 per person'),
  ('eventsPage', 'eventsPage.menus.menu2Title', 'Menú de 5 a 6 tiempos', '5 to 6-course menu'),
  ('eventsPage', 'eventsPage.menus.menu2Text', '', ''),
  ('eventsPage', 'eventsPage.menus.menu2Price', 'Desde ₡35.000 por persona', 'From ₡35,000 per person'),
  ('eventsPage', 'eventsPage.menus.menu3Title', 'Chef''s Table', 'Chef''s Table'),
  ('eventsPage', 'eventsPage.menus.menu3Text', 'Degustación de 7 tiempos.', '7-course tasting menu.'),
  ('eventsPage', 'eventsPage.menus.menu3Price', '₡44.000 por persona', '₡44,000 per person'),
  ('eventsPage', 'eventsPage.menus.pricesNote', 'Precios incluyen impuestos. Bebidas aparte: opciones con o sin alcohol, vinos o cocteles; el costo depende de la cantidad y la elección.', 'Prices include taxes. Drinks are extra: alcoholic or non-alcoholic options, wines or cocktails; the cost depends on quantity and selection.'),
  ('eventsPage', 'eventsPage.menus.conditionsTitle', 'Condiciones', 'Conditions'),
  ('eventsPage', 'eventsPage.menus.conditionsText', 'Eventos podrían requerir de un adelanto del 15-25% según fecha y cantidad de personas. Consumo mínimo puede variar según fecha y temporada.', 'Events may require a 15–25% advance payment depending on the date and number of guests. Minimum spend may vary by date and season.'),
  ('eventsPage', 'eventsPage.menus.customBudget', '¿Tienes otro presupuesto o necesidades? Cuéntanos los detalles y te hacemos una propuesta a la medida.', 'Have a different budget or needs? Tell us the details and we''ll put together a tailored proposal.'),
  ('eventsPage', 'eventsPage.menus.invoiceNote', 'Emitimos factura electrónica a nombre de tu empresa.', 'We issue electronic invoices in your company''s name.'),
  ('eventsPage', 'eventsPage.steps.title', 'Cómo funciona', 'How it works'),
  ('eventsPage', 'eventsPage.steps.step1', 'Cuéntanos fecha, número de personas y tipo de evento.', 'Tell us the date, number of guests and type of event.'),
  ('eventsPage', 'eventsPage.steps.step2', 'Te enviamos una propuesta en menos de 48 horas.', 'We send you a proposal within 48 hours.'),
  ('eventsPage', 'eventsPage.steps.step3', 'Confirmas estar de acuerdo con la propuesta y haces el adelanto de ser requerido.', 'You approve the proposal and make the advance payment if required.'),
  ('eventsPage', 'eventsPage.steps.step4', 'Nos encargamos del resto.', 'We take care of the rest.'),
  ('eventsPage', 'eventsPage.form.title', 'Cotiza tu evento', 'Request a quote'),
  ('eventsPage', 'eventsPage.form.name', 'Nombre', 'Name'),
  ('eventsPage', 'eventsPage.form.company', 'Empresa (opcional)', 'Company (optional)'),
  ('eventsPage', 'eventsPage.form.email', 'Correo', 'Email'),
  ('eventsPage', 'eventsPage.form.phone', 'Teléfono', 'Phone'),
  ('eventsPage', 'eventsPage.form.eventType', 'Tipo de evento', 'Type of event'),
  ('eventsPage', 'eventsPage.form.typeCorporate', 'Corporativo', 'Corporate'),
  ('eventsPage', 'eventsPage.form.typeCelebration', 'Celebración', 'Celebration'),
  ('eventsPage', 'eventsPage.form.typeLaunch', 'Lanzamiento', 'Launch'),
  ('eventsPage', 'eventsPage.form.typeOther', 'Otro', 'Other'),
  ('eventsPage', 'eventsPage.form.date', 'Fecha deseada', 'Preferred date'),
  ('eventsPage', 'eventsPage.form.datePlaceholder', 'Elige una fecha (martes a sábado)', 'Choose a date (Tuesday to Saturday)'),
  ('eventsPage', 'eventsPage.form.guests', 'Número de personas', 'Number of guests'),
  ('eventsPage', 'eventsPage.form.space', 'Espacio de interés', 'Preferred space'),
  ('eventsPage', 'eventsPage.form.spaceAzul', 'Salón Azul (hasta 8)', 'Blue Room (up to 8)'),
  ('eventsPage', 'eventsPage.form.spaceVerde', 'Salón Verde (hasta 12)', 'Green Room (up to 12)'),
  ('eventsPage', 'eventsPage.form.spacePrincipal', 'Salón principal (hasta 22)', 'Main dining room (up to 22)'),
  ('eventsPage', 'eventsPage.form.spaceChefs', 'Chef''s Table (hasta 8)', 'Chef''s Table (up to 8)'),
  ('eventsPage', 'eventsPage.form.spaceFull', 'Restaurante completo', 'Full restaurant'),
  ('eventsPage', 'eventsPage.form.spaceCombination', 'Combinación de salones', 'Combination of rooms'),
  ('eventsPage', 'eventsPage.form.menu', 'Preferencia de menú', 'Menu preference'),
  ('eventsPage', 'eventsPage.form.menuPlaceholder', 'Elige un menú (opcional)', 'Choose a menu (optional)'),
  ('eventsPage', 'eventsPage.form.comments', 'Comentarios', 'Comments'),
  ('eventsPage', 'eventsPage.form.customQuoteNote', 'Este evento se cotiza a la medida. Te enviaremos una propuesta con el consumo mínimo para esa fecha.', 'This event is quoted on a custom basis. We''ll send you a proposal with the minimum spend for that date.'),
  ('eventsPage', 'eventsPage.form.capacityNote', 'Ese espacio recibe hasta {capacity} personas. Te sugeriremos la mejor opción en la propuesta.', 'That space holds up to {capacity} guests. We''ll suggest the best option in our proposal.'),
  ('eventsPage', 'eventsPage.form.submit', 'Enviar solicitud', 'Send request'),
  ('eventsPage', 'eventsPage.form.submitting', 'Enviando…', 'Sending…'),
  ('eventsPage', 'eventsPage.form.success', 'Recibimos tu solicitud. Te respondemos en menos de 48 horas.', 'We''ve received your request. We''ll get back to you within 48 hours.'),
  ('eventsPage', 'eventsPage.form.errorRequired', 'Requerido', 'Required'),
  ('eventsPage', 'eventsPage.form.errorEmail', 'Correo inválido', 'Invalid email'),
  ('eventsPage', 'eventsPage.form.errorPhone', 'Ingresa un teléfono válido', 'Enter a valid phone number'),
  ('eventsPage', 'eventsPage.form.errorDate', 'Elige una fecha', 'Choose a date'),
  ('eventsPage', 'eventsPage.form.errorGuests', 'Indica el número de personas', 'Enter the number of guests'),
  ('eventsPage', 'eventsPage.form.errorRateLimited', 'Has enviado demasiadas solicitudes. Intenta más tarde.', 'You''ve sent too many requests. Please try again later.'),
  ('eventsPage', 'eventsPage.form.errorGeneric', 'No pudimos enviar la solicitud. Prueba de nuevo o escríbenos por WhatsApp.', 'We couldn''t send your request. Please try again or message us on WhatsApp.'),
  ('eventsPage', 'eventsPage.faq.title', 'Preguntas frecuentes', 'Frequently asked questions'),
  ('eventsPage', 'eventsPage.faq.q1', '¿Puedo reservar un salón privado sin cerrar el restaurante?', 'Can I book a private room without closing the restaurant?'),
  ('eventsPage', 'eventsPage.faq.a1', 'Sí. El Salón Azul (hasta 8 personas) y el Salón Verde (hasta 12) son privados y funcionan durante el servicio normal.', 'Yes. The Blue Room (up to 8 guests) and the Green Room (up to 12) are private and operate during regular service.'),
  ('eventsPage', 'eventsPage.faq.q2', '¿Puedo reservar el restaurante completo?', 'Can I book the entire restaurant?'),
  ('eventsPage', 'eventsPage.faq.a2', 'Sí, hasta 42 personas sentadas, distribuidas entre los salones. Se cotiza a la medida.', 'Yes, up to 42 seated guests across our rooms. It is quoted on a custom basis.'),
  ('eventsPage', 'eventsPage.faq.q3', '¿Tienen opciones vegetarianas o para alergias?', 'Do you have vegetarian or allergy-friendly options?'),
  ('eventsPage', 'eventsPage.faq.a3', 'Sí, adaptamos el menú; indícalo al cotizar.', 'Yes, we adapt the menu; just let us know when you request your quote.'),
  ('eventsPage', 'eventsPage.faq.q4', '¿Puedo traer decoración o pastel?', 'Can I bring decorations or a cake?'),
  ('eventsPage', 'eventsPage.faq.a4', 'Sí. Especifica tus necesidades al cotizar para coordinarlo.', 'Yes. Tell us what you need when you request your quote so we can coordinate.'),
  ('eventsPage', 'eventsPage.faq.q5', '¿Cuál es la política de cancelación?', 'What is the cancellation policy?'),
  ('eventsPage', 'eventsPage.faq.a5', E'Grupos de hasta 14 personas: cancelación con devolución del depósito hasta 72 horas antes de la reservación.\nGrupos de 15 personas o más: cancelación con devolución del depósito hasta 1 semana antes de la reservación.', E'Groups of up to 14 guests: cancellation with a full deposit refund up to 72 hours before the reservation.\nGroups of 15 or more: cancellation with a full deposit refund up to 1 week before the reservation.')
ON CONFLICT (key) DO NOTHING;