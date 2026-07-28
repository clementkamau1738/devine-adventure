'use client';

import { Search, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface EventFiltersState {
  category: string;
  difficulty: string;
  search: string;
  page: number;
}

interface Props {
  filters: EventFiltersState;
  onChange: Dispatch<SetStateAction<EventFiltersState>>;
  /** Live result count — marketplace pattern (show how many match) */
  resultCount?: number;
  isLoading?: boolean;
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'HIKE', label: 'Hike' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'PRIVATE', label: 'Private' },
  { value: 'TRAINING', label: 'Training' },
] as const;

const DIFFICULTIES = [
  { value: '', label: 'All levels' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'ADVANCED', label: 'Advanced' },
] as const;

/**
 * Unified discovery bar — Airbnb / GetYourGuide style:
 * one surface, chip filters (not native selects), no duplicated difficulty.
 */
export function EventFilters({
  filters,
  onChange,
  resultCount,
  isLoading,
}: Props) {
  const router = useRouter();
  const hasActive =
    !!filters.category || !!filters.difficulty || !!filters.search.trim();

  const setFilter = (patch: Partial<EventFiltersState>) => {
    onChange((f) => ({ ...f, ...patch, page: 1 }));
    // Keep difficulty shareable via URL (homepage strip still deep-links here)
    if (patch.difficulty !== undefined) {
      const q = new URLSearchParams();
      if (patch.difficulty) q.set('difficulty', patch.difficulty);
      if (filters.search.trim()) q.set('search', filters.search.trim());
      const qs = q.toString();
      router.replace(qs ? `/events?${qs}` : '/events', { scroll: false });
    }
  };

  const clearAll = () => {
    onChange((f) => ({
      ...f,
      category: '',
      difficulty: '',
      search: '',
      page: 1,
    }));
    router.replace('/events', { scroll: false });
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_4px_16px_rgba(17,15,13,0.08)] ring-1 ring-neutral-200/80">
      {/* Search row — primary action, full width */}
      <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) =>
              onChange((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            placeholder="Where do you want to go?"
            className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-3 font-sans text-sm text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-0"
            aria-label="Search adventures"
          />
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 font-sans text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Chip facets — single row of meaning, not two competing UIs */}
      <div className="space-y-3 px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="shrink-0 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Trail type
          </span>
          <div
            className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="listbox"
            aria-label="Category"
          >
            {CATEGORIES.map(({ value, label }) => {
              const active = filters.category === value;
              return (
                <button
                  key={label}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setFilter({ category: value })}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 font-sans text-sm font-medium transition-colors',
                    active
                      ? 'bg-forest text-neutral-50'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-ink',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="shrink-0 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Level
          </span>
          <div
            className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="listbox"
            aria-label="Difficulty"
          >
            {DIFFICULTIES.map(({ value, label }) => {
              const active = filters.difficulty === value;
              return (
                <button
                  key={label}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setFilter({ difficulty: value })}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 font-sans text-sm font-medium transition-colors',
                    active
                      ? 'bg-ink text-neutral-50'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-ink',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result count — Algolia/Airbnb: always show how many match */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
          <p className="font-sans text-sm text-neutral-600">
            {isLoading ? (
              <span className="text-neutral-400">Finding trails…</span>
            ) : resultCount != null ? (
              <>
                <span className="font-semibold text-ink">{resultCount}</span>
                {resultCount === 1 ? ' adventure' : ' adventures'}
                {hasActive ? ' match' : ' to explore'}
              </>
            ) : (
              <span className="text-neutral-400">Browse adventures</span>
            )}
          </p>
          {hasActive && resultCount === 0 && !isLoading && (
            <button
              type="button"
              onClick={clearAll}
              className="font-sans text-sm font-semibold text-forest hover:text-forest-hover"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
