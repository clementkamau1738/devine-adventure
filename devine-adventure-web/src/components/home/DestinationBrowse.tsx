'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { buildDestinationTiles } from '@/lib/destinations';
import { cn } from '@/lib/utils';

/**
 * Destination-first browse (branding §11.1) — 3×2 full-bleed photo tiles
 * between Featured Adventures and How It Works.
 */
export function DestinationBrowse() {
  const { data, isLoading } = useEvents({ limit: 48, page: 1 });
  const events = (data?.events ?? []) as Event[];
  const destinations = useMemo(
    () => buildDestinationTiles(events),
    [events],
  );

  if (!isLoading && destinations.length === 0) return null;

  return (
    <section className="bg-neutral-50" aria-labelledby="where-to-next-heading">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
        <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
          Where to next
        </span>
        <h2
          id="where-to-next-heading"
          className="font-display text-4xl md:text-5xl font-normal text-ink uppercase tracking-normal mb-8 md:mb-10"
        >
          Destinations
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {destinations.map((dest) => (
              <Link
                key={dest.key}
                href={`/events?search=${encodeURIComponent(dest.locationQuery)}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    dest.image.includes('?')
                      ? `${dest.image}&w=900`
                      : `${dest.image}?w=900`
                  }
                  alt={dest.name}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover',
                    'transition-transform duration-500 ease-out',
                    'group-hover:scale-[1.04]',
                  )}
                />
                {/* Dark scrim — bottom third only for legibility */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/85 to-transparent pointer-events-none"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex items-end justify-between gap-2">
                  <span className="font-display text-base md:text-xl font-normal uppercase tracking-normal text-white leading-tight">
                    {dest.name}
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 md:w-5 md:h-5 text-white shrink-0 mb-0.5"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
