'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Mountain, Search, Users } from 'lucide-react';
import { useEvents, useFeaturedEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { cn, destinationLabel } from '@/lib/utils';

const STATS = [
  { icon: Mountain, value: '50+', label: 'Adventures' },
  { icon: Users, value: '2,400+', label: 'Members' },
  { icon: Calendar, value: '120+', label: 'Events Hosted' },
] as const;

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function HeroSection() {
  const router = useRouter();
  const { data: listData } = useEvents({ limit: 48, page: 1 });
  const { data: featured } = useFeaturedEvents();
  const events = (listData?.events ?? []) as Event[];

  const destinations = useMemo(
    () =>
      uniqueSorted(events.map((e) => destinationLabel(e.location))),
    [events],
  );

  const difficulties = useMemo(
    () => uniqueSorted(events.map((e) => e.difficulty)),
    [events],
  );

  const dates = useMemo(() => {
    const opts = events.map((e) => {
      const d = new Date(e.dateTime);
      if (Number.isNaN(d.getTime())) return '';
      // Month + year as selectable bucket from real event data
      return d.toLocaleDateString('en-KE', {
        month: 'long',
        year: 'numeric',
      });
    });
    return uniqueSorted(opts);
  }, [events]);

  // Prefer hike/terrain photography from live event data when available
  const heroImage =
    featured?.find((e) => e.category === 'HIKE')?.images?.[0] ??
    events.find((e) => e.category === 'HIKE')?.images?.[0] ??
    featured?.[0]?.images?.[0] ??
    events[0]?.images?.[0] ??
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200';

  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('search', destination);
    if (difficulty) params.set('difficulty', difficulty);
    // Date is month label — pass as search refinement when no destination
    if (date && !destination) params.set('search', date.split(' ')[0] ?? date);
    const q = params.toString();
    router.push(q ? `/events?${q}` : '/events');
  };

  const fieldClass =
    'w-full bg-transparent text-sm text-ink placeholder:text-neutral-400 focus:outline-none font-sans min-w-0';

  return (
    <section className="flex min-h-dvh flex-col justify-center bg-neutral-50 text-ink pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: copy + search + stats ── */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-5">
              Kenya&apos;s Adventure Collective
            </span>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-normal uppercase tracking-normal leading-[0.95] text-ink mb-5">
              Find Your{' '}
              <em className="font-serif italic normal-case tracking-normal text-sun">
                Wild
              </em>
            </h1>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-md mb-8 font-sans">
              Curated hikes, rides, and wilderness days across Kenya —
              book in minutes with M-Pesa.
            </p>

            {/* Search / filter bar */}
            <form
              onSubmit={onSearch}
              className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(17,15,13,0.08)] border border-neutral-200 p-2 sm:p-2.5 mb-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0">
                <label className="flex-1 min-w-0 px-3 py-2 sm:border-r border-neutral-200">
                  <span className="block text-[10px] font-semibold tracking-widest uppercase text-neutral-500 mb-1">
                    Destination
                  </span>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={cn(fieldClass, 'cursor-pointer appearance-none')}
                  >
                    <option value="">All destinations</option>
                    {destinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex-1 min-w-0 px-3 py-2 sm:border-r border-neutral-200">
                  <span className="block text-[10px] font-semibold tracking-widest uppercase text-neutral-500 mb-1">
                    Date
                  </span>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={cn(fieldClass, 'cursor-pointer appearance-none')}
                  >
                    <option value="">Any date</option>
                    {dates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex-1 min-w-0 px-3 py-2">
                  <span className="block text-[10px] font-semibold tracking-widest uppercase text-neutral-500 mb-1">
                    Difficulty
                  </span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={cn(fieldClass, 'cursor-pointer appearance-none')}
                  >
                    <option value="">All levels</option>
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0) + d.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="sm:pl-2 sm:flex sm:items-center">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest text-neutral-50 font-semibold text-sm px-5 py-3.5 rounded-xl hover:bg-forest-hover transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Stat mini-cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-white rounded-lg shadow-[0_4px_16px_rgba(17,15,13,0.08)] border border-neutral-200 px-3 py-4 sm:px-4 sm:py-5 text-center sm:text-left"
                >
                  <Icon className="w-4 h-4 text-forest mx-auto sm:mx-0 mb-2" />
                  <div className="font-display text-xl sm:text-2xl font-normal tracking-normal text-ink">
                    {value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 font-sans mt-0.5 leading-snug">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: sun disc + organic photo + floating trust ── */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Sun field — echoes logo disc */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] aspect-square rounded-full bg-sun -z-0"
              aria-hidden
            />

            {/* Organic photo mask */}
            <div className="relative z-10 mx-auto w-[92%] aspect-[4/5] max-h-[520px]">
              <div
                className="absolute inset-0 overflow-hidden shadow-[0_12px_40px_rgba(17,15,13,0.18)]"
                style={{
                  borderRadius: '42% 58% 48% 52% / 48% 42% 58% 52%',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    heroImage.includes('?')
                      ? `${heroImage}&w=900`
                      : `${heroImage}?w=900`
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
