import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type GiftOrder = Tables<'gift_orders'>;
// Client payload: server-owned fields are set by the gift_orders_before_insert trigger
export type GiftOrderInsert = Omit<
  TablesInsert<'gift_orders'>,
  'order_code' | 'status' | 'admin_notes' | 'notified_at' | 'currency' | 'created_at' | 'updated_at'
>;
export type GiftOrderUpdate = Pick<Partial<GiftOrder>, 'status' | 'admin_notes'>;

// Admin only (RLS blocks anonymous SELECT)
export const useGiftOrders = () => {
  return useQuery({
    queryKey: ['gift-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gift_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as GiftOrder[];
    },
  });
};

// Lightweight HEAD count for the sidebar badge
export const useNewGiftOrdersCount = (enabled = true) => {
  return useQuery({
    queryKey: ['gift-orders', 'new-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('gift_orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new');

      if (error) throw error;
      return count ?? 0;
    },
    enabled,
    refetchInterval: 60 * 1000,
  });
};

// Public: anonymous insert. No .select() — anon has no SELECT policy.
export const useCreateGiftOrder = () => {
  return useMutation({
    mutationFn: async (order: GiftOrderInsert) => {
      const { error } = await supabase
        .from('gift_orders')
        .insert(order as TablesInsert<'gift_orders'>);

      if (error) throw error;
    },
  });
};

export const useUpdateGiftOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GiftOrderUpdate }) => {
      const { data, error } = await supabase
        .from('gift_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as GiftOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-orders'] });
    },
  });
};

export const useDeleteGiftOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gift_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-orders'] });
    },
  });
};
