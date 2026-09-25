import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Property, Booking, Review, User, RealEstate, Affiliate, AffiliateClick, AffiliateConversion, WithdrawalRequest, SearchFilters } from '../types';
import { seedProperties, seedRealEstates, seedReviews, seedUsers } from '../data/seed';

interface AppState {
  properties: Property[];
  bookings: Booking[];
  reviews: Review[];
  users: User[];
  realEstates: RealEstate[];
  affiliates: Affiliate[];
  affiliateClicks: AffiliateClick[];
  affiliateConversions: AffiliateConversion[];
  withdrawals: WithdrawalRequest[];
  currentUser: User | null;
  darkMode: boolean;
  searchFilters: SearchFilters;
}

interface AppContextType extends AppState {
  login: (email: string, role: User['role']) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  blockDates: (propertyId: string, dates: string[]) => void;
  registerAffiliate: (affiliate: Omit<Affiliate, 'id' | 'referralCode' | 'createdAt' | 'commissionA' | 'commissionB'>) => Affiliate;
  recordAffiliateClick: (affiliateId: string, source: 'A' | 'B') => void;
  recordConversion: (conversion: Omit<AffiliateConversion, 'id' | 'createdAt'>) => void;
  requestWithdrawal: (affiliateId: string, amount: number) => void;
  updateWithdrawalStatus: (id: string, status: WithdrawalRequest['status']) => void;
  getAffiliateByCode: (code: string) => Affiliate | undefined;
  getAffiliateStats: (affiliateId: string) => { clicks: number; conversions: number; pending: number; released: number; paid: number };
}

