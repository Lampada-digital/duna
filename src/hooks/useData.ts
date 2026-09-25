import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Property {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'cabin' | 'studio' | 'loft';
  status: 'draft' | 'pending' | 'published' | 'suspended';
  price_per_night: number;
  cleaning_fee: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  cancellation_policy: 'flexible' | 'moderate' | 'strict';
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  location?: {
    city: string;
    state: string;
    neighborhood?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  images?: { id: string; url: string; order_index: number; is_primary: boolean }[];
  amenities?: { id: string; name: string; icon?: string }[];
  host?: { id: string; full_name: string; avatar_url?: string };
}

export interface Reservation {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  nightly_total: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: 'pending' | 'payment_pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded' | 'expired' | 'failed';
  payment_status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  created_at: string;
  property?: Property;
}

export interface Review {
  id: string;
  reservation_id: string;
  property_id: string;
  guest_id: string;
  overall_rating: number;
  cleanliness_rating?: number;
  location_rating?: number;
  checkin_rating?: number;
  communication_rating?: number;
  comfort_rating?: number;
  value_rating?: number;
  comment?: string;
  created_at: string;
  guest?: { full_name: string; avatar_url?: string };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async (filters?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    bedrooms?: number;
    minRating?: number;
    amenities?: string[];
  }) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          location:locations(*),
          images:property_images(*),
          amenities:amenities(*),
          host:profiles!properties_host_id_fkey(id, full_name, avatar_url)
        `)
        .eq('status', 'published')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (filters?.city) {
        query = query.ilike('location.city', `%${filters.city}%`);
      }
      if (filters?.minPrice) {
        query = query.gte('price_per_night', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price_per_night', filters.maxPrice);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters?.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by amenities if provided
      let filtered = data || [];
      if (filters?.amenities && filters.amenities.length > 0) {
        filtered = filtered.filter(p =>
          filters.amenities!.every(a => p.amenities?.some((pa: any) => pa.name === a))
        );
      }

      setProperties(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPropertyById = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          location:locations(*),
          images:property_images(*),
          amenities:amenities(*),
          host:profiles!properties_host_id_fkey(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const createProperty = useCallback(async (propertyData: Partial<Property> & { location?: any }) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      // Create location first
      let locationId: string | null = null;
      if (propertyData.location) {
        const { data: location, error: locError } = await supabase
          .from('locations')
          .insert(propertyData.location)
          .select()
          .single();

        if (locError) throw locError;
        locationId = location.id;
      }

      // Create property
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          location_id: locationId,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateProperty = useCallback(async (id: string, updates: Partial<Property>) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteProperty = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
  };
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestReservations = useCallback(async (guestId: string) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          property:properties(*, location:locations(*), images:property_images(*))
        `)
        .eq('guest_id', guestId)
        .order('check_in', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHostReservations = useCallback(async (hostId: string) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          property:properties(*, location:locations(*), images:property_images(*)),
          guest:profiles!reservations_guest_id_fkey(id, full_name, avatar_url)
        `)
        .eq('host_id', hostId)
        .order('check_in', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (reservationData: {
    property_id: string;
    guest_id: string;
    host_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    nightly_total: number;
    cleaning_fee: number;
    service_fee: number;
    total_price: number;
  }) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      // Check availability first
      const { data: blocked, error: availError } = await supabase
        .from('availability')
        .select('blocked_date')
        .eq('property_id', reservationData.property_id)
        .gte('blocked_date', reservationData.check_in)
        .lt('blocked_date', reservationData.check_out);

      if (availError) throw availError;
      if (blocked && blocked.length > 0) {
        return { success: false, error: 'Datas indisponíveis' };
      }

      // Create reservation
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const cancelReservation = useCallback(async (id: string, reason?: string) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  return {
    reservations,
    loading,
    error,
    fetchGuestReservations,
    fetchHostReservations,
    createReservation,
    cancelReservation,
  };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyReviews = useCallback(async (propertyId: string) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          guest:profiles!reviews_guest_id_fkey(id, full_name, avatar_url)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = useCallback(async (reviewData: Partial<Review> & { reservation_id: string; property_id: string; guest_id: string; host_id: string; overall_rating: number }) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  return { reviews, loading, fetchPropertyReviews, createReview };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (error) throw error;
      setFavorites(data?.map(f => f.property_id) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (userId: string, propertyId: string) => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const isFav = favorites.includes(propertyId);

      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId);

        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== propertyId));
        return { success: true, isFavorite: false };
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, property_id: propertyId });

        if (error) throw error;
        setFavorites(prev => [...prev, propertyId]);
        return { success: true, isFavorite: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [favorites]);

  return { favorites, loading, fetchFavorites, toggleFavorite };
}
