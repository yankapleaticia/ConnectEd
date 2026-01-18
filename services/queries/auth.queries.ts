import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/features/auth/auth.service';
import type { SignupParams, LoginParams } from '@/services/features/auth/auth.types';
import { useAuthStore } from '@/store/features/auth.store';

export const authQueries = {
  useSignup: () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
      mutationFn: (params: SignupParams) => authService.signup(params),
      onSuccess: (response) => {
        if (response.success && response.status === 'authenticated') {
          setUser(response.user);
          queryClient.invalidateQueries({ queryKey: ['auth'] });
        }
      },
    });
  },

  useLogin: () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
      mutationFn: (params: LoginParams) => authService.login(params),
      onSuccess: (response) => {
        if (response.success && response.status === 'authenticated') {
          setUser(response.user);
          queryClient.invalidateQueries({ queryKey: ['auth'] });
        }
      },
    });
  },

  useLogout: () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
      mutationFn: () => authService.logout(),
      onSuccess: () => {
        setUser(null);
        queryClient.clear();
      },
    });
  },
};
