'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFeaturedEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/Motion';

export function FeaturedEvents() {
  const { data: events, isLoading } = useFeaturedEvents();
  // Prefer the two seed featured events; fall back to whatever API returns
  const list = (events ?? []).slice(0, 2);

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <FadeUp
          inView
          className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-forest sm:text-sm">
              Handpicked
            </span>
            <h2 className="font-display text-4xl font-normal uppercase tracking-normal text-ink md:text-5xl">
              Featured Adventures
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-hover"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeUp>

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
          <Stagger
            className="grid gap-6 sm:grid-cols-2 md:gap-8"
            inView
          >
            {list.map((event) => (
              <StaggerItem key={event.id}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
