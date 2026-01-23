import heroDish from '@/assets/hero-dish.jpg';
import dishHokkaido from '@/assets/dish-hokkaido.jpg';
import dishRisottoHongos from '@/assets/dish-risotto-hongos.jpg';
import dishRisotto from '@/assets/dish-risotto.jpg';
import dishTortellini from '@/assets/dish-tortellini.jpg';
import dishTuetano from '@/assets/dish-tuetano.jpg';
import dishCalamar from '@/assets/dish-calamar.jpg';
import dishLangosta from '@/assets/dish-langosta.jpg';
import dishCeviche from '@/assets/dish-ceviche.jpg';
import dishChuleton from '@/assets/dish-chuleton.jpg';
import dishMacarela from '@/assets/dish-macarela.jpg';

type SupabaseClientLike = {
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        body: Blob,
        options?: { upsert?: boolean; contentType?: string },
      ) => Promise<{ error: { message: string } | null }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
  from: (table: string) => {
    insert: (rows: any[]) => Promise<{ error: { message: string } | null }>;
  };
};

type SeedImage = {
  location: 'hero' | 'carousel';
  url: string;
  alt_text_es: string;
  alt_text_en: string;
};

const SEED_IMAGES: SeedImage[] = [
  {
    location: 'hero',
    url: heroDish,
    alt_text_es: 'Plato signature de Amana',
    alt_text_en: 'Amana signature dish',
  },
  // Carousel (Concept)
  {
    location: 'carousel',
    url: dishHokkaido,
    alt_text_es: 'Plato signature (Hokkaido)',
    alt_text_en: 'Signature dish (Hokkaido)',
  },
  {
    location: 'carousel',
    url: dishRisottoHongos,
    alt_text_es: 'Risotto de hongos',
    alt_text_en: 'Mushroom risotto',
  },
  {
    location: 'carousel',
    url: dishRisotto,
    alt_text_es: 'Risotto',
    alt_text_en: 'Risotto',
  },
  {
    location: 'carousel',
    url: dishTortellini,
    alt_text_es: 'Tortellini',
    alt_text_en: 'Tortellini',
  },
  {
    location: 'carousel',
    url: dishTuetano,
    alt_text_es: 'Tuétano',
    alt_text_en: 'Bone marrow',
  },
  {
    location: 'carousel',
    url: dishCalamar,
    alt_text_es: 'Calamar',
    alt_text_en: 'Squid',
  },
  {
    location: 'carousel',
    url: dishLangosta,
    alt_text_es: 'Langosta',
    alt_text_en: 'Lobster',
  },
  {
    location: 'carousel',
    url: dishCeviche,
    alt_text_es: 'Ceviche',
    alt_text_en: 'Ceviche',
  },
  {
    location: 'carousel',
    url: dishChuleton,
    alt_text_es: 'Chuletón',
    alt_text_en: 'Rib steak',
  },
  {
    location: 'carousel',
    url: dishMacarela,
    alt_text_es: 'Macarela',
    alt_text_en: 'Mackerel',
  },
];

const guessContentType = (url: string) => {
  const lower = url.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

export async function seedSiteImages(supabase: SupabaseClientLike) {
  const bucket = 'site-images';
  const now = Date.now();

  const byLocationCount: Record<string, number> = {};

  for (const img of SEED_IMAGES) {
    byLocationCount[img.location] = byLocationCount[img.location] ?? 0;
    const sort_order = byLocationCount[img.location];
    byLocationCount[img.location] += 1;

    const res = await fetch(img.url);
    if (!res.ok) {
      throw new Error(`No se pudo leer el asset local: ${img.url}`);
    }
    const blob = await res.blob();
    const contentType = blob.type || guessContentType(img.url);

    const storagePath = `${img.location}/seed-${now}-${sort_order}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, blob, { upsert: true, contentType });
    if (uploadError) throw new Error(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(storagePath);

    const { error: dbError } = await supabase.from('site_images').insert([
      {
        location: img.location,
        storage_path: storagePath,
        url: publicUrl,
        alt_text_es: img.alt_text_es,
        alt_text_en: img.alt_text_en,
        is_active: true,
        sort_order,
      },
    ]);
    if (dbError) throw new Error(dbError.message);
  }

  return { inserted: SEED_IMAGES.length };
}
