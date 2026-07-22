import { create } from 'zustand';
import { Event, Booking, PricingResult } from '@/types';

interface BookingState {
  selectedEvent: Event | null;
  currentBooking: Booking | null;
  pricing: PricingResult | null;
  paymentMethod: 'mpesa' | 'card' | null;
  setSelectedEvent: (event: Event) => void;
  setBooking: (booking: Booking) => void;
  setPricing: (pricing: PricingResult) => void;
  setPaymentMethod: (method: 'mpesa' | 'card') => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedEvent: null,
  currentBooking: null,
  pricing: null,
  paymentMethod: null,
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setBooking: (booking) => set({ currentBooking: booking }),
  setPricing: (pricing) => set({ pricing }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () =>
    set({
      selectedEvent: null,
      currentBooking: null,
      pricing: null,
      paymentMethod: null,
    }),
}));
