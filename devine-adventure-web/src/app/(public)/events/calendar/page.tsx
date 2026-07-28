'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  addMonths,
  format,
  isSameDay,
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

/** Photo-forward trip card for panel + month strip */
function CalendarEventCard({
  event,
  variant = 'panel',
}: {
  event: Event;
  variant?: 'panel' | 'strip';
}) {
  const spots = spotsLabel(event);
  const duration = durationLabel(event);
  const fill = capacityPercent(event.enrolled, event.capacity);
  const isStrip = variant === 'strip';

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        'group block overflow-hidden bg-white transition-all duration-300',
        isStrip
          ? 'rounded-2xl shadow-[0_4px_16px_rgba(17,15,13,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,15,13,0.12)] shrink-0 w-[260px] sm:w-[280px]'
          : 'rounded-xl border border-neutral-100 hover:border-forest/25 hover:shadow-[0_6px_20px_rgba(17,15,13,0.08)]',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          isStrip ? 'aspect-[16/10]' : 'aspect-[16/9]',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={eventCover(event)}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-void/15 to-transparent" />

        {event.isFeatured && (
          <span className="absolute top-2.5 left-2.5 bg-sun text-ink text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}

        <span
          className={cn(
            'absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full',
            difficultyPillOnPhoto(event.difficulty),
          )}
        >
          {difficultyLabel(event.difficulty)}
        </span>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-50/90 bg-void/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {CATEGORY_LABEL[event.category] ?? event.category}
          </span>
          {spots.scarce && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-50 bg-clay px-2 py-0.5 rounded-full">
              {spots.text}
            </span>
          )}
        </div>
      </div>

      <div className={cn(isStrip ? 'p-4' : 'p-3.5')}>
        <div className="text-[11px] font-semibold text-forest uppercase tracking-wide font-sans mb-1">
          {format(new Date(event.dateTime), 'EEE d MMM · h:mm a')}
          {duration ? ` · ${duration}` : ''}
        </div>

        <h3
          className={cn(
            'font-display font-normal uppercase tracking-normal text-ink leading-tight group-hover:text-forest transition-colors',
            isStrip ? 'text-lg line-clamp-2' : 'text-base line-clamp-2',
          )}
        >
          {event.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-neutral-500 text-xs font-sans">
          <MapPin className="w-3 h-3 text-forest shrink-0" />
          <span className="truncate">{destinationLabel(event.location)}</span>
        </div>

        {!isStrip && event.description && (
          <p className="mt-2 text-xs text-neutral-600 font-sans leading-relaxed line-clamp-2">
            {descriptionSnippet(event.description)}
          </p>
        )}

        {/* Capacity bar */}
        <div className="mt-3">
          <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                fill >= 85 ? 'bg-clay' : fill >= 60 ? 'bg-sun' : 'bg-forest',
              )}
              style={{ width: `${Math.min(100, fill)}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] font-sans text-neutral-500">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.enrolled}/{event.capacity} enrolled
            </span>
            <span
              className={cn(
                spots.scarce ? 'text-clay font-semibold' : 'text-neutral-500',
              )}
            >
              {spots.text}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            {event.isFree || Number(event.price) === 0 ? (
              <span className="text-forest font-semibold text-sm font-sans">
                Free
              </span>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display text-xl font-normal tracking-normal text-ink">
                  {formatKES(Number(event.price))}
                </span>
                <MpesaMark />
              </div>
            )}
            {event.memberPrice !== undefined &&
              event.memberPrice !== null &&
              Number(event.memberPrice) !== Number(event.price) && (
                <p className="text-xs text-forest font-sans mt-0.5">
                  {Number(event.memberPrice) === 0
                    ? 'Free for members'
                    : `${formatKES(Number(event.memberPrice))} members`}
                </p>
              )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest group-hover:gap-1.5 transition-all">
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EventsCalendarPage() {
  const { data, isLoading } = useEvents({ limit: 100 });
  const events: Event[] = data?.events ?? [];

  const [month, setMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);

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
      <main className="flex-1 min-h-0 bg-neutral-50 pb-16 md:pb-20">
        <PageHeroBanner
          image={CALENDAR_BANNER}
          eyebrow="Schedule"
          title="The month on the trail"
          subtitle="Real trips, real dates. Pick a day to see photos, prices, and open spots before you book."
          size="short"
        />

        <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-10">
          {/* Live stats under banner */}
          {!isLoading && events.length > 0 && (
            <div className="mb-8 md:mb-10 flex flex-wrap gap-3 sm:gap-4">
              <div className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] px-5 py-3.5 min-w-[120px]">
                <div className="font-display text-3xl text-ink leading-none">
                  {monthEvents.length}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-sans">
                  This month
                </div>
              </div>
              <div className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] px-5 py-3.5 min-w-[120px]">
                <div className="font-display text-3xl text-forest leading-none">
                  {monthSpotsOpen}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-sans">
                  Spots open
                </div>
              </div>
              <div className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] px-5 py-3.5 min-w-[120px]">
                <div className="font-display text-3xl text-ink leading-none">
                  {events.length}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-sans">
                  Published
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-6">
              <div className="h-48 rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] animate-pulse" />
              <div className="grid lg:grid-cols-[1fr_380px] gap-6 md:gap-8">
                <div className="h-[520px] rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] animate-pulse" />
                <div className="h-[520px] rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* Month photo strip — captivates before the grid */}
              {monthEvents.length > 0 && (
                <section className="mb-8 md:mb-10">
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-normal uppercase tracking-normal text-ink">
                        {format(month, 'MMMM')} on the trail
                      </h2>
                      <p className="text-sm text-neutral-500 font-sans mt-1">
                        Scroll the month&apos;s adventures: photos, pricing, and
                        seats left
                      </p>
                    </div>
                    <Link
                      href="/events"
                      className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-forest-hover shrink-0"
                    >
                      All adventures
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="-mx-6 px-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                    {monthEvents.map((event) => (
                      <div key={event.id} className="snap-start">
                        <CalendarEventCard event={event} variant="strip" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid lg:grid-cols-[1fr_380px] gap-6 md:gap-8 items-start">
                {/* Month grid */}
                <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(17,15,13,0.08)] p-4 sm:p-6">
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

                  <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {grid.map((cell) => {
                      const hasEvents = cell.events.length > 0;
                      const isSelected =
                        selected && isSameDay(cell.date, selected);
                      const key = dayKey(cell.date);
                      const cover = hasEvents
                        ? eventCover(cell.events[0])
                        : null;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelected(cell.date)}
                          disabled={!cell.inCurrentMonth && !hasEvents}
                          className={cn(
                            'relative aspect-square rounded-xl overflow-hidden flex flex-col items-center justify-start pt-1.5 sm:pt-2 transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
                            !cell.inCurrentMonth && 'opacity-35',
                            isSelected
                              ? 'ring-2 ring-forest ring-offset-1 shadow-md'
                              : hasEvents
                                ? 'hover:ring-1 hover:ring-forest/40'
                                : 'hover:bg-neutral-50',
                            !hasEvents &&
                              (cell.isToday
                                ? 'bg-forest/10'
                                : 'bg-transparent'),
                          )}
                        >
                          {/* Day photo thumb when trips exist */}
                          {cover && (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cover}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div
                                className={cn(
                                  'absolute inset-0',
                                  isSelected
                                    ? 'bg-forest/75'
                                    : 'bg-void/45 group-hover:bg-void/35',
                                )}
                              />
                            </>
                          )}

                          <span
                            className={cn(
                              'relative z-10 text-sm sm:text-base font-semibold font-sans leading-none',
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
                            <span className="relative z-10 mt-auto mb-1.5 flex flex-col items-center gap-0.5">
                              <span
                                className={cn(
                                  'text-[9px] sm:text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full',
                                  isSelected || cover
                                    ? 'bg-neutral-50/95 text-ink'
                                    : 'bg-forest text-neutral-50',
                                )}
                              >
                                {cell.events.length}
                              </span>
                              <span className="hidden sm:flex items-center justify-center gap-0.5">
                                {cell.events.slice(0, 3).map((e) => (
                                  <span
                                    key={e.id}
                                    className={cn(
                                      'w-1 h-1 rounded-full',
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

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs font-sans text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-forest" />{' '}
                      Beginner
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sun" /> Moderate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-clay" /> Advanced
                    </span>
                    <span className="ml-auto text-neutral-500">
                      Photo days have trips; number = count
                    </span>
                  </div>
                </div>

                {/* Side panel — rich day/month detail */}
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
                        ? `${selectedEvents.length} adventure${selectedEvents.length === 1 ? '' : 's'} · full details`
                        : 'No adventures on this day'
                      : 'Select a day, or browse every trip this month'}
                  </p>

                  {panelEvents.length === 0 ? (
                    <div className="rounded-xl bg-neutral-50 border border-dashed border-neutral-200 px-4 py-10 text-center">
                      <p className="text-sm text-neutral-500 font-sans">
                        {events.length === 0
                          ? 'No published adventures yet.'
                          : 'Nothing scheduled here. Try another day or month.'}
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
                    <ul className="space-y-4">
                      {panelEvents.map((event) => (
                        <li key={event.id}>
                          <CalendarEventCard event={event} variant="panel" />
                        </li>
                      ))}
                    </ul>
                  )}

                  {panelEvents.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-neutral-100">
                      <p className="text-[11px] text-neutral-500 font-sans flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-forest" />
                        Times shown in local time. Member rates apply after you
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
                                  'text-[10px] font-semibold px-2 py-0.5 rounded-full',
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
