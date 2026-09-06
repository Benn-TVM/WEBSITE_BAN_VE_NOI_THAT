'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  memberCode?: string;
  xu?: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  openLoginModal: (reason?: string) => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  authReason: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authReason, setAuthReason] = useState<string | null>(null);

  const fetchUser = () => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const openLoginModal = (reason?: string) => {
    setAuthReason(reason || null);
    setAuthTab('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthReason(null);
    setAuthTab('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthReason(null);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cad_shopping_cart_v1');
      localStorage.removeItem('cad_favorites_v1');
    }
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        logout,
        setUser,
        authReason,
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab={authTab}
        reason={authReason}
        onClose={closeAuthModal}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          closeAuthModal();
          if (loggedUser?.email === 'admin@gmail.com' || loggedUser?.isAdmin) {
            window.location.href = '/admin';
          }
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
