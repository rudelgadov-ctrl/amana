import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type EventRequest = Tables<'event_requests'>;
// Client payload: server-owned fields are set by the event_requests_before_insert trigger
export type EventRequestInsert = Omit<
  TablesInsert<'event_requests'>,
  'request_code' | 'status' | 'admin_notes' | 'notified_at' | 'created_at' | 'updated_at'
>;
export type EventRequestUpdate = Pick<Partial<EventRequest>, 'status' | 'admin_notes'>;

// Admin only (RLS blocks anonymous SELECT)
export const useEventRequests = () => {
  return useQuery({
    queryKey: ['event-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as EventRequest[];
    },
  });
};

// Lightweight HEAD count for the sidebar badge
export const useNewEventRequestsCount = (enabled = true) => {
  return useQuery({
    queryKey: ['event-requests', 'new-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('event_requests')
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
export const useCreateEventRequest = () => {
  return useMutation({
    mutationFn: async (request: EventRequestInsert) => {
      const { error } = await supabase
        .from('event_requests')
        .insert(request as TablesInsert<'event_requests'>);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      // Fire-and-forget: must never block or fail the customer-facing success UX
      // if the email pipeline has a problem.
      void supabase.functions
        .invoke('notify-event-request', { body: { email: variables.email } })
        .catch((err) => console.error('[event-requests] notify-event-request failed', err));
    },
  });
};

export type EventRequestEmailPayload = {
  requestId: string;
  templateLabel: string;
  subject: string;
  body: string;
};

// Admin: send a personalized email for a specific request via the send-event-request-email
// Edge Function. Authorization is enforced server-side (the caller's JWT is forwarded,
// and the event_requests RLS policies gate access) — no client-side role check needed.
export const useSendEventRequestEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EventRequestEmailPayload) => {
      const { data, error } = await supabase.functions.invoke('send-event-request-email', {
        body: payload,
      });
      if (error) throw error;
      return data as { ok: true; admin_notes: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-requests'] });
    },
  });
};

export const useUpdateEventRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventRequestUpdate }) => {
      const { data, error } = await supabase
        .from('event_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as EventRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-requests'] });
    },
  });
};

export const useDeleteEventRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('event_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-requests'] });
    },
  });
};
