-- Update /gift page copy per client-approved wording.
-- These rows already exist (seeded in 20260921035639_...sql); this migration
-- only updates their text so the live site (which reads site_translations
-- before falling back to the code) matches the code fallback.

UPDATE public.site_translations SET text_es = 'Amana como regalo', text_en = 'Amana as a Gift'
  WHERE section = 'gift' AND key = 'gift.title';

UPDATE public.site_translations SET text_es = 'Comparte la experiencia', text_en = 'Share the experience'
  WHERE section = 'gift' AND key = 'gift.subtitle';

UPDATE public.site_translations SET
  text_es = 'Obsequia una noche memorable en nuestro Chef''s Table o una tarjeta de regalo para disfrutar a su ritmo, cuándo y cómo prefieran.',
  text_en = 'Give the gift of a memorable evening at our Chef''s Table, or a flexible card to enjoy at their own pace, whenever and however they prefer.'
  WHERE section = 'gift' AND key = 'gift.heroNote';

UPDATE public.site_translations SET text_es = 'Escoge una experiencia o el monto de la tarjeta de regalo.', text_en = 'Pick the experience or the gift card amount.'
  WHERE section = 'gift' AND key = 'gift.steps.step1Text';

UPDATE public.site_translations SET text_es = 'Confirmar', text_en = 'Confirm'
  WHERE section = 'gift' AND key = 'gift.steps.step2Title';

UPDATE public.site_translations SET
  text_es = 'Compártenos tus datos de contacto y método de pago preferido.',
  text_en = 'Share your contact info and preferred payment method.'
  WHERE section = 'gift' AND key = 'gift.steps.step2Text';

UPDATE public.site_translations SET
  text_es = 'Nuestro equipo te contacta, confirmando pago y entrega entre 24-48h.',
  text_en = 'We arrange payment and delivery within 24-48h.'
  WHERE section = 'gift' AND key = 'gift.steps.step3Text';

UPDATE public.site_translations SET text_es = 'Elige el monto', text_en = 'Choose your amount'
  WHERE section = 'gift' AND key = 'gift.cards.title';

UPDATE public.site_translations SET
  text_es = 'Válidas para nuestro menú principal, Chef''s Table y eventos especiales.',
  text_en = 'Valid for our main menu, Chef''s Table, and special events.'
  WHERE section = 'gift' AND key = 'gift.cards.subtitle';
