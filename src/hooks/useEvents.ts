import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  date_text_es: string;
  date_text_en: string;
  title_es: string;
  title_en: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type EventUpdate = Partial<EventInsert>;

export const useEvents = (activeOnly = true) => {
  return useQuery({
    queryKey: ['events', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Event[];
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventUpdate }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
