-- Editable texts for the Chef's Table tab on the Menu page (Admin > Traducciones > Menú).
-- The media (video/photo) for this block is managed in Admin > Imágenes,
-- location "menu-chefs-table"; phone/WhatsApp come from restaurant_info.
INSERT INTO public.site_translations (section, key, text_es, text_en)
VALUES
  ('menuPage', 'menuPage.chefsTableTitle',
    'chef''s table - menú de 7 tiempos',
    'chef''s table - 7 course menu'),
  ('menuPage', 'menuPage.chefsTableIntro',
    'Servido frente a nuestra cocina abierta, llevado a su mesa por nuestros cocineros.',
    'Served in front of our open kitchen, brought to your table by our chefs.'),
  ('menuPage', 'menuPage.chefsTableQuote',
    'Lo cotidiano con otros ojos.',
    'The everyday through different eyes.'),
  ('menuPage', 'menuPage.chefsTableSchedule',
    'De martes a sábado, para la cena - 3 mesas por noche.',
    'Tuesday to Saturday, for dinner - 3 tables per night.'),
  ('menuPage', 'menuPage.chefsTablePrice',
    '₡44.000 por persona',
    '₡44,000 per person'),
  ('menuPage', 'menuPage.chefsTableWinePairing',
    'Maridaje de vinos (opcional): ₡16.000 por persona.',
    'Wine pairing (optional): ₡16,000 per person.'),
  ('menuPage', 'menuPage.chefsTableReservationNote',
    'Recomendado reservar y comunicar restricciones alimentarias o alergias con al menos 12 h de anticipación.',
    'We recommend reserving and communicating dietary restrictions or allergies at least 12 hours in advance.'),
  ('menuPage', 'menuPage.chefsTableInfoLabel',
    'Información adicional:',
    'Additional information:'),
  ('menuPage', 'menuPage.chefsTableInfoSuffix',
    '(WhatsApp).',
    '(WhatsApp).')
ON CONFLICT (key) DO NOTHING;
