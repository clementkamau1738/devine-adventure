import { Compass } from 'lucide-react';
import { Event } from '@/types';
import { EventCard } from './EventCard';

interface Props {
  events: Event[];
  isLoading?: boolean;
}

export function EventGrid({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200 rounded-2xl overflow-hidden animate-pulse"
          >
            <div className="h-52 bg-neutral-100" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-16 bg-neutral-100 rounded" />
              <div className="h-5 w-3/4 bg-neutral-100 rounded" />
              <div className="h-4 w-1/2 bg-neutral-100 rounded" />
              <div className="h-4 w-2/3 bg-neutral-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-neutral-200 rounded-2xl">
        <Compass className="w-10 h-10 text-neutral-600 mb-4" />
        <div className="text-ink font-semibold mb-1">
          No adventures found
        </div>
        <p className="text-neutral-500 text-sm max-w-xs">
          Try adjusting your filters or check back soon for new experiences.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
