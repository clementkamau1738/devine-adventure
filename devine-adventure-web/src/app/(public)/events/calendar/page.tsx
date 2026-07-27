'use client';

import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useEvents } from '@/hooks/useEvents';
import {
  cn,
  difficultyColor,
  difficultyLabel,
  formatKES,
  categoryIcon,
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

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventsCalendarPage() {
  const { data, isLoading } = useEvents({ limit: 100 });
  const events: Event[] = data?.events ?? [];

  const [month, setMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Once events load, open on a month that actually has trips
  useEffect(() => {
    if (initialized || isLoading) return;
    if (events.length === 0) {
      setInitialized(true);
      return;
    }
    const m = initialCalendarMonth(events);
    setMonth(m);
    const inM = eventsInMonth(events, m);
    if (inM[0]) setSelected(new Date(inM[0].dateTime));
    setInitialized(true);
  }, [events, isLoading, initialized]);

  const grid = useMemo(
    () => buildMonthGrid(month, events),
    [month, events],
  );
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

  const goPrev = () => {
    setMonth((m) => subMonths(m, 1));
    setSelected(null);
  };
  const goNext = () => {
    setMonth((m) => addMonths(m, 1));
    setSelected(null);
  };
  const goToday = () => {
    const t = startOfMonth(new Date());
    setMonth(t);
    setSelected(new Date());
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-50 pt-28 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Schedule
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-normal text-ink uppercase tracking-normal mb-3">
              Calendar
            </h1>
            <p className="text-neutral-600 text-base md:text-lg font-sans max-w-xl">
              Browse every published adventure by month — pick a day to see
              what&apos;s on.
            </p>
          </div>

          {isLoading ? (
            <div className="grid lg:grid-cols-[1fr_340px] gap-6 md:gap-8">
              <div className="h-[520px] rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] animate-pulse" />
              <div className="h-[520px] rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] animate-pulse" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_340px] gap-6 md:gap-8 items-start">
              {/* ── Month grid ── */}
              <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(17,15,13,0.08)] p-4 sm:p-6">
                {/* Month chrome */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-neutral-100 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center min-w-0">
                    <h2 className="font-display text-2xl sm:text-3xl font-normal uppercase tracking-normal text-ink">
                      {format(month, 'MMMM yyyy')}
                    </h2>
                    <button
                      type="button"
                      onClick={goToday}
                      className="mt-1 text-xs font-semibold text-forest hover:text-forest-hover uppercase tracking-wider"
                    >
                      Today
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-neutral-100 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-500 py-2 font-sans"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {grid.map((cell) => {
                    const hasEvents = cell.events.length > 0;
                    const isSelected =
                      selected && isSameDay(cell.date, selected);
                    const key = dayKey(cell.date);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelected(cell.date)}
                        disabled={!cell.inCurrentMonth && !hasEvents}
                        className={cn(
                          'relative aspect-square rounded-xl flex flex-col items-center justify-start pt-2 sm:pt-2.5 transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
                          !cell.inCurrentMonth && 'opacity-35',
                          isSelected
                            ? 'bg-forest text-neutral-50 shadow-md'
                            : cell.isToday
                              ? 'bg-forest/10 text-ink'
                              : hasEvents
                                ? 'hover:bg-neutral-100 text-ink'
                                : 'text-neutral-500 hover:bg-neutral-50',
                        )}
                      >
                        <span
                          className={cn(
                            'text-sm sm:text-base font-semibold font-sans leading-none',
                            isSelected && 'text-neutral-50',
                            cell.isToday && !isSelected && 'text-forest',
                          )}
                        >
                          {format(cell.date, 'd')}
                        </span>

                        {/* Event dots — max 3 */}
                        {hasEvents && (
                          <span className="mt-1.5 flex items-center justify-center gap-0.5">
                            {cell.events.slice(0, 3).map((e) => (
                              <span
                                key={e.id}
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  isSelected
                                    ? 'bg-neutral-50'
                                    : difficultyDotClass(e.difficulty),
                                )}
                              />
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs font-sans text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-forest" /> Beginner
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sun" /> Moderate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-clay" /> Advanced
                  </span>
                  <span className="ml-auto text-neutral-500">
                    {monthEvents.length} trip
                    {monthEvents.length === 1 ? '' : 's'} this month
                  </span>
                </div>
              </div>

              {/* ── Side panel: selected day or month list ── */}
              <aside className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(17,15,13,0.08)] p-5 sm:p-6 lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-forest" />
                  <h3 className="font-display text-lg font-normal uppercase tracking-normal text-ink">
                    {selected
                      ? format(selected, 'EEE d MMM')
                      : format(month, 'MMMM')}
                  </h3>
                </div>
                <p className="text-neutral-500 text-xs font-sans mb-5">
                  {selected
                    ? selectedEvents.length
                      ? `${selectedEvents.length} adventure${selectedEvents.length === 1 ? '' : 's'}`
                      : 'No adventures on this day'
                    : 'Select a day or browse the month'}
                </p>

                {(selected ? selectedEvents : monthEvents).length === 0 ? (
                  <div className="rounded-xl bg-neutral-50 border border-dashed border-neutral-200 px-4 py-10 text-center">
                    <p className="text-sm text-neutral-500 font-sans">
                      {events.length === 0
                        ? 'No published adventures yet.'
                        : 'Nothing scheduled here — try another day.'}
                    </p>
                    {events.length > 0 && (
                      <Link
                        href="/events"
                        className="inline-block mt-3 text-sm font-semibold text-forest hover:text-forest-hover"
                      >
                        Browse all adventures
                      </Link>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {(selected ? selectedEvents : monthEvents).map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/events/${event.slug}`}
                          className="block rounded-xl border border-neutral-100 bg-neutral-50/80 hover:border-forest/30 hover:bg-white transition-colors p-3.5 group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="min-w-0">
                              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide font-sans mb-0.5">
                                {format(new Date(event.dateTime), 'EEE d · h:mm a')}
                              </div>
                              <div className="text-ink font-semibold text-sm leading-snug group-hover:text-forest transition-colors line-clamp-2 font-sans">
                                <span className="mr-1">
                                  {categoryIcon(event.category)}
                                </span>
                                {event.title}
                              </div>
                            </div>
                            <span
                              className={cn(
                                'shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                                difficultyColor(event.difficulty),
                              )}
                            >
                              {difficultyLabel(event.difficulty)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-500 text-xs font-sans mb-2">
                            <MapPin className="w-3 h-3 text-forest shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-display text-base font-normal tracking-normal text-ink">
                                {formatKES(Number(event.price))}
                              </span>
                              {Number(event.price) > 0 && <MpesaMark />}
                            </div>
                            <span className="flex items-center gap-1 text-neutral-500 text-xs font-sans shrink-0">
                              <Users className="w-3 h-3" />
                              {event.capacity - event.enrolled} left
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
