import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { Event } from '@/types';
import {
  formatKES,
  difficultyColor,
  capacityPercent,
  cn,
  destinationLabel,
} from '@/lib/utils';
import { MpesaMark } from '@/components/payments/MpesaMark';

interface Props {
  event: Event;
  pricingOverride?: {
    finalPrice: number;
    isFreeForMember: boolean;
    reason: string;
  } | null;
}

/**
 * Popular-place style card: inset photo, title, location + meta chip.
 * Visual pattern from design ref; Devine tokens + real event data only.
 */
export function EventCard({ event, pricingOverride }: Props) {
  const spotsLeft = event.capacity - event.enrolled;
  const fillPct = capacityPercent(event.enrolled, event.capacity);
  const isAlmostFull = fillPct >= 80;

  const priceNode = (() => {
    if (pricingOverride) {
      if (pricingOverride.finalPrice === 0) {
        return (
          <span className="text-forest font-semibold text-sm">
            Free with membership
          </span>
        );
      }
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-base font-normal tracking-normal text-ink">
            {formatKES(pricingOverride.finalPrice)}
          </span>
          {pricingOverride.finalPrice < event.price && (
            <span className="text-neutral-400 line-through text-xs">
              {formatKES(event.price)}
            </span>
          )}
          <MpesaMark />
        </div>
      );
    }
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-base font-normal tracking-normal text-ink">
          {formatKES(event.price)}
        </span>
        {Number(event.price) > 0 && <MpesaMark />}
        {event.memberPrice !== undefined && event.memberPrice !== null && (
          <span className="text-xs text-forest w-full">
            {Number(event.memberPrice) === 0
              ? 'Free for members'
              : `${formatKES(Number(event.memberPrice))} for members`}
          </span>
        )}
      </div>
    );
  })();

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article
        className={cn(
          'h-full bg-white rounded-3xl p-3',
          'shadow-[0_8px_30px_rgba(17,15,13,0.06)] border border-neutral-100',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(17,15,13,0.1)]',
        )}
      >
        {/* Inset rounded image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              event.images[0] ??
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
            }
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />

          {event.isFeatured && (
            <span className="absolute top-3 left-3 bg-sun text-ink text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Featured
            </span>
          )}

          {isAlmostFull && (
            <span className="absolute top-3 right-3 bg-clay text-neutral-50 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {spotsLeft} left
            </span>
          )}
        </div>

        {/* Body — matches Popular Place: title, then location + right meta */}
        <div className="px-1.5 pt-4 pb-2">
          <h3 className="text-ink font-semibold text-[15px] leading-snug line-clamp-1 group-hover:text-forest transition-colors">
            {event.title}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 min-w-0 text-neutral-500 text-sm">
              <MapPin className="w-3.5 h-3.5 text-forest shrink-0" />
              <span className="truncate">
                {destinationLabel(event.location)}
              </span>
            </div>

            {/* Meta chip — difficulty (star-style placement from the ref) */}
            <span
              className={cn(
                'shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                difficultyColor(event.difficulty),
              )}
            >
              {event.difficulty === 'BEGINNER' && (
                <Star className="w-3 h-3 fill-current" />
              )}
              {event.difficulty.charAt(0) +
                event.difficulty.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-100">{priceNode}</div>
        </div>
      </article>
    </Link>
  );
}
