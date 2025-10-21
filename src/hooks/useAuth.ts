// hooks/useAuth.ts
'use client';

import { AuthResponse, authApi } from '@/lib/api/auth-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalidate any user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Redirect based on role
      if (data.user.role === 'landlord') {
        router.push('/dashboard');
      } else {
        router.push('/properties');
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalidate any user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Redirect based on role
      if (data.user.role === 'landlord') {
        router.push('/dashboard');
      } else {
        router.push('/properties');
      }
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
};