'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFeaturedEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';

export function FeaturedEvents() {
  const { data: events, isLoading } = useFeaturedEvents();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Handpicked
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-2">
            Featured Adventures
          </h2>
        </div>
        <Link
          href="/events"
          className="hidden sm:inline-flex items-center gap-2 text-stone-300 hover:text-amber-400 text-sm font-medium transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-96 bg-stone-900 border border-stone-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <p className="text-stone-500 text-center py-16">
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
        className="sm:hidden mt-8 inline-flex items-center gap-2 text-amber-400 text-sm font-medium"
      >
        View all adventures <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
