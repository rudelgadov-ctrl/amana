import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSiteImages } from './useSiteImages';

const { order } = vi.hoisted(() => ({ order: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ order }) }) }) },
}));

const image = (id: string, location: string) => ({
  id, location, url: `https://example.com/${id}.jpg`, storage_path: `${id}.jpg`,
  alt_text_es: null, alt_text_en: null, is_active: true, sort_order: 0,
});

afterEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });

describe('public CMS image loading', () => {
  it('uses one request for different locations and reads new CMS images after invalidation', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    order.mockResolvedValue({ data: [image('hero-1', 'hero'), image('card-1', 'card-menu')], error: null });
    const { result } = renderHook(() => ({ hero: useSiteImages('hero'), card: useSiteImages('card-menu') }), {
      wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>,
    });
    await waitFor(() => expect(result.current.card.data?.[0]?.id).toBe('card-1'));
    expect(result.current.hero.data?.[0]?.id).toBe('hero-1');
    expect(order).toHaveBeenCalledTimes(1);
    order.mockResolvedValue({ data: [image('hero-2', 'hero')], error: null });
    await client.invalidateQueries({ queryKey: ['site-images'] });
    await waitFor(() => expect(result.current.hero.data?.[0]?.id).toBe('hero-2'));
    expect(result.current.card.data).toEqual([]);
    client.clear();
  });
});