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
  'bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-forest transition-colors';

export function EventFilters({ filters, onChange }: Props) {
  const hasActiveFilters =
    filters.category || filters.difficulty || filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            onChange((f) => ({ ...f, search: e.target.value, page: 1 }))
          }
          placeholder="Search by name, location, or description"
          className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-11 pr-4 py-3 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-forest transition-colors"
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
          onClick={() =>
            onChange((f) => ({
              ...f,
              category: '',
              difficulty: '',
              search: '',
              page: 1,
            }))
          }
          className="flex items-center justify-center gap-1.5 text-stone-400 hover:text-white text-sm px-4 py-3 rounded-xl border border-stone-800 hover:border-stone-600 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
}
