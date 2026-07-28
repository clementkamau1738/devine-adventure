'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  CalendarDays,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useEvents } from '@/hooks/useEvents';
import {
  cn,
  difficultyColor,
  difficultyLabel,
  difficultyPillOnPhoto,
  destinationLabel,
  formatKES,
  capacityPercent,
} from '@/lib/utils';
import {
  buildMonthGrid,
  dayKey,
  difficultyDotClass,
  eventsInMonth,
  initialCalendarMonth,
} from '@/lib/calendar';
import { Event } from '@/types';
import { MpesaMark } from '@/components/payments/MpesaMark';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200';

const CALENDAR_BANNER =
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920';

const CATEGORY_LABEL: Record<string, string> = {
  HIKE: 'Hike',
  BIKE: 'Bike',
  PRIVATE: 'Private',
  TRAINING: 'Training',
};

function eventCover(event: Event): string {
  return event.images?.[0] || FALLBACK_IMAGE;
}

function spotsLeft(event: Event): number {
  return Math.max(0, event.capacity - event.enrolled);
}

function spotsLabel(event: Event): { text: string; scarce: boolean } {
  const left = spotsLeft(event);
  if (left === 0) return { text: 'Sold out', scarce: true };
  if (left <= 3) return { text: `Only ${left} left`, scarce: true };
  return { text: `${left} spots left`, scarce: false };
}

function durationLabel(event: Event): string | null {
  if (!event.endDateTime) return null;
  const start = new Date(event.dateTime);
  const end = new Date(event.endDateTime);
  const days = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );
  return days === 1 ? '1 day' : `${days} days`;
}

function descriptionSnippet(text: string, max = 110): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

function isSoldOut(event: Event): boolean {
  return spotsLeft(event) === 0;
}

/** Next trip from today (or first in list). */
function nextUpcoming(events: Event[], from = new Date()): Event | null {
  const upcoming = [...events]
    .filter((e) => new Date(e.dateTime).getTime() >= from.getTime() - 36e5)
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
  return upcoming[0] ?? events[0] ?? null;
}

