'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SettingsProvider } from '@/context/SettingsContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import CartDrawer from '@/components/CartDrawer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Trang Admin hoàn toàn độc lập, không có Navbar và Footer của User
  if (isAdmin) {
    return <div className="min-h-screen bg-[#f4f6fa] text-slate-800">{children}</div>;
  }

  // Trang User tươi sáng theo phong cách KhoBanVe & FileThietKe
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="min-h-screen flex flex-col bg-[#f4f6fa] text-slate-800">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}