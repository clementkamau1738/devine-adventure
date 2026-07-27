'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFeaturedEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';

export function FeaturedEvents() {
  const { data: events, isLoading } = useFeaturedEvents();
  // Prefer the two seed featured events; fall back to whatever API returns
  const list = (events ?? []).slice(0, 2);

  return (
    <section className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Handpicked
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-ink uppercase tracking-normal">
              Featured Adventures
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-forest hover:text-forest-hover text-sm font-semibold transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 2 }, (_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] animate-pulse overflow-hidden"
              >
                <div className="aspect-[16/11] bg-neutral-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-neutral-100 rounded" />
                  <div className="h-4 w-1/2 bg-neutral-100 rounded" />
                  <div className="h-6 w-1/3 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="text-neutral-500 text-center py-16 font-sans">
            No featured adventures right now — check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {list.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
