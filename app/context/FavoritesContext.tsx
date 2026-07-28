'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productName: string) => void;
  isFavorite: (productName: string) => boolean;
  addFavorite: (productName: string) => void;
  removeFavorite: (productName: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
    setMounted(true);
  }, []);

  const persistFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  };

  const toggleFavorite = (productName: string) => {
    const newFavorites = favorites.includes(productName)
      ? favorites.filter((name) => name !== productName)
      : [...favorites, productName];
    persistFavorites(newFavorites);
  };

  const isFavorite = (productName: string) => favorites.includes(productName);

  const addFavorite = (productName: string) => {
    if (!isFavorite(productName)) {
      persistFavorites([...favorites, productName]);
    }
  };

  const removeFavorite = (productName: string) => {
    if (isFavorite(productName)) {
      persistFavorites(favorites.filter((name) => name !== productName));
    }
  };

  const clearFavorites = () => {
    persistFavorites([]);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, addFavorite, removeFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
