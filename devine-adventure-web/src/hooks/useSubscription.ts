import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PricingResult, Subscription } from '@/types';

export function useMySubscription() {
  return useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/me');
      return data.data as Subscription | null;
    },
  });
}

export function useEventPricing(eventId: string) {
  return useQuery({
    queryKey: ['pricing', eventId],
    queryFn: async () => {
      const { data } = await api.get(`/subscriptions/pricing/${eventId}`);
      return data.data as PricingResult;
    },
    enabled: !!eventId,
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planType: string) => {
      const { data } = await api.post('/subscriptions', { planType });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data } = await api.delete(`/subscriptions/${subscriptionId}`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