/** Photo trip card — strip, panel, or hero spotlight */
function CalendarEventCard({
  event,
  variant = 'panel',
  selected = false,
  onSelectDay,
}: {
  event: Event;
  variant?: 'panel' | 'strip' | 'spotlight';
  selected?: boolean;
  onSelectDay?: (d: Date) => void;
}) {
  const spots = spotsLabel(event);
  const duration = durationLabel(event);
  const fill = capacityPercent(event.enrolled, event.capacity);
  const isStrip = variant === 'strip';
  const isSpotlight = variant === 'spotlight';
  const soldOut = isSoldOut(event);

  const body = (
    <>
      <div
        className={cn(
          'relative overflow-hidden',
          isSpotlight
            ? 'aspect-[21/9] sm:aspect-[2.4/1] md:aspect-auto md:h-full md:min-h-[280px]'
            : isStrip
              ? 'aspect-[16/10]'
              : 'aspect-[16/9]',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={eventCover(event)}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/25 to-transparent" />

        {isSpotlight && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            <Sparkles className="h-3.5 w-3.5" />
            Next up
          </span>
        )}

        {event.isFeatured && !isSpotlight && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
            Featured
          </span>
        )}

        <span
          className={cn(
            'absolute text-[10px] font-semibold px-2 py-0.5 rounded-full',
            isSpotlight ? 'right-4 top-4' : 'right-2.5 top-2.5',
            difficultyPillOnPhoto(event.difficulty),
          )}
        >
          {difficultyLabel(event.difficulty)}
        </span>

        <div
          className={cn(
            'absolute flex items-end justify-between gap-2',
            isSpotlight ? 'bottom-4 left-4 right-4' : 'bottom-2.5 left-2.5 right-2.5',
          )}
        >
          <span className="rounded-full bg-void/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-50/95 backdrop-blur-sm">
            {CATEGORY_LABEL[event.category] ?? event.category}
          </span>
          {spots.scarce && (
            <span className="rounded-full bg-clay px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-50">
              {spots.text}
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          isSpotlight ? 'flex flex-1 flex-col justify-center p-6 sm:p-8' : isStrip ? 'p-4' : 'p-3.5',
        )}
      >
        <div className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-forest">
          {format(new Date(event.dateTime), 'EEE d MMM · h:mm a')}
          {duration ? ` · ${duration}` : ''}
        </div>

        <h3
          className={cn(
            'font-display font-normal uppercase tracking-normal leading-tight text-ink transition-colors group-hover:text-forest',
            isSpotlight
              ? 'text-2xl sm:text-3xl line-clamp-2'
              : isStrip
                ? 'text-lg line-clamp-2'
                : 'text-base line-clamp-2',
          )}
        >
          {event.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-neutral-500">
          <MapPin className="h-3 w-3 shrink-0 text-forest" />
          <span className="truncate">{destinationLabel(event.location)}</span>
        </div>

        {(isSpotlight || !isStrip) && event.description && (
          <p className="mt-2 line-clamp-2 font-sans text-xs leading-relaxed text-neutral-600 sm:text-sm">
            {descriptionSnippet(event.description, isSpotlight ? 160 : 110)}
          </p>
        )}

        <div className="mt-3">
          <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                fill >= 85 ? 'bg-clay' : fill >= 60 ? 'bg-sun' : 'bg-forest',
              )}
              style={{ width: `${Math.min(100, fill)}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2 font-sans text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {event.enrolled}/{event.capacity} joined
            </span>
            <span
              className={cn(spots.scarce ? 'font-semibold text-clay' : '')}
            >
              {spots.text}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'mt-4 flex flex-wrap items-center justify-between gap-3',
            isSpotlight && 'mt-6',
          )}
        >
          <div className="min-w-0">
            {event.isFree || Number(event.price) === 0 ? (
              <span className="font-sans text-sm font-semibold text-forest">
                Free
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-display text-xl font-normal tracking-normal text-ink sm:text-2xl">
                  {formatKES(Number(event.price))}
                </span>
                <MpesaMark />
              </div>
            )}
            {event.memberPrice !== undefined &&
              event.memberPrice !== null &&
              Number(event.memberPrice) !== Number(event.price) && (
                <p className="mt-0.5 font-sans text-xs text-forest">
                  {Number(event.memberPrice) === 0
                    ? 'Free for members'
                    : `${formatKES(Number(event.memberPrice))} for members`}
                </p>
              )}
          </div>

          {isSpotlight ? (
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                soldOut
                  ? 'bg-neutral-200 text-neutral-600'
                  : 'bg-forest text-neutral-50 group-hover:bg-forest-hover',
              )}
            >
              {soldOut ? 'View trip' : 'Reserve a spot'}
              <ArrowRight className="h-4 w-4" />
            </span>
          ) : isStrip && onSelectDay ? (
            // Floating Reserve pill rendered outside the select-day button
            <span className="h-7" aria-hidden />
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest transition-all group-hover:gap-1.5">
              {soldOut ? 'View' : 'Reserve'}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isStrip && onSelectDay) {
    return (
      <div
        className={cn(
          'group relative w-[260px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] transition-all duration-300 sm:w-[280px]',
          selected
            ? 'shadow-[0_8px_24px_rgba(17,15,13,0.12)] ring-2 ring-forest ring-offset-2'
            : 'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,15,13,0.12)]',
        )}
      >
        <button
          type="button"
          onClick={() => onSelectDay(new Date(event.dateTime))}
          className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"
          aria-label={`Show ${event.title} on ${format(new Date(event.dateTime), 'd MMM')}`}
          aria-pressed={selected}
        >
          {body}
        </button>
        <div className="absolute bottom-3.5 right-3.5 z-10">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-forest shadow-sm ring-1 ring-neutral-200 backdrop-blur-sm hover:bg-forest hover:text-neutral-50"
            onClick={(e) => e.stopPropagation()}
          >
            {soldOut ? 'View' : 'Reserve'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        'group block overflow-hidden bg-white transition-all duration-300',
        isSpotlight
          ? 'rounded-2xl shadow-[0_8px_28px_rgba(17,15,13,0.1)] hover:shadow-[0_12px_36px_rgba(17,15,13,0.12)] md:grid md:grid-cols-[1.15fr_1fr]'
          : isStrip
            ? 'w-[260px] shrink-0 rounded-2xl shadow-[0_4px_16px_rgba(17,15,13,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,15,13,0.12)] sm:w-[280px]'
            : 'rounded-xl border border-neutral-100 hover:border-forest/25 hover:shadow-[0_6px_20px_rgba(17,15,13,0.08)]',
        selected && !isSpotlight && 'ring-2 ring-forest ring-offset-2',
      )}
    >
      {body}
    </Link>
  );
}

export default function EventsCalendarPage() {
  const { data, isLoading } = useEvents({ limit: 100 });
  const events: Event[] = data?.events ?? [];

  const [month, setMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialized || isLoading) return;
    if (events.length === 0) {
      setInitialized(true);
      return;
    }
    const m = initialCalendarMonth(events);
    setMonth(m);
    const inM = eventsInMonth(events, m);
    const next = nextUpcoming(events);
    if (next && isSameMonth(new Date(next.dateTime), m)) {
      setSelected(new Date(next.dateTime));
    } else if (inM[0]) {
      setSelected(new Date(inM[0].dateTime));
    }
    setInitialized(true);
  }, [events, isLoading, initialized]);

  const grid = useMemo(() => buildMonthGrid(month, events), [month, events]);
  const monthEvents = useMemo(
    () => eventsInMonth(events, month),
    [events, month],
  );
  const selectedEvents = useMemo(() => {
    if (!selected) return [];
    return events
      .filter((e) => isSameDay(new Date(e.dateTime), selected))
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
      );
  }, [events, selected]);

  const panelEvents = selected ? selectedEvents : monthEvents;

  const monthSpotsOpen = useMemo(
    () => monthEvents.reduce((sum, e) => sum + spotsLeft(e), 0),
    [monthEvents],
  );

  const spotlight = useMemo(() => {
    const inMonth = monthEvents.filter(
      (e) => new Date(e.dateTime).getTime() >= Date.now() - 36e5,
    );
    if (inMonth[0]) return inMonth[0];
    return monthEvents[0] ?? null;
  }, [monthEvents]);

  const nextMonthWithTrips = useMemo(() => {
    if (monthEvents.length > 0) return null;
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
    const future = sorted.find(
      (e) =>
        startOfMonth(new Date(e.dateTime)).getTime() >
        startOfMonth(month).getTime(),
    );
    return future ? startOfMonth(new Date(future.dateTime)) : null;
  }, [events, month, monthEvents.length]);

  const selectDay = (d: Date, scrollPanel = true) => {
    setSelected(d);
    if (!isSameMonth(d, month)) {
      setMonth(startOfMonth(d));
    }
    if (scrollPanel && typeof window !== 'undefined' && window.innerWidth < 1024) {
      requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const goPrev = () => {
    setMonth((m) => subMonths(m, 1));
    setSelected(null);
  };
  const goNext = () => {
    setMonth((m) => addMonths(m, 1));
    setSelected(null);
  };
  const goToday = () => {
    const t = new Date();
    setMonth(startOfMonth(t));
    setSelected(t);
  };

  // Keep selected strip card in view
  useEffect(() => {
    if (!selected || !stripRef.current) return;
    const id = dayKey(selected);
    const el = stripRef.current.querySelector(`[data-day="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selected]);

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-0 bg-neutral-50 pb-16 md:pb-20">
        <PageHeroBanner
          image={CALENDAR_BANNER}
          eyebrow="Schedule"
          title="The month on the trail"
          subtitle="Tap a day, skim the photos, reserve your seat — all before you leave the page."
          size="short"
        />

        <div className="mx-auto max-w-7xl px-6 pt-8 md:pt-10">
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-56 animate-pulse rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)]" />
              <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_400px]">
                <div className="h-[520px] animate-pulse rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)]" />
                <div className="h-[520px] animate-pulse rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)]" />
              </div>
            </div>
          ) : (
            <>
              {/* Next-up spotlight — primary consumer hook */}
              {spotlight && (
                <section className="mb-8 md:mb-10">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                        Start here
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-normal uppercase tracking-normal text-ink sm:text-3xl">
                        Your next trail day
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectDay(new Date(spotlight.dateTime))}
                      className="hidden text-sm font-semibold text-forest hover:text-forest-hover sm:inline-flex"
                    >
                      Jump to day on calendar
                    </button>
                  </div>
                  <CalendarEventCard event={spotlight} variant="spotlight" />
                </section>
              )}

              {/* Month strip — photo lane tied to selection */}
              {monthEvents.length > 0 && (
                <section className="mb-8 md:mb-10">
                  <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl font-normal uppercase tracking-normal text-ink sm:text-3xl">
                        {format(month, 'MMMM')} lineup
                      </h2>
                      <p className="mt-1.5 font-sans text-sm text-neutral-600 sm:text-base">
                        <span className="font-semibold text-ink">
                          {monthEvents.length} trip
                          {monthEvents.length === 1 ? '' : 's'}
                        </span>
                        {monthSpotsOpen > 0 ? (
                          <>
                            {' '}
                            ·{' '}
                            <span className="font-semibold text-forest">
                              {monthSpotsOpen} seat
                              {monthSpotsOpen === 1 ? '' : 's'} still open
                            </span>
                          </>
                        ) : (
                          <span className="text-clay"> · sold out this month</span>
                        )}
                        <span className="text-neutral-500">
                          {' '}
                          · tap a card to open that day
                        </span>
                      </p>
                    </div>
                    <Link
                      href="/events"
                      className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-forest hover:text-forest-hover"
                    >
                      Browse all adventures
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div
                    ref={stripRef}
                    className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
                  >
                    {monthEvents.map((event) => {
                      const day = new Date(event.dateTime);
                      const isSel = selected ? isSameDay(day, selected) : false;
                      return (
                        <div
                          key={event.id}
                          data-day={dayKey(day)}
                          className="snap-start"
                        >
                          <CalendarEventCard
                            event={event}
                            variant="strip"
                            selected={isSel}
                            onSelectDay={(d) => selectDay(d)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {monthEvents.length === 0 && events.length > 0 && (
                <div className="mb-8 rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-10 text-center md:mb-10">
                  <p className="font-sans text-sm text-neutral-600">
                    Quiet month — no trips in {format(month, 'MMMM')} yet.
                  </p>
                  {nextMonthWithTrips && (
                    <button
                      type="button"
                      onClick={() => {
                        setMonth(nextMonthWithTrips);
                        const first = eventsInMonth(events, nextMonthWithTrips)[0];
                        if (first) setSelected(new Date(first.dateTime));
                      }}
                      className="mt-4 inline-flex items-center gap-1 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-neutral-50 hover:bg-forest-hover"
                    >
                      Jump to {format(nextMonthWithTrips, 'MMMM')}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[1fr_400px]">
                {/* Month grid */}
                <div className="rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(17,15,13,0.08)] sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-neutral-100"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="min-w-0 text-center">
                      <h2 className="font-display text-2xl font-normal uppercase tracking-normal text-ink sm:text-3xl">
                        {format(month, 'MMMM yyyy')}
                      </h2>
                      <button
                        type="button"
                        onClick={goToday}
                        className="mt-1 text-xs font-semibold uppercase tracking-wider text-forest hover:text-forest-hover"
                      >
                        Jump to today
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-neutral-100"
                      aria-label="Next month"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-2 grid grid-cols-7">
                    {WEEKDAYS.map((d) => (
                      <div
                        key={d}
                        className="py-2 text-center font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {grid.map((cell) => {
                      const hasEvents = cell.events.length > 0;
                      const isSelected =
                        selected && isSameDay(cell.date, selected);
                      const key = dayKey(cell.date);
                      const cover = hasEvents
                        ? eventCover(cell.events[0])
                        : null;
                      const daySpots = cell.events.reduce(
                        (s, e) => s + spotsLeft(e),
                        0,
                      );
                      const dayScarce =
                        hasEvents && daySpots > 0 && daySpots <= 3;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => selectDay(cell.date)}
                          disabled={!cell.inCurrentMonth && !hasEvents}
                          aria-pressed={!!isSelected}
                          aria-label={
                            hasEvents
                              ? `${format(cell.date, 'd MMMM')}, ${cell.events.length} trip${cell.events.length === 1 ? '' : 's'}`
                              : format(cell.date, 'd MMMM')
                          }
                          className={cn(
                            'relative flex aspect-square flex-col items-center justify-start overflow-hidden rounded-xl pt-1.5 transition-all sm:pt-2',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
                            !cell.inCurrentMonth && 'opacity-35',
                            isSelected
                              ? 'shadow-md ring-2 ring-forest ring-offset-1'
                              : hasEvents
                                ? 'hover:ring-1 hover:ring-forest/40'
                                : 'hover:bg-neutral-50',
                            !hasEvents &&
                              (cell.isToday
                                ? 'bg-forest/10'
                                : 'bg-transparent'),
                          )}
                        >
                          {cover && (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cover}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                              <div
                                className={cn(
                                  'absolute inset-0',
                                  isSelected ? 'bg-forest/75' : 'bg-void/50',
                                )}
                              />
                            </>
                          )}

                          <span
                            className={cn(
                              'relative z-10 font-sans text-sm font-semibold leading-none sm:text-base',
                              isSelected || cover
                                ? 'text-neutral-50'
                                : cell.isToday
                                  ? 'text-forest'
                                  : hasEvents
                                    ? 'text-ink'
                                    : 'text-neutral-500',
                            )}
                          >
                            {format(cell.date, 'd')}
                          </span>

                          {hasEvents && (
                            <span className="relative z-10 mb-1.5 mt-auto flex flex-col items-center gap-0.5">
                              <span
                                className={cn(
                                  'rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums sm:text-[10px]',
                                  dayScarce && !isSelected
                                    ? 'bg-clay text-neutral-50'
                                    : isSelected || cover
                                      ? 'bg-neutral-50/95 text-ink'
                                      : 'bg-forest text-neutral-50',
                                )}
                              >
                                {cell.events.length}
                              </span>
                              <span className="hidden items-center justify-center gap-0.5 sm:flex">
                                {cell.events.slice(0, 3).map((e) => (
                                  <span
                                    key={e.id}
                                    className={cn(
                                      'h-1 w-1 rounded-full',
                                      isSelected || cover
                                        ? 'bg-neutral-50'
                                        : difficultyDotClass(e.difficulty),
                                    )}
                                  />
                                ))}
                              </span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-neutral-100 pt-4 font-sans text-xs text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-forest" /> Beginner
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-sun" /> Moderate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-clay" /> Advanced
                    </span>
                    <span className="ml-auto text-neutral-500">
                      Photo = trip day · red badge = few seats left
                    </span>
                  </div>
                </div>

                {/* Day panel — booking-focused */}
                <aside
                  ref={panelRef}
                  className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,15,13,0.08)] sm:p-6 lg:sticky lg:top-28"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-forest" />
                    <h3 className="font-display text-lg font-normal uppercase tracking-normal text-ink">
                      {selected
                        ? format(selected, 'EEE d MMM')
                        : format(month, 'MMMM')}
                    </h3>
                  </div>
                  <p className="mb-5 font-sans text-xs text-neutral-500">
                    {selected
                      ? selectedEvents.length
                        ? `${selectedEvents.length} adventure${selectedEvents.length === 1 ? '' : 's'} — pick one to reserve`
                        : 'No adventures on this day'
                      : 'Select a photo day on the calendar'}
                  </p>

                  {panelEvents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center">
                      <p className="font-sans text-sm text-neutral-500">
                        {events.length === 0
                          ? 'No adventures on the calendar yet.'
                          : 'Nothing on this day. Try a photo day or another month.'}
                      </p>
                      {spotlight && (
                        <button
                          type="button"
                          onClick={() =>
                            selectDay(new Date(spotlight.dateTime))
                          }
                          className="mt-4 text-sm font-semibold text-forest hover:text-forest-hover"
                        >
                          Go to next trip day
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {panelEvents.map((event) => (
                        <li key={event.id}>
                          <CalendarEventCard event={event} variant="panel" />
                        </li>
                      ))}
                    </ul>
                  )}

                  {panelEvents.length > 0 && (
                    <div className="mt-5 border-t border-neutral-100 pt-4">
                      <p className="flex items-start gap-1.5 font-sans text-[11px] text-neutral-500">
                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
                        Local departure times. Member prices unlock when you
                        sign in with an active plan.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(['BEGINNER', 'MODERATE', 'ADVANCED'] as const).map(
                          (d) => {
                            const n = panelEvents.filter(
                              (e) => e.difficulty === d,
                            ).length;
                            if (!n) return null;
                            return (
                              <span
                                key={d}
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                                  difficultyColor(d),
                                )}
                              >
                                {n} {difficultyLabel(d)}
                              </span>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
