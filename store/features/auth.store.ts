import { create } from 'zustand';
import type { User } from '@/types/domain/user';
import { supabase } from '@/services/api/client';

interface AuthState {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: user !== null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initialize: async () => {
    set({ isLoading: true });

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email ?? '',
        createdAt: session.user.created_at,
      };
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          createdAt: session.user.created_at,
        };
        get().setUser(user);
      } else {
        get().setUser(null);
      }
      get().setLoading(false);
    });
  },
}));
