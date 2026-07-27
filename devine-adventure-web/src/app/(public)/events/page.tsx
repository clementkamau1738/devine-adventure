'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EventGrid } from '@/components/events/EventGrid';
import { EventFilters, EventFiltersState } from '@/components/events/EventFilters';
import { useEvents } from '@/hooks/useEvents';

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFiltersState>({
    category: '',
    difficulty: '',
    search: '',
    page: 1,
  });

  const { data, isLoading } = useEvents(filters);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h1 className="font-display text-5xl font-normal text-white mb-3 uppercase tracking-normal">
            Adventures
          </h1>
          <p className="text-stone-400 text-lg">
            {data?.meta.total ?? '...'} experiences across Kenya
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <EventFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <EventGrid events={data?.events ?? []} isLoading={isLoading} />

          {/* Pagination */}
          {data && data.meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {Array.from({ length: data.meta.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    filters.page === i + 1
                      ? 'bg-forest text-neutral-50'
                      : 'border border-stone-700 text-stone-400 hover:border-stone-500'
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
