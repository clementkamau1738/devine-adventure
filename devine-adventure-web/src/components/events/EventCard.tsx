import Link from 'next/link';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import {
  formatEventDate,
  formatKES,
  difficultyColor,
  categoryIcon,
  capacityPercent,
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

export function EventCard({ event, pricingOverride }: Props) {
  const spotsLeft = event.capacity - event.enrolled;
  const fillPct = capacityPercent(event.enrolled, event.capacity);
  const isAlmostFull = fillPct >= 80;

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-forest/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              event.images[0] ??
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
            }
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              {categoryIcon(event.category)} {event.category}
            </span>
          </div>

          {/* Featured — sole sun highlight on card (badge-featured) */}
          {event.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="bg-sun text-ink text-xs font-bold px-2.5 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* Capacity warning — badge-limited / clay */}
          {isAlmostFull && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-clay text-neutral-50 text-xs font-semibold px-2.5 py-1 rounded-full">
                {spotsLeft} spots left
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Difficulty — unified pill (same treatment as category chips) */}
          <span
            className={cn(
              'inline-block text-xs font-semibold px-2.5 py-1 rounded-full',
              difficultyColor(event.difficulty),
            )}
          >
            {event.difficulty}
          </span>

          <h3 className="text-ink font-bold text-lg mt-2 mb-1 line-clamp-1 group-hover:text-forest transition-colors">
            {event.title}
          </h3>

          <div className="flex items-center gap-1 text-neutral-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatEventDate(event.dateTime)}</span>
          </div>

          {/* Capacity bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {event.enrolled} booked
              </span>
              <span>{spotsLeft} left</span>
            </div>
            <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  fillPct >= 90 ? 'bg-clay' : 'bg-forest',
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          {/* Price + M-Pesa trust + CTA */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              {pricingOverride ? (
                <div>
                  {pricingOverride.finalPrice === 0 ? (
                    <span className="text-forest font-bold">
                      Free with membership
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-normal tracking-normal text-ink">
                        {formatKES(pricingOverride.finalPrice)}
                      </span>
                      {pricingOverride.finalPrice < event.price && (
                        <span className="text-neutral-500 line-through text-sm">
                          {formatKES(event.price)}
                        </span>
                      )}
                      <MpesaMark />
                    </div>
                  )}
                  <div className="text-xs text-neutral-500">
                    {pricingOverride.reason}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-normal tracking-normal text-ink text-lg">
                      {formatKES(event.price)}
                    </span>
                    {Number(event.price) > 0 && <MpesaMark />}
                  </div>
                  {event.memberPrice !== undefined &&
                    event.memberPrice !== null && (
                      <div className="text-xs text-forest">
                        {Number(event.memberPrice) === 0
                          ? 'Free for members'
                          : `${formatKES(Number(event.memberPrice))} for members`}
                      </div>
                    )}
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-forest transition-colors shrink-0" />
          </div>
        </div>
      </article>
    </Link>
  );
}
