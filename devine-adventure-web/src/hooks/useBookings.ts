import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Booking } from '@/types';

export function useUserBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/bookings');
      return data.data as Booking[];
    },
  });
}

export function useInitiateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { eventId: string; notes?: string }) => {
      const { data } = await api.post('/bookings', input);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await api.delete(`/bookings/${bookingId}`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useBookingByRef(referenceCode: string) {
  return useQuery({
    queryKey: ['bookings', 'ref', referenceCode],
    queryFn: async () => {
      const { data } = await api.get(`/bookings/${referenceCode}`);
      return data.data as Booking;
    },
    enabled: !!referenceCode,
    retry: false,
  });
}
