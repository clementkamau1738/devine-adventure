'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Mountain, Search, Users } from 'lucide-react';
import { useEvents, useFeaturedEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { cn, destinationLabel } from '@/lib/utils';
import {
  motion,
  useReducedMotion,
  Stagger,
  StaggerItem,
} from '@/components/motion/Motion';
import { fadeUp, scaleIn, springSoft, stagger } from '@/lib/motion';

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
  const reduce = useReducedMotion();
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
          <Stagger
            className="order-2 lg:order-1"
            inView={false}
            variants={stagger}
          >
            <StaggerItem>
              <span className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-forest sm:text-sm">
                Kenya&apos;s Adventure Collective
              </span>
            </StaggerItem>

            <StaggerItem>
              <h1 className="mb-5 font-display text-5xl font-normal uppercase leading-[0.95] tracking-normal text-ink sm:text-6xl md:text-7xl">
                Find Your{' '}
                <em className="font-serif italic normal-case tracking-normal text-sun">
                  Wild
                </em>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mb-8 max-w-md font-sans text-base leading-relaxed text-neutral-600 sm:text-lg">
                Curated hikes, rides, and wilderness days across Kenya —
                book in minutes with M-Pesa.
              </p>
            </StaggerItem>

            {/* Search / filter bar */}
            <StaggerItem>
            <form
              onSubmit={onSearch}
              className="mb-10 rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_4px_24px_rgba(17,15,13,0.08)] sm:p-2.5"
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
            </StaggerItem>

            {/* Stat mini-cards */}
            <StaggerItem>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map(({ icon: Icon, value, label }) => (
                <motion.div
                  key={label}
                  whileHover={reduce ? undefined : { y: -3 }}
                  transition={springSoft}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-4 text-center shadow-[0_4px_16px_rgba(17,15,13,0.08)] sm:px-4 sm:py-5 sm:text-left"
                >
                  <Icon className="mx-auto mb-2 h-4 w-4 text-forest sm:mx-0" />
                  <div className="font-display text-xl font-normal tracking-normal text-ink sm:text-2xl">
                    {value}
                  </div>
                  <div className="mt-0.5 font-sans text-[11px] leading-snug text-neutral-500 sm:text-xs">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
            </StaggerItem>
          </Stagger>

          {/* ── Right: sun disc + organic photo ── */}
          <motion.div
            className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none"
            initial={reduce ? false : 'hidden'}
            animate="visible"
            variants={scaleIn}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 -z-0 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun"
              aria-hidden
              animate={
                reduce
                  ? undefined
                  : { scale: [1, 1.03, 1], opacity: [1, 0.92, 1] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
              }
            />

            <div className="relative z-10 mx-auto aspect-[4/5] max-h-[520px] w-[92%]">
              <div
                className="absolute inset-0 overflow-hidden shadow-[0_12px_40px_rgba(17,15,13,0.18)]"
                style={{
                  borderRadius: '42% 58% 48% 52% / 48% 42% 58% 52%',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={
                    heroImage.includes('?')
                      ? `${heroImage}&w=900`
                      : `${heroImage}?w=900`
                  }
                  alt=""
                  className="h-full w-full object-cover"
                  initial={reduce ? false : { scale: 1.06 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
