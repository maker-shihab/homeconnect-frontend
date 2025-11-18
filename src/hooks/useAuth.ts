// hooks/useAuth.ts
'use client';

import { AuthResponse, authApi } from '@/lib/api/auth-api';
import { setCredentials } from '@/redux/features/auth/authApiSlice'; // <-- আপনার অ্যাকশন ইম্পোর্ট করুন
import { AppDispatch } from '@/redux/store'; // <-- (Optional) টাইপ সেফটির জন্য
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'; // <-- Redux হুক ইম্পোর্ট করুন

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>(); // <-- dispatch ফাংশন নিন

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      // ❌ localStorage.setItem('token', data.token);
      // ❌ localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redux স্টেটে ডেটা সেভ করুন
      dispatch(setCredentials({ user: data.user, token: data.token }));

      // Invalidate query (এটি ঠিক আছে)
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Redirect (এটিও ঠিক আছে)
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
      // ❌ localStorage.setItem('token', data.token);
      // ❌ localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redux স্টেটে ডেটা সেভ করুন
      dispatch(setCredentials({ user: data.user, token: data.token }));

      // Invalidate query
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Redirect
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