'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EventGrid } from '@/components/events/EventGrid';
import {
  EventFilters,
  EventFiltersState,
} from '@/components/events/EventFilters';
import { useEvents } from '@/hooks/useEvents';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';

const EVENTS_BANNER =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920';

function EventsPageInner() {
  const searchParams = useSearchParams();
  const difficultyParam = searchParams.get('difficulty') ?? '';
  const searchParam = searchParams.get('search') ?? '';

  const [filters, setFilters] = useState<EventFiltersState>({
    category: '',
    difficulty: difficultyParam,
    search: searchParam,
    page: 1,
  });

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      difficulty: difficultyParam,
      search: searchParam,
      page: 1,
    }));
  }, [difficultyParam, searchParam]);

  const { data, isLoading } = useEvents(filters);

  const total = data?.meta?.total;
  const subtitle =
    total != null
      ? `${total} experience${total === 1 ? '' : 's'} across Kenya`
      : 'Curated hikes, rides, and wilderness days across Kenya';

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-0 bg-neutral-50 pb-16 md:pb-20">
        <PageHeroBanner
          image={EVENTS_BANNER}
          eyebrow="Explore"
          title="Trails worth waking for"
          subtitle={subtitle}
          size="short"
        />

        {/*
          Single discovery surface under the banner (Airbnb / GetYourGuide).
          Difficulty chips live inside EventFilters — no second band.
        */}
        <div className="sticky top-[4.5rem] z-30 -mt-5 mb-8 px-6 md:-mt-6 md:mb-10">
          <div className="mx-auto max-w-7xl">
            <EventFilters
              filters={filters}
              onChange={setFilters}
              resultCount={total}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <EventGrid events={data?.events ?? []} isLoading={isLoading} />

          {data && data.meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {Array.from({ length: data.meta.totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                  className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                    filters.page === i + 1
                      ? 'bg-forest text-neutral-50'
                      : 'bg-white text-neutral-600 shadow-[0_2px_8px_rgba(17,15,13,0.06)] hover:text-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="flex-1 min-h-0 bg-neutral-50 pb-20">
            <PageHeroBanner
              image={EVENTS_BANNER}
              eyebrow="Explore"
              title="Trails worth waking for"
              subtitle="Loading adventures…"
              size="short"
            />
          </main>
          <Footer />
        </>
      }
    >
      <EventsPageInner />
    </Suspense>
  );
}
