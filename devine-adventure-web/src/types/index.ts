export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'GUEST' | 'MEMBER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  difficulty: 'BEGINNER' | 'MODERATE' | 'ADVANCED';
  dateTime: string;
  endDateTime?: string;
  price: number;
  memberPrice?: number;
  isFree: boolean;
  capacity: number;
  enrolled: number;
  category: 'HIKE' | 'BIKE' | 'PRIVATE' | 'TRAINING';
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
}

export interface Booking {
  id: string;
  referenceCode: string;
  userId: string;
  eventId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  discountApplied: number;
  notes?: string;
  event?: Event;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  amount: number;
}

export interface PricingResult {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  isFreeForMember: boolean;
  reason: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
