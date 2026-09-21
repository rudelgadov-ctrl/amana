import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parseAmountList } from '@/lib/gift';

// Gift settings live in restaurant_info under gift_* keys so they are publicly
// readable (the public page needs them) and the DB trigger can use them as the
// source of truth for prices.
export const GIFT_SETTING_KEYS = [
  'gift_chefs_table_price',
  'gift_pairing_price',
  'gift_card_amounts',
  'gift_card_min_amount',
  'gift_chefs_table_enabled',
  'gift_cards_enabled',
] as const;

export type GiftSettingKey = (typeof GIFT_SETTING_KEYS)[number];

export interface GiftSettings {
  chefsTablePrice: number;
  pairingPrice: number;
  cardAmounts: number[];
  cardMinAmount: number;
  chefsTableEnabled: boolean;
  cardsEnabled: boolean;
  // Raw DB values, used by the admin form
  raw: Partial<Record<GiftSettingKey, string>>;
}

export const defaultGiftSettings: GiftSettings = {
  chefsTablePrice: 44000,
  pairingPrice: 20000,
  cardAmounts: [20000, 30000, 40000, 50000],
  cardMinAmount: 15000,
  chefsTableEnabled: true,
  cardsEnabled: true,
  raw: {},
};

const toInt = (value: string | undefined, fallback: number): number => {
  if (value === undefined) return fallback;
  const parsed = parseInt(value.replace(/\D/g, ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === 'true';
};

const fetchGiftSettings = async (): Promise<GiftSettings> => {
  const { data, error } = await supabase
    .from('restaurant_info')
    .select('key, value')
    .like('key', 'gift_%');

  if (error) throw error;

  const raw: Partial<Record<GiftSettingKey, string>> = {};
  (data || []).forEach((row) => {
    raw[row.key as GiftSettingKey] = row.value;
  });

  const amounts = raw.gift_card_amounts !== undefined ? parseAmountList(raw.gift_card_amounts) : [];

  return {
    chefsTablePrice: toInt(raw.gift_chefs_table_price, defaultGiftSettings.chefsTablePrice),
    pairingPrice: toInt(raw.gift_pairing_price, defaultGiftSettings.pairingPrice),
    cardAmounts: amounts.length > 0 ? amounts : defaultGiftSettings.cardAmounts,
    cardMinAmount: toInt(raw.gift_card_min_amount, defaultGiftSettings.cardMinAmount),
    chefsTableEnabled: toBool(raw.gift_chefs_table_enabled, defaultGiftSettings.chefsTableEnabled),
    cardsEnabled: toBool(raw.gift_cards_enabled, defaultGiftSettings.cardsEnabled),
    raw,
  };
};

export const useGiftSettings = () => {
  return useQuery({
    queryKey: ['gift-settings'],
    queryFn: fetchGiftSettings,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

const valueTypeFor = (key: GiftSettingKey): string => {
  if (key === 'gift_card_amounts') return 'list';
  if (key.endsWith('_enabled')) return 'boolean';
  return 'number';
};

export const useUpdateGiftSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<Record<GiftSettingKey, string>>) => {
      const rows = (Object.keys(values) as GiftSettingKey[]).map((key) => ({
        key,
        value: values[key] as string,
        value_type: valueTypeFor(key),
      }));

      if (rows.length === 0) return;

      const { error } = await supabase
        .from('restaurant_info')
        .upsert(rows, { onConflict: 'key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-settings'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-info'] });
    },
  });
};
