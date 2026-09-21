GRANT INSERT ON public.gift_orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_orders TO authenticated;
GRANT ALL ON public.gift_orders TO service_role;
GRANT USAGE ON SEQUENCE public.gift_order_code_seq TO anon, authenticated, service_role;