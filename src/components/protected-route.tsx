'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from './ui/spinner';

import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'tenant' | 'landlord' | 'admin' | 'support';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
        <span className="ml-2">Redirecting to signin...</span>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
        <span className="ml-2">Access Denied. Redirecting...</span>
      </div>
    );
  }

  return <>{children}</>;
}