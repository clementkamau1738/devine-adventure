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
import { DifficultyFilterStrip } from '@/components/home/DifficultyFilterStrip';

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

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-0 bg-neutral-50 pt-28 pb-16 md:pb-20">
        {/* Page header — homepage eyebrow + Anton scale */}
        <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-10">
          <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Explore
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-normal text-ink uppercase tracking-normal mb-3">
            Adventures
          </h1>
          <p className="text-neutral-600 text-base md:text-lg font-sans max-w-xl">
            {data?.meta?.total != null
              ? `${data.meta.total} experience${data.meta.total === 1 ? '' : 's'} across Kenya`
              : 'Curated hikes, rides, and wilderness days across Kenya'}
          </p>
        </div>

        {/* Difficulty band — same grounding pattern as membership teaser */}
        <DifficultyFilterStrip className="mb-8 md:mb-10 !bg-neutral-100" />

        {/* Filters — elevated white bar like hero search */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(17,15,13,0.08)] p-3 sm:p-4">
            <EventFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Grid — EventCard = Featured Adventures treatment */}
        <div className="max-w-7xl mx-auto px-6">
          <EventGrid events={data?.events ?? []} isLoading={isLoading} />

          {data && data.meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {Array.from({ length: data.meta.totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
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
          <main className="flex-1 min-h-0 bg-neutral-50 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6 text-neutral-500 font-sans">
              Loading adventures…
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <EventsPageInner />
    </Suspense>
  );
}
