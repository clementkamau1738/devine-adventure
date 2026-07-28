'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeUp, Stagger, StaggerItem, motion, useReducedMotion } from '@/components/motion/Motion';
import { springSoft } from '@/lib/motion';

/**
 * Homepage “find your pace” — discovery tiles, not an admin filter bar.
 * Links into /events?difficulty=… (full filters live on Adventures).
 */
const LEVELS = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    blurb: 'Gentle trails, first hikes, and easy forest walks.',
    accent: 'bg-forest/10 text-forest ring-forest/20',
    dot: 'bg-forest',
  },
  {
    value: 'MODERATE',
    label: 'Moderate',
    blurb: 'Ridges, longer days, and a solid workout.',
    accent: 'bg-sun/20 text-ink ring-sun/40',
    dot: 'bg-sun',
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    blurb: 'Steep summits, night trails, and big days out.',
    accent: 'bg-clay/10 text-clay ring-clay/25',
    dot: 'bg-clay',
  },
] as const;

export function DifficultyFilterStrip({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <section
      className={cn('border-y border-neutral-200/80 bg-white', className)}
      aria-label="Browse adventures by difficulty"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <FadeUp
          inView
          className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-forest sm:text-sm">
              Find your pace
            </span>
            <h2 className="font-display text-2xl font-normal uppercase tracking-normal text-ink sm:text-3xl">
              Browse by level
            </h2>
            <p className="mt-1.5 max-w-lg font-sans text-sm text-neutral-500">
              Pick a pace that fits — we&apos;ll show matching trails.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-forest hover:text-forest-hover"
          >
            See every adventure
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeUp>

        <Stagger
          className="grid gap-3 sm:grid-cols-3 sm:gap-4"
          inView
        >
          {LEVELS.map(({ value, label, blurb, accent, dot }) => (
            <StaggerItem key={value}>
              <motion.div
                whileHover={reduce ? undefined : { y: -3 }}
                transition={springSoft}
              >
                <Link
                  href={`/events?difficulty=${value}`}
                  className={cn(
                    'group flex h-full flex-col rounded-2xl p-5 ring-1 transition-shadow',
                    'hover:shadow-[0_8px_24px_rgba(17,15,13,0.08)]',
                    accent,
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-sans text-sm font-semibold">
                      <span className={cn('h-2.5 w-2.5 rounded-full', dot)} />
                      {label}
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-neutral-600">
                    {blurb}
                  </p>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
