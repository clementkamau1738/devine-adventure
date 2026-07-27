'use client';
import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, Users } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useEvents } from '@/hooks/useEvents';
import { categoryIcon, difficultyColor, cn } from '@/lib/utils';
import { Event } from '@/types';

function groupByMonth(events: Event[]) {
  const groups = new Map<string, Event[]>();
  for (const event of events) {
    const key = format(new Date(event.dateTime), 'MMMM yyyy');
    const existing = groups.get(key) ?? [];
    existing.push(event);
    groups.set(key, existing);
  }
  return groups;
}

export default function EventsCalendarPage() {
  const { data, isLoading } = useEvents({ limit: 100 });
  const events: Event[] = data?.events ?? [];
  const grouped = groupByMonth(events);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <h1 className="font-display text-5xl font-black text-white mb-3">
            Calendar
          </h1>
          <p className="text-stone-400 text-lg">
            Every upcoming adventure, month by month
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          {isLoading ? (
            <div className="text-stone-400">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-stone-800 rounded-2xl">
              <div className="text-white font-semibold mb-1">
                No adventures scheduled yet
              </div>
              <p className="text-stone-500 text-sm">Check back soon.</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([month, monthEvents]) => (
              <div key={month} className="mb-10">
                <h2 className="text-amber-400 font-display font-bold text-xl mb-4">
                  {month}
                </h2>
                <div className="space-y-3">
                  {monthEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="flex items-center gap-4 bg-stone-900 border border-neutral-700 rounded-xl p-4 hover:border-forest/40 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-14 text-center">
                        <div className="text-white font-black text-xl leading-none">
                          {format(new Date(event.dateTime), 'd')}
                        </div>
                        <div className="text-stone-500 text-xs uppercase mt-1">
                          {format(new Date(event.dateTime), 'EEE')}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{categoryIcon(event.category)}</span>
                          <span className="text-white font-semibold truncate group-hover:text-forest transition-colors">
                            {event.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-stone-400 text-xs">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </div>
                      </div>

                      <span
                        className={cn(
                          'text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0',
                          difficultyColor(event.difficulty),
                        )}
                      >
                        {event.difficulty}
                      </span>

                      <div className="flex items-center gap-1 text-stone-500 text-xs flex-shrink-0 w-16 justify-end">
                        <Users className="w-3 h-3" />
                        {event.capacity - event.enrolled} left
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
