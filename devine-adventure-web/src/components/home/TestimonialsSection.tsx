'use client';

import { useEffect, useState } from 'react';
import { nextTestimonialIndex } from '@/lib/destinations';

export const TESTIMONIALS = [
  {
    name: 'Wanjiru Kamau',
    role: 'Annual Member',
    quote:
      'The Mt. Kenya summit trip was the best-organized hike I have ever done. Professional guides, great gear, and the member discount made it a no-brainer.',
  },
  {
    name: 'Brian Otieno',
    role: 'Quarterly Member',
    quote:
      'I booked the Hell’s Gate cycling trip on a whim and now I’m hooked. The booking flow is so smooth — M-Pesa payment took thirty seconds.',
  },
  {
    name: 'Amina Yusuf',
    role: 'First-time Guest',
    quote:
      'Loved the sunrise hike at Ngong Hills. Beginner-friendly like they promised, and the crew made sure nobody was left behind.',
  },
] as const;

const BAND_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600';

/**
 * Single full-bleed mood band — one rotating pull-quote (not a 3-card grid).
 */
export function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => nextTestimonialIndex(i, TESTIMONIALS.length));
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const t = TESTIMONIALS[index] ?? TESTIMONIALS[0];

  return (
    <section
      className="relative min-h-[420px] md:min-h-[480px] flex items-center justify-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Member stories"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BAND_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Warm ink scrim — not a color wash */}
      <div
        className="absolute inset-0 bg-ink/55"
        aria-hidden
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
        <blockquote>
          <p className="font-atmospheric text-2xl sm:text-3xl md:text-4xl font-normal text-white leading-snug not-italic">
            &ldquo;{t.quote}&rdquo;
          </p>
          <footer className="mt-8 font-sans">
            <cite className="not-italic">
              <span className="block text-neutral-50 font-semibold text-sm">
                {t.name}
              </span>
              <span className="block text-neutral-50/80 text-xs mt-1">
                {t.role}
              </span>
            </cite>
          </footer>
        </blockquote>

        <div
          className="flex justify-center gap-2 mt-10"
          role="tablist"
          aria-label="Choose testimonial"
        >
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show quote from ${item.name}`}
              onClick={() => setIndex(i)}
              className={
                i === index
                  ? 'w-2.5 h-2.5 rounded-full bg-sun'
                  : 'w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white/70'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
