import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event } from '@/types';

export const eventKeys = {
  all: ['events'] as const,
  list: (filters: object) => [...eventKeys.all, 'list', filters] as const,
  detail: (slug: string) => [...eventKeys.all, 'detail', slug] as const,
  featured: () => [...eventKeys.all, 'featured'] as const,
};

export function useEvents(filters: object = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/events', { params: filters });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedEvents() {
  return useQuery({
    queryKey: eventKeys.featured(),
    queryFn: async () => {
      const { data } = await api.get('/events/featured');
      return data.data as Event[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: eventKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get(`/events/${slug}`);
      return data.data as Event;
    },
    enabled: !!slug,
  });
}
