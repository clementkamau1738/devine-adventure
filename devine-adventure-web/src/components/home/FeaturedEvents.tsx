'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFeaturedEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';

export function FeaturedEvents() {
  const { data: events, isLoading } = useFeaturedEvents();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <h2 className="font-display text-4xl md:text-5xl font-normal text-ink uppercase tracking-normal">
          Featured Adventures
        </h2>
        <Link
          href="/events"
          className="hidden sm:inline-flex items-center gap-1.5 text-forest hover:text-forest-hover text-sm font-semibold transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white p-3 shadow-[0_8px_30px_rgba(17,15,13,0.06)] animate-pulse"
            >
              <div className="aspect-[4/3] rounded-2xl bg-neutral-100" />
              <div className="px-1.5 pt-4 space-y-2">
                <div className="h-4 w-3/4 bg-neutral-100 rounded" />
                <div className="h-3 w-1/2 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <p className="text-neutral-500 text-center py-16">
          No featured adventures right now — check back soon.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <Link
        href="/events"
        className="sm:hidden mt-8 inline-flex items-center gap-2 text-forest text-sm font-medium"
      >
        View all adventures <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
