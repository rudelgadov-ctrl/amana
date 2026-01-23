import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = 'admin' | 'editor' | null;

interface AdminAuthState {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  canManageContent: boolean;
}

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    session: null,
    role: null,
    isLoading: true,
    isAdmin: false,
    isEditor: false,
    canManageContent: false,
  });

  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data.role as UserRole;
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          // Defer role fetch to avoid blocking
          setTimeout(async () => {
            const role = await fetchUserRole(user.id);
            setState({
              user,
              session,
              role,
              isLoading: false,
              isAdmin: role === 'admin',
              isEditor: role === 'editor',
              canManageContent: role === 'admin' || role === 'editor',
            });
          }, 0);
        } else {
          setState({
            user: null,
            session: null,
            role: null,
            isLoading: false,
            isAdmin: false,
            isEditor: false,
            canManageContent: false,
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      if (user) {
        const role = await fetchUserRole(user.id);
        setState({
          user,
          session,
          role,
          isLoading: false,
          isAdmin: role === 'admin',
          isEditor: role === 'editor',
          canManageContent: role === 'admin' || role === 'editor',
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  };
};
