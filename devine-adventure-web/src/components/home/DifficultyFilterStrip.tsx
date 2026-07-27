'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: '', label: 'All' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'ADVANCED', label: 'Advanced' },
] as const;

/**
 * Segmented difficulty filter under the hero (branding §11.2).
 * Active state uses forest. Navigates into /events with ?difficulty=.
 */
export function DifficultyFilterStrip({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onEventsList =
    pathname === '/events' || pathname === '/events/';
  // Only show forest active state on the events list (not homepage discovery strip)
  const activeDifficulty = onEventsList
    ? (searchParams.get('difficulty') ?? '')
    : null;

  return (
    <section
      className={cn(
        'border-y border-neutral-200 bg-neutral-100 backdrop-blur-sm',
        className,
      )}
      aria-label="Filter adventures by difficulty"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <span className="text-neutral-500 text-xs font-semibold tracking-widest uppercase shrink-0">
          Difficulty
        </span>
        <div
          className="flex flex-wrap gap-2"
          role="listbox"
          aria-label="Difficulty level"
        >
          {OPTIONS.map(({ value, label }) => {
            const href = value
              ? `/events?difficulty=${value}`
              : '/events';
            const isActive =
              activeDifficulty !== null && activeDifficulty === value;
            return (
              <Link
                key={label}
                href={href}
                role="option"
                aria-selected={isActive}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ease-out',
                  isActive
                    ? 'bg-forest text-neutral-50'
                    : 'border border-neutral-200 text-neutral-600 hover:border-forest/50 hover:text-ink',
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
