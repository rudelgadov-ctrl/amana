-- Schedule change requested by Gustavo (WhatsApp, 2026-11-02): starting
-- Nov 16, Monday joins the Tuesday-Wednesday dinner-only slot (so the
-- restaurant is no longer closed Mondays), and Sunday adds a dinner service
-- until 9 PM. Applied immediately per Rubén's decision rather than gated by
-- date, since the schedule only had 3 rows worth tracking going forward.
--
-- This also cleans up the root cause of "mis cambios no se reflejan en
-- ningún lado": the site only ever rendered the `contactInfo` section's
-- hours* keys (via useContactInfo / Footer.tsx / Contact.tsx). The `hours`
-- section (hours.monday, hours.lunch, etc.) was dead content, never read by
-- any component, including the entry Gustavo had already started editing
-- there ("Almuerzo 12-4 PM, (a partir de 22/11) Cena 6-10 PM"). Dropping it
-- here and removing it from the admin UI closes that trap.

-- contactInfo.hoursTuesdayWednesday -> contactInfo.hoursMondayWednesday
-- (text is already correct: dinner-only 6-10 PM covers the merged range)
UPDATE public.site_translations
SET key = 'contactInfo.hoursMondayWednesday'
WHERE section = 'contactInfo' AND key = 'contactInfo.hoursTuesdayWednesday';

-- Sunday now adds dinner service until 9 PM
UPDATE public.site_translations
SET text_es = 'Almuerzo 12-4 PM Cena 6-9 PM', text_en = 'Lunch 12-4 PM Dinner 6-9 PM'
WHERE section = 'contactInfo' AND key = 'contactInfo.hoursSunday';

-- Monday is no longer its own closed row; it's merged into Monday-Wednesday
DELETE FROM public.site_translations
WHERE section = 'contactInfo' AND key = 'contactInfo.hoursMonday';

-- Drop the dead `hours` section entirely (unused by any component)
DELETE FROM public.site_translations
WHERE section = 'hours';