const defaultFilters: SearchFilters = {
  destination: '', checkIn: '', checkOut: '', guests: 1,
  priceMin: 0, priceMax: 2000, propertyType: '', bedrooms: 0,
  amenities: [], minRating: 0, sortBy: 'relevance'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadState<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`duna_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function saveState(key: string, value: unknown) {
  localStorage.setItem(`duna_${key}`, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => loadState('properties', seedProperties));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('bookings', []));
  const [reviews, setReviews] = useState<Review[]>(() => loadState('reviews', seedReviews));
  const [users] = useState<User[]>(() => loadState('users', seedUsers));
  const [realEstates, setRealEstates] = useState<RealEstate[]>(() => loadState('realEstates', seedRealEstates));
  const [affiliates, setAffiliates] = useState<Affiliate[]>(() => loadState('affiliates', []));
  const [affiliateClicks, setAffiliateClicks] = useState<AffiliateClick[]>(() => loadState('affiliateClicks', []));
  const [affiliateConversions, setAffiliateConversions] = useState<AffiliateConversion[]>(() => loadState('affiliateConversions', []));
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => loadState('withdrawals', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', null));
  const [darkMode, setDarkMode] = useState(() => loadState('darkMode', false));
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>(() => loadState('searchFilters', defaultFilters));

  useEffect(() => { saveState('properties', properties); }, [properties]);
  useEffect(() => { saveState('bookings', bookings); }, [bookings]);
  useEffect(() => { saveState('reviews', reviews); }, [reviews]);
  useEffect(() => { saveState('affiliates', affiliates); }, [affiliates]);
  useEffect(() => { saveState('affiliateClicks', affiliateClicks); }, [affiliateClicks]);
  useEffect(() => { saveState('affiliateConversions', affiliateConversions); }, [affiliateConversions]);
  useEffect(() => { saveState('withdrawals', withdrawals); }, [withdrawals]);
  useEffect(() => { saveState('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { saveState('darkMode', darkMode); }, [darkMode]);
  useEffect(() => { saveState('searchFilters', searchFilters); }, [searchFilters]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  const login = useCallback((email: string, role: User['role']) => {
    const user = users.find(u => u.email === email) || { id: `user-${Date.now()}`, name: email.split('@')[0], email, role };
    setCurrentUser(user);
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);
  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);
  const setSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setSearchFiltersState(prev => ({ ...prev, ...filters }));
  }, []);

  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const booking: Booking = { ...bookingData, id: `b-${Date.now()}`, createdAt: new Date().toISOString() };
    setBookings(prev => [...prev, booking]);
    // Block dates
    setProperties(prev => prev.map(p => {
      if (p.id === bookingData.propertyId) {
        const newDates: string[] = [];
        const start = new Date(bookingData.checkIn);
        const end = new Date(bookingData.checkOut);
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          newDates.push(d.toISOString().split('T')[0]);
        }
        return { ...p, blockedDates: [...p.blockedDates, ...newDates] };
      }
      return p;
    }));
    return booking;
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
  }, []);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const review: Review = { ...reviewData, id: `rev-${Date.now()}`, createdAt: new Date().toISOString() };
    setReviews(prev => {
      const updatedReviews = [...prev, review];
      const propReviews = updatedReviews.filter(r => r.propertyId === reviewData.propertyId);
      const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
      setProperties(props => props.map(p => {
        if (p.id === reviewData.propertyId) {
          return { ...p, rating: Math.round(avg * 10) / 10, reviewCount: propReviews.length };
        }
        return p;
      }));
      return updatedReviews;
    });
  }, []);

  const addProperty = useCallback((propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    const property: Property = { ...propertyData, id: `prop-${Date.now()}`, createdAt: new Date().toISOString() };
    setProperties(prev => [...prev, property]);
  }, []);

  const updateProperty = useCallback((id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const blockDates = useCallback((propertyId: string, dates: string[]) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, blockedDates: [...new Set([...p.blockedDates, ...dates])] } : p));
  }, []);

  const registerAffiliate = useCallback((data: Omit<Affiliate, 'id' | 'referralCode' | 'createdAt' | 'commissionA' | 'commissionB'>) => {
    const affiliate: Affiliate = {
      ...data, id: `aff-${Date.now()}`,
      referralCode: data.name.toLowerCase().replace(/\s/g, '') + Math.random().toString(36).slice(2, 6),
      commissionA: 20, commissionB: 15, createdAt: new Date().toISOString()
    };
    setAffiliates(prev => [...prev, affiliate]);
    return affiliate;
  }, []);

  const recordAffiliateClick = useCallback((affiliateId: string, source: 'A' | 'B') => {
    const click: AffiliateClick = { id: `click-${Date.now()}`, affiliateId, timestamp: new Date().toISOString(), source };
    setAffiliateClicks(prev => [...prev, click]);
  }, []);

  const recordConversion = useCallback((data: Omit<AffiliateConversion, 'id' | 'createdAt'>) => {
    const conversion: AffiliateConversion = { ...data, id: `conv-${Date.now()}`, createdAt: new Date().toISOString() };
    setAffiliateConversions(prev => [...prev, conversion]);
  }, []);

  const requestWithdrawal = useCallback((affiliateId: string, amount: number) => {
    const withdrawal: WithdrawalRequest = { id: `w-${Date.now()}`, affiliateId, amount, status: 'requested', createdAt: new Date().toISOString() };
    setWithdrawals(prev => [...prev, withdrawal]);
  }, []);

  const updateWithdrawalStatus = useCallback((id: string, status: WithdrawalRequest['status']) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  }, []);

  const getAffiliateByCode = useCallback((code: string) => {
    return affiliates.find(a => a.referralCode === code);
  }, [affiliates]);

  const getAffiliateStats = useCallback((affiliateId: string) => {
    const clicks = affiliateClicks.filter(c => c.affiliateId === affiliateId).length;
    const conversions = affiliateConversions.filter(c => c.affiliateId === affiliateId);
    const pending = conversions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
    const released = conversions.filter(c => c.status === 'released').reduce((s, c) => s + c.amount, 0);
    const paid = conversions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
    return { clicks, conversions: conversions.length, pending, released, paid };
  }, [affiliateClicks, affiliateConversions]);

  return (
    <AppContext.Provider value={{
      properties, bookings, reviews, users, realEstates, affiliates, affiliateClicks, affiliateConversions, withdrawals,
      currentUser, darkMode, searchFilters,
      login, logout, toggleDarkMode, setSearchFilters, createBooking, cancelBooking, addReview,
      addProperty, updateProperty, blockDates, registerAffiliate, recordAffiliateClick, recordConversion,
      requestWithdrawal, updateWithdrawalStatus, getAffiliateByCode, getAffiliateStats
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
