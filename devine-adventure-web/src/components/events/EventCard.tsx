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
      <article className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/50">
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
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-stone-950/80 backdrop-blur-sm text-stone-200 text-xs font-medium px-2.5 py-1 rounded-full">
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

          <h3 className="text-white font-bold text-lg mt-2 mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
            {event.title}
          </h3>

          <div className="flex items-center gap-1 text-stone-400 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-400 text-sm mb-4">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatEventDate(event.dateTime)}</span>
          </div>

          {/* Capacity bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {event.enrolled} booked
              </span>
              <span>{spotsLeft} left</span>
            </div>
            <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  fillPct >= 90 ? 'bg-red-500' : 'bg-amber-400',
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              {pricingOverride ? (
                <div>
                  {pricingOverride.finalPrice === 0 ? (
                    <span className="text-emerald-400 font-bold">
                      Free with membership
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">
                        {formatKES(pricingOverride.finalPrice)}
                      </span>
                      {pricingOverride.finalPrice < event.price && (
                        <span className="text-stone-500 line-through text-sm">
                          {formatKES(event.price)}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-stone-500">
                    {pricingOverride.reason}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-white font-bold text-lg">
                    {formatKES(event.price)}
                  </span>
                  {event.memberPrice !== undefined &&
                    event.memberPrice !== null && (
                      <div className="text-xs text-amber-400">
                        {Number(event.memberPrice) === 0
                          ? 'Free for members'
                          : `${formatKES(Number(event.memberPrice))} for members`}
                      </div>
                    )}
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>
      </article>
    </Link>
  );
}
