'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // Product ID
  title: string;
  slug: string;
  sku?: string | null;
  price: number;
  originalPrice?: number | null;
  image: string;
  formats?: string;
  fileSize?: string;
  categoryName?: string;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalAmount: number;
  totalXu: number;
  addToCart: (item: CartItem) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isItemInCart: (productId: string) => boolean;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cad_shopping_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (hydration safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [items, isLoaded]);

  // Auto clear toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const isItemInCart = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const addToCart = (newItem: CartItem) => {
    if (isItemInCart(newItem.id)) {
      setToastMessage('Bản vẽ này đã có trong giỏ hàng của bạn!');
      setIsCartOpen(true);
      return { success: false, message: 'Bản vẽ đã có trong giỏ hàng!' };
    }

    setItems((prev) => [...prev, newItem]);
    setToastMessage('Đã thêm bản vẽ vào giỏ hàng!');
    setIsCartOpen(true);
    return { success: true, message: 'Đã thêm vào giỏ hàng thành công!' };
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    setToastMessage('Đã xóa bản vẽ khỏi giỏ hàng.');
  };

  const clearCart = () => {
    setItems([]);
    setToastMessage('Đã làm trống giỏ hàng.');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalCount = items.length;
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const totalXu = Math.max(0, Math.round(totalAmount / 1000));

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalAmount,
        totalXu,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        isItemInCart,
        toastMessage,
      }}
    >
      {children}

      {/* Global Toast Notification - Placed at Top Center so it never overlaps the cart drawer */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] animate-fade-in pointer-events-none">
          <div className="bg-slate-900 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center space-x-2.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-white font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
