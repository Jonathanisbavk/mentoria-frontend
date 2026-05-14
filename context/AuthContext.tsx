'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginByRole: (role: 'aprendiz' | 'mentor' | 'admin') => Promise<void>;
  loginWithGoogle: (googleData: { googleId: string; email: string; name: string; picture?: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: 'aprendiz' | 'mentor'; cycle: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('certus_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('certus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || json.status !== 'ok') {
        setError(json.error || 'Error al iniciar sesión');
        throw new Error(json.error || 'Error de autenticación');
      }

      setUser(json.data);
      localStorage.setItem('certus_user', JSON.stringify(json.data));
      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loginByRole = useCallback(async (role: 'aprendiz' | 'mentor' | 'admin') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const json = await res.json();

      if (!res.ok || json.status !== 'ok') {
        setError(json.error || 'Error al iniciar sesión');
        throw new Error(json.error || 'Error de autenticación');
      }

      setUser(json.data);
      localStorage.setItem('certus_user', JSON.stringify(json.data));
      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loginWithGoogle = useCallback(async (googleData: { googleId: string; email: string; name: string; picture?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
      });

      const json = await res.json();

      if (!res.ok || json.status !== 'ok') {
        setError(json.error || 'Error con Google');
        throw new Error(json.error || 'Error de autenticación Google');
      }

      setUser(json.data);
      localStorage.setItem('certus_user', JSON.stringify(json.data));
      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: { name: string; email: string; password: string; role: 'aprendiz' | 'mentor'; cycle: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || json.status !== 'ok') {
        setError(json.error || 'Error al registrarse');
        throw new Error(json.error || 'Error de registro');
      }

      setUser(json.data);
      localStorage.setItem('certus_user', JSON.stringify(json.data));
      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('certus_user');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        loginByRole,
        loginWithGoogle,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
