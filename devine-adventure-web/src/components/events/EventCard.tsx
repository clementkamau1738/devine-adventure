import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Event } from '@/types';
import {
  formatKES,
  difficultyPillOnPhoto,
  difficultyLabel,
  destinationLabel,
  cn,
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
 * Homepage / listing card — matches hero elevation language:
 * soft shadow (no hard border), full-bleed photo, Anton title & price.
 */
export function EventCard({ event, pricingOverride }: Props) {
  const displayPrice = pricingOverride
    ? pricingOverride.finalPrice
    : Number(event.price);
  const showMember =
    event.memberPrice !== undefined &&
    event.memberPrice !== null &&
    !pricingOverride;

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article
        className={cn(
          'h-full bg-white rounded-2xl overflow-hidden',
          'shadow-[0_4px_16px_rgba(17,15,13,0.08)]',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,15,13,0.1)]',
        )}
      >
        {/* Full-bleed photo */}
        <div className="relative aspect-[16/11] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              event.images[0] ??
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            }
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />

          {event.isFeatured && (
            <span className="absolute top-3 left-3 bg-sun text-ink text-[11px] font-bold px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}

          <span
            className={cn(
              'absolute bottom-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full',
              difficultyPillOnPhoto(event.difficulty),
            )}
          >
            {difficultyLabel(event.difficulty)}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-display text-xl font-normal uppercase tracking-normal text-ink line-clamp-2 group-hover:text-forest transition-colors leading-tight">
            {event.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-neutral-500 text-sm font-sans">
            <MapPin className="w-3.5 h-3.5 text-forest shrink-0" />
            <span className="truncate">
              {destinationLabel(event.location)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {pricingOverride && pricingOverride.finalPrice === 0 ? (
              <span className="text-forest font-semibold text-sm font-sans">
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
            <p className="mt-1 text-sm text-forest font-sans">
              {Number(event.memberPrice) === 0
                ? 'Free for members'
                : `${formatKES(Number(event.memberPrice))} for members`}
            </p>
          )}
          {pricingOverride &&
            pricingOverride.finalPrice > 0 &&
            pricingOverride.finalPrice < event.price && (
              <p className="mt-1 text-sm text-forest font-sans">
                {pricingOverride.reason}
              </p>
            )}
        </div>
      </article>
    </Link>
  );
}
