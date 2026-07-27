'use client';
import { Search, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export interface EventFiltersState {
  category: string;
  difficulty: string;
  search: string;
  page: number;
}

interface Props {
  filters: EventFiltersState;
  onChange: Dispatch<SetStateAction<EventFiltersState>>;
}

const CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'HIKE', label: 'Hike' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'PRIVATE', label: 'Private' },
  { value: 'TRAINING', label: 'Training' },
];

const DIFFICULTIES = [
  { value: '', label: 'All levels' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

const selectClass =
  'w-full sm:w-auto bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-forest transition-colors font-sans';

export function EventFilters({ filters, onChange }: Props) {
  const hasActiveFilters =
    filters.category || filters.difficulty || filters.search;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            onChange((f) => ({ ...f, search: e.target.value, page: 1 }))
          }
          placeholder="Search by name, location, or description"
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-ink placeholder-neutral-400 focus:outline-none focus:border-forest transition-colors font-sans"
        />
      </div>

      <select
        value={filters.category}
        onChange={(e) =>
          onChange((f) => ({ ...f, category: e.target.value, page: 1 }))
        }
        className={selectClass}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={filters.difficulty}
        onChange={(e) =>
          onChange((f) => ({ ...f, difficulty: e.target.value, page: 1 }))
        }
        className={selectClass}
      >
        {DIFFICULTIES.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() =>
            onChange((f) => ({
              ...f,
              category: '',
              difficulty: '',
              search: '',
              page: 1,
            }))
          }
          className="flex items-center justify-center gap-1.5 text-neutral-500 hover:text-forest text-sm px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 transition-colors font-sans"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
}
