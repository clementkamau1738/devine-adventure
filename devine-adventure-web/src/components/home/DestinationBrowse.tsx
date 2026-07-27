'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { cn, destinationLabel } from '@/lib/utils';

export { destinationLabel };

type Destination = {
  key: string;
  name: string;
  locationQuery: string;
  image: string;
  count: number;
};

function groupDestinations(events: Event[]): Destination[] {
  const map = new Map<string, Destination>();

  for (const event of events) {
    const name = destinationLabel(event.location);
    const key = name.toLowerCase();
    const existing = map.get(key);
    const image =
      event.images?.[0] ??
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200';

    if (existing) {
      existing.count += 1;
      if (!existing.image && image) existing.image = image;
    } else {
      map.set(key, {
        key,
        name,
        locationQuery: name,
        image,
        count: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

/**
 * Destination-first browse (branding §11.1) — cinematic photo grid
 * built from live event location + image data, not icon tiles.
 */
export function DestinationBrowse() {
  const { data, isLoading } = useEvents({ limit: 48, page: 1 });
  const events = (data?.events ?? []) as Event[];
  const destinations = useMemo(() => groupDestinations(events), [events]);

  if (!isLoading && destinations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-10">
        <span className="text-forest text-sm font-semibold tracking-widest uppercase">
          Destinations
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-normal text-ink mt-2 uppercase tracking-normal">
          Where would you like to go?
        </h2>
        <p className="text-neutral-500 mt-3 max-w-xl">
          Browse by place — from city forests to summit ridges — using the
          routes we already run.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[180px]">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'rounded-2xl bg-white border border-neutral-200 animate-pulse',
                i === 0 && 'md:col-span-2 md:row-span-2',
                i === 1 && 'md:col-span-2',
              )}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[200px]">
          {destinations.map((dest, i) => {
            const featured = i === 0;
            const wide = i === 1;
            return (
              <Link
                key={dest.key}
                href={`/events?search=${encodeURIComponent(dest.locationQuery)}`}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-neutral-200',
                  'hover:border-forest/40 transition-all duration-300 ease-out',
                  featured && 'col-span-2 row-span-2 min-h-[280px] md:min-h-0',
                  wide && 'md:col-span-2',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${dest.image}${dest.image.includes('?') ? '&' : '?'}w=1200`}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3
                    className={cn(
                      'font-display font-normal uppercase tracking-normal text-white',
                      featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl',
                    )}
                  >
                    {dest.name}
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm mt-1 font-sans">
                    {dest.count} adventure{dest.count === 1 ? '' : 's'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
