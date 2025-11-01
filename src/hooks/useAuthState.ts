'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setToken(token);
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/signin';
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    logout,
  };
};