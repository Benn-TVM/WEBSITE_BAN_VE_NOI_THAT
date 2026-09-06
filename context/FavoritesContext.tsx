'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FavoriteItem {
  id: string;
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

interface FavoritesContextType {
  favorites: FavoriteItem[];
  totalFavorites: number;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'cad_favorites_v1';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites from storage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to storage:', e);
    }
  }, [favorites, isLoaded]);

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      setFavorites((prev) => prev.filter((f) => f.id !== item.id));
    } else {
      setFavorites((prev) => [...prev, item]);
    }
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        totalFavorites: favorites.length,
        toggleFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
