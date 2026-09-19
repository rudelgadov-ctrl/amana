-- Translations for the Tripadvisor Travelers' Choice 2026 block in the reviews section
INSERT INTO public.site_translations (section, key, text_es, text_en)
VALUES
  ('reviews', 'reviews.tripadvisorTitle', 'Travelers’ Choice 2026', 'Travelers’ Choice 2026'),
  ('reviews', 'reviews.tripadvisorText', 'Reconocidos por Tripadvisor entre los restaurantes favoritos de los viajeros.', 'Recognized by Tripadvisor among travelers’ favorite restaurants.')
ON CONFLICT (key) DO NOTHING;
