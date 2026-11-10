import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readSiteImageCache, saveSiteImageCache, warmPageImages, type SiteImage } from './siteImageCache';

const image = (location: string, url: string): SiteImage => ({
  id: url, location, url, storage_path: url, alt_text_es: null,
  alt_text_en: null, is_active: true, sort_order: 0,
});

beforeEach(() => localStorage.clear());

describe('image metadata cache', () => {
  it('makes saved CMS image metadata available on the next page load', () => {
    const images = [image('hero', 'https://example.com/hero.jpg')];
    saveSiteImageCache(images);
    expect(readSiteImageCache()).toEqual(images);
  });

  it('ignores corrupt or expired metadata', () => {
    localStorage.setItem('amana:site-images:v1', 'broken json');
    expect(readSiteImageCache()).toBeUndefined();
    localStorage.setItem('amana:site-images:v1', JSON.stringify({ savedAt: 0, images: [] }));
    expect(readSiteImageCache()).toBeUndefined();
  });

  it('preloads only current-page photos, prioritizes the hero and skips video', () => {
    const created: { src?: string; fetchPriority?: string }[] = [];
    vi.stubGlobal('Image', class { constructor() { created.push(this); } });
    warmPageImages([
      image('events-space-azul', 'https://example.com/space.jpg'),
      image('events-hero', 'https://example.com/events.jpg'),
      image('gift-chefs-table', 'https://example.com/gift.jpg'),
      image('events-space-chefs-table', 'https://example.com/movie.mp4'),
    ], '/EN/eventos');
    expect(created.map(item => item.src)).toEqual(['https://example.com/events.jpg', 'https://example.com/space.jpg']);
    expect(created[0].fetchPriority).toBe('high');
    vi.unstubAllGlobals();
  });
});