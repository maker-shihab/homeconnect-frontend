'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authApi, LoginData, RegisterData } from './api/auth-api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'landlord' | 'admin' | 'support';
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // You can add a verify token endpoint later
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);

      // Store tokens and user data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as "tenant" | "landlord" | "admin" | "support",
        avatar: response.user.avatar,
        phone: response.user.phone,
      });

      toast.success('Login successful!', {
        description: `Welcome back, ${response.user.name}!`,
      });

      // Redirect based on role
      if (response.user.role === 'landlord') {
        router.push('/dashboard');
      } else {
        router.push('/properties');
      }

    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(data);

      // Store tokens and user data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as "tenant" | "landlord" | "admin" | "support",
        avatar: response.user.avatar,
        phone: response.user.phone,
      });

      toast.success('Registration successful!', {
        description: 'Please check your email for verification.',
      });

      // Redirect to verification page
      router.push('/verify-email?sent=true');

    } catch (error) {
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Get token before clearing localStorage
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Call backend logout API
          await authApi.logout();
          console.log('✅ Backend logout successful');
        } catch (error) {
          console.warn('⚠️ Backend logout failed, but clearing frontend session:', error);
        }
      }

      // Clear frontend storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      setUser(null);

      toast.success('Logged out successfully');
      router.push('/signin');

    } catch (error) {
      console.error('💥 Logout error:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);

      toast.success('Logged out successfully');
      router.push('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}