-- Create events table for upcoming events
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date_text_es TEXT NOT NULL,
  date_text_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access for events
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

-- CMS users can insert events
CREATE POLICY "CMS users can insert events"
  ON public.events FOR INSERT
  WITH CHECK (can_manage_content(auth.uid()));

-- CMS users can update events
CREATE POLICY "CMS users can update events"
  ON public.events FOR UPDATE
  USING (can_manage_content(auth.uid()));

-- CMS users can delete events
CREATE POLICY "CMS users can delete events"
  ON public.events FOR DELETE
  USING (can_manage_content(auth.uid()));

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default translation for events section title
INSERT INTO public.site_translations (section, key, text_es, text_en)
VALUES ('events', 'title', 'Próximos Eventos', 'Upcoming Events')
ON CONFLICT DO NOTHING;