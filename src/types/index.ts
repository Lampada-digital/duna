export interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  cleaningFee: number;
  type: 'apartment' | 'house' | 'cabin' | 'studio' | 'loft';
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  photos: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  realEstateId: string;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  blockedDates: string[];
  createdAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  nightlyTotal: number;
  cleaningFee: number;
  serviceFee: number;
  realEstateFee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  affiliateId?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'realEstate' | 'admin' | 'affiliate';
  avatar?: string;
}

export interface RealEstate {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  monthlyFee: number;
  affiliateId?: string;
  affiliateSince?: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  programA: boolean;
  programB: boolean;
  commissionA: number;
  commissionB: number;
  createdAt: string;
}

export interface AffiliateClick {
  id: string;
  affiliateId: string;
  timestamp: string;
  source: 'A' | 'B';
}

export interface AffiliateConversion {
  id: string;
  affiliateId: string;
  type: 'realEstate_signup' | 'booking';
  referenceId: string;
  amount: number;
  status: 'pending' | 'released' | 'paid';
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'requested' | 'processing' | 'paid' | 'rejected';
  createdAt: string;
}

export interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceMin: number;
  priceMax: number;
  propertyType: string;
  bedrooms: number;
  amenities: string[];
  minRating: number;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating';
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: 'guest' | 'host';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface HostReview {
  id: string;
  bookingId: string;
  guestId: string;
  hostId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  propertyIds: string[];
  createdAt: string;
}

export interface LoyaltyProgram {
  userId: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  totalBookings: number;
  totalSpent: number;
  joinedAt: string;
}
