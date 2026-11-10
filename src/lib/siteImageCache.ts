import { isVideoUrl } from '@/lib/media';

export interface SiteImage {
  id: string;
  location: string;
  storage_path: string;
  url: string;
  alt_text_es: string | null;
  alt_text_en: string | null;
  is_active: boolean;
  sort_order: number;
}

const CACHE_KEY = 'amana:site-images:v1';
const MAX_AGE = 24 * 60 * 60 * 1000;
const started = new Set<string>();

export function readSiteImageCache(): SiteImage[] | undefined {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!cached || typeof cached.savedAt !== 'number' || Date.now() - cached.savedAt > MAX_AGE || !Array.isArray(cached.images)) return undefined;
    if (!cached.images.every((image: SiteImage) =>
      image && typeof image.id === 'string' && typeof image.location === 'string' &&
      typeof image.url === 'string' && image.is_active === true && typeof image.sort_order === 'number'
    )) return undefined;
    return cached.images;
  } catch {
    return undefined;
  }
}

export function saveSiteImageCache(images: SiteImage[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), images }));
  } catch {
    // Private browsing or full storage must never prevent live CMS loading.
  }
}

export function warmPageImages(images: SiteImage[], pathname: string) {
  const path = pathname.toLowerCase().replace(/^\/(en|es)(?=\/|$)/, '') || '/';
  const locations = path === '/' ? ['hero', 'carousel', 'card-menu', 'card-drinks', 'card-chefs-table', 'card-events', 'card-events-icon']
    : path === '/eventos' || path === '/events' ? images.filter(image => image.location.startsWith('events-')).map(image => image.location)
    : path === '/gift' ? ['gift-chefs-table', 'gift-chefs-table-2']
    : path === '/about' ? ['interior', 'chef', 'about', 'gallery']
    : path === '/menu' ? ['menu-chefs-table'] : [];

  // Start the current page's photos during the existing font/translation loading
  // screen. Never download videos or unrelated pages in the background.
  const relevant = images.filter(image => locations.includes(image.location));
  relevant.sort((a, b) => Number(['hero', 'events-hero'].includes(b.location)) - Number(['hero', 'events-hero'].includes(a.location)));
  for (const image of relevant) {
    if (isVideoUrl(image.url) || started.has(image.url)) continue;
    started.add(image.url);
    const preload = new Image();
    preload.fetchPriority = ['hero', 'events-hero'].includes(image.location) ? 'high' : 'low';
    preload.onerror = () => started.delete(image.url);
    preload.src = image.url;
  }
}