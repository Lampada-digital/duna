import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth, Profile } from '../hooks/useAuth';
import { SearchFilters } from '../types';

interface AppState {
  isConfigured: boolean;
  darkMode: boolean;
  searchFilters: SearchFilters;
}

interface AppContextType extends AppState {
  // Auth (delegado ao hook useAuth)
  auth: ReturnType<typeof useAuth>;
  toggleDarkMode: () => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
}

const defaultFilters: SearchFilters = {
  destination: '', checkIn: '', checkOut: '', guests: 1,
  priceMin: 0, priceMax: 2000, propertyType: '', bedrooms: 0,
  amenities: [], minRating: 0, sortBy: 'relevance'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('duna_darkMode') === 'true';
    } catch { return false; }
  });
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>(() => {
    try {
      const stored = localStorage.getItem('duna_searchFilters');
      return stored ? JSON.parse(stored) : defaultFilters;
    } catch { return defaultFilters; }
  });

  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
    try { localStorage.setItem('duna_darkMode', String(darkMode)); } catch {}
  }, [darkMode]);

  useEffect(() => {
    try { localStorage.setItem('duna_searchFilters', JSON.stringify(searchFilters)); } catch {}
  }, [searchFilters]);

  const toggleDarkMode = () => setDarkMode(d => !d);
  const setSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFiltersState(prev => ({ ...prev, ...filters }));
  };

  return (
    <AppContext.Provider value={{
      isConfigured,
      darkMode,
      searchFilters,
      auth,
      toggleDarkMode,
      setSearchFilters,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Hook de conveniência para acessar o perfil do usuário atual
export function useCurrentUser(): Profile | null {
  const { auth } = useApp();
  return auth.profile;
}

// Hook para verificar se o Supabase está configurado
export function useIsConfigured() {
  const { isConfigured } = useApp();
  return isConfigured;
}
