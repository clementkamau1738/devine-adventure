'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Mountain,
  Search,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { useEvents, useFeaturedEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { cn, destinationLabel } from '@/lib/utils';
import {
  motion,
  useReducedMotion,
  Stagger,
  StaggerItem,
} from '@/components/motion/Motion';
import { scaleIn, stagger } from '@/lib/motion';

const STATS = [
  { icon: Mountain, value: '50+', label: 'Adventures' },
  { icon: Users, value: '2,400+', label: 'Members' },
  { icon: Calendar, value: '120+', label: 'Events hosted' },
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
    () => uniqueSorted(events.map((e) => destinationLabel(e.location))),
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
      return d.toLocaleDateString('en-KE', {
        month: 'long',
        year: 'numeric',
      });
    });
    return uniqueSorted(opts);
  }, [events]);

  const nextTrip = useMemo(() => {
    const upcoming = [...events]
      .filter((e) => new Date(e.dateTime).getTime() >= Date.now() - 36e5)
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
      );
    return upcoming[0] ?? null;
  }, [events]);

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
    if (date && !destination) params.set('search', date.split(' ')[0] ?? date);
    const q = params.toString();
    router.push(q ? `/events?${q}` : '/events');
  };

  const fieldClass =
    'w-full cursor-pointer appearance-none bg-transparent font-sans text-sm font-medium text-ink focus:outline-none min-w-0 pr-5';

  return (
    <section className="relative overflow-hidden bg-neutral-50 text-ink">
      {/* Soft radial wash — fills empty cream without noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(237,186,14,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(41,105,48,0.06), transparent 50%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[min(100dvh,920px)] w-full max-w-7xl flex-col justify-center px-6 pb-14 pt-28 md:pb-20 md:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          {/* ── Copy column ── */}
          <Stagger
            className="order-2 lg:order-1"
            inView={false}
            variants={stagger}
          >
            <StaggerItem>
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-forest sm:text-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sun" />
                Kenya&apos;s Adventure Collective
              </span>
            </StaggerItem>

            <StaggerItem>
              <h1 className="mb-4 max-w-xl font-display text-[2.75rem] font-normal uppercase leading-[0.92] tracking-normal text-ink sm:text-6xl md:text-7xl">
                Find Your{' '}
                <em className="font-serif italic normal-case tracking-normal text-sun">
                  Wild
                </em>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mb-7 max-w-md font-sans text-base leading-relaxed text-neutral-600 sm:text-lg">
                Curated hikes, rides, and wilderness days across Kenya —
                book in minutes with M-Pesa.
              </p>
            </StaggerItem>

            {nextTrip && (
              <StaggerItem>
                <Link
                  href={`/events/${nextTrip.slug}`}
                  className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-3.5 py-2 font-sans text-sm text-forest transition-colors hover:border-forest/40 hover:bg-forest/10"
                >
                  <span className="shrink-0 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-50">
                    Next up
                  </span>
                  <span className="min-w-0 truncate font-medium text-ink">
                    {nextTrip.title}
                  </span>
                  <span className="hidden shrink-0 text-neutral-500 sm:inline">
                    · {format(new Date(nextTrip.dateTime), 'EEE d MMM')}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </StaggerItem>
            )}

            {/* Search — single elevated unit */}
            <StaggerItem>
              <form
                onSubmit={onSearch}
                className="mb-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(17,15,13,0.1)] ring-1 ring-neutral-200/90"
              >
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                  <label className="group relative flex min-w-0 flex-1 cursor-pointer flex-col justify-center px-4 py-3.5 transition-colors hover:bg-neutral-50/80 sm:border-r sm:border-neutral-100">
                    <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Destination
                    </span>
                    <div className="relative">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className={fieldClass}
                      >
                        <option value="">All destinations</option>
                        {destinations.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </label>

                  <label className="group relative flex min-w-0 flex-1 cursor-pointer flex-col justify-center px-4 py-3.5 transition-colors hover:bg-neutral-50/80 sm:border-r sm:border-neutral-100">
                    <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      When
                    </span>
                    <div className="relative">
                      <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={fieldClass}
                      >
                        <option value="">Any date</option>
                        {dates.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </label>

                  <label className="group relative flex min-w-0 flex-1 cursor-pointer flex-col justify-center px-4 py-3.5 transition-colors hover:bg-neutral-50/80">
                    <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Level
                    </span>
                    <div className="relative">
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className={fieldClass}
                      >
                        <option value="">All levels</option>
                        {difficulties.map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0) + d.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </label>

                  <div className="flex items-center p-2 sm:pl-1 sm:pr-2">
                    <motion.button
                      type="submit"
                      whileHover={reduce ? undefined : { scale: 1.02 }}
                      whileTap={reduce ? undefined : { scale: 0.98 }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3.5 text-sm font-semibold text-neutral-50 transition-colors hover:bg-forest-hover sm:w-auto"
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </motion.button>
                  </div>
                </div>
              </form>
            </StaggerItem>

            <StaggerItem>
              <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-hover"
                >
                  Browse all adventures
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/events/calendar"
                  className="text-sm font-medium text-neutral-500 transition-colors hover:text-ink"
                >
                  View calendar
                </Link>
              </div>
            </StaggerItem>

            {/* Stats — one quiet strip, not three heavy boxes */}
            <StaggerItem>
              <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-neutral-200/80 pt-6">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex min-w-[5.5rem] items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <div>
                      <div className="font-display text-2xl font-normal leading-none tracking-normal text-ink">
                        {value}
                      </div>
                      <div className="mt-1 font-sans text-xs text-neutral-500">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StaggerItem>
          </Stagger>

          {/* ── Photo column ── */}
          <motion.div
            className="relative order-1 mx-auto w-full max-w-[420px] lg:order-2 lg:max-w-none"
            initial={reduce ? false : 'hidden'}
            animate="visible"
            variants={scaleIn}
          >
            {/* Soft sun halo behind the circle */}
            <motion.div
              className="absolute left-1/2 top-1/2 -z-0 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun/90"
              aria-hidden
              animate={
                reduce
                  ? undefined
                  : { scale: [1, 1.025, 1], opacity: [0.95, 1, 0.95] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <div
              className="absolute left-1/2 top-1/2 -z-0 aspect-square w-[102%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun/25 blur-2xl"
              aria-hidden
            />

            <div className="relative z-10 mx-auto aspect-square w-[min(100%,420px)] lg:w-full lg:max-w-[480px]">
              <div className="absolute inset-[3%] overflow-hidden rounded-full shadow-[0_20px_50px_rgba(17,15,13,0.18)] ring-4 ring-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={
                    heroImage.includes('?')
                      ? `${heroImage}&w=1000`
                      : `${heroImage}?w=1000`
                  }
                  alt="Hikers on a highland trail"
                  className="h-full w-full object-cover"
                  initial={reduce ? false : { scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
