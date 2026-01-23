import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = 'admin' | 'editor' | null;

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  canManageContent: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAdminAuth();

  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuthContext must be used within an AdminAuthProvider');
  }
  return context;
};
