'use client';

import { Compass } from 'lucide-react';
import { Event } from '@/types';
import { EventCard } from './EventCard';
import { Stagger, StaggerItem } from '@/components/motion/Motion';
import { staggerFast } from '@/lib/motion';

interface Props {
  events: Event[];
  isLoading?: boolean;
}

export function EventGrid({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)]"
          >
            <div className="aspect-[16/11] bg-neutral-100" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-neutral-100" />
              <div className="h-4 w-1/2 rounded bg-neutral-100" />
              <div className="h-6 w-1/3 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-24 text-center">
        <Compass className="mb-4 h-10 w-10 text-neutral-600" />
        <div className="mb-1 font-semibold text-ink">No adventures found</div>
        <p className="max-w-xs text-sm text-neutral-500">
          Try adjusting your filters or check back soon for new experiences.
        </p>
      </div>
    );
  }

  return (
    <Stagger
      className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
      variants={staggerFast}
      inView={false}
    >
      {events.map((event) => (
        <StaggerItem key={event.id}>
          <EventCard event={event} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
