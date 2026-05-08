export type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF' | 'GUIDE';
export type TourStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';
export type TourCategory = 'RESORT' | 'ADVENTURE' | 'TREKKING' | 'MICE' | 'CULTURAL' | 'CRUISE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string;
}

export interface TourImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

export interface Itinerary {
  id: string;
  day: number;
  title: string;
  description: string;
  meals: string;
  accommodation?: string;
}

export interface Departure {
  id: string;
  departureDate: string;
  returnDate: string;
  availableSlots: number;
  priceOverride?: number;
  isActive: boolean;
  _count?: { bookings: number };
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  highlights: string;
  includes: string;
  excludes: string;
  cancelPolicy: string;
  basePrice: number;
  childPrice: number;
  duration: number;
  maxCapacity: number;
  category: TourCategory;
  status: TourStatus;
  featured: boolean;
  images: TourImage[];
  itineraries?: Itinerary[];
  departures?: Departure[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
