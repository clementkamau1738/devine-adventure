'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Event } from '@/types';
import {
  formatKES,
  difficultyPillOnPhoto,
  difficultyLabel,
  destinationLabel,
  cn,
} from '@/lib/utils';
import { MpesaMark } from '@/components/payments/MpesaMark';
import { springSoft } from '@/lib/motion';

interface Props {
  event: Event;
  pricingOverride?: {
    finalPrice: number;
    isFreeForMember: boolean;
    reason: string;
  } | null;
}

/**
 * Homepage / listing card — soft lift on hover via Framer Motion.
 */
export function EventCard({ event, pricingOverride }: Props) {
  const reduce = useReducedMotion();
  const displayPrice = pricingOverride
    ? pricingOverride.finalPrice
    : Number(event.price);
  const showMember =
    event.memberPrice !== undefined &&
    event.memberPrice !== null &&
    !pricingOverride;

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <motion.article
        className={cn(
          'h-full overflow-hidden rounded-2xl bg-white',
          'shadow-[0_4px_16px_rgba(17,15,13,0.08)]',
        )}
        whileHover={
          reduce
            ? undefined
            : {
                y: -4,
                boxShadow: '0 12px 28px rgba(17, 15, 13, 0.12)',
              }
        }
        transition={springSoft}
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={
              event.images[0] ??
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            }
            alt={event.title}
            className="h-full w-full object-cover"
            whileHover={reduce ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {event.isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-sun px-2.5 py-1 text-[11px] font-bold text-ink">
              Featured
            </span>
          )}

          <span
            className={cn(
              'absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold',
              difficultyPillOnPhoto(event.difficulty),
            )}
          >
            {difficultyLabel(event.difficulty)}
          </span>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-2 font-display text-xl font-normal uppercase leading-tight tracking-normal text-ink transition-colors group-hover:text-forest">
            {event.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 font-sans text-sm text-neutral-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-forest" />
            <span className="truncate">
              {destinationLabel(event.location)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {pricingOverride && pricingOverride.finalPrice === 0 ? (
              <span className="font-sans text-sm font-semibold text-forest">
                Free with membership
              </span>
            ) : (
              <>
                <span className="font-display text-2xl font-normal tracking-normal text-ink">
                  {formatKES(displayPrice)}
                </span>
                {displayPrice > 0 && <MpesaMark />}
              </>
            )}
          </div>

          {showMember && (
            <p className="mt-1 font-sans text-sm text-forest">
              {Number(event.memberPrice) === 0
                ? 'Free for members'
                : `${formatKES(Number(event.memberPrice))} for members`}
            </p>
          )}
          {pricingOverride &&
            pricingOverride.finalPrice > 0 &&
            pricingOverride.finalPrice < event.price && (
              <p className="mt-1 font-sans text-sm text-forest">
                {pricingOverride.reason}
              </p>
            )}
        </div>
      </motion.article>
    </Link>
  );
}
