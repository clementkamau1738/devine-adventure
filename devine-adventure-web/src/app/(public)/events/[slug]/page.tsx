'use client';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { useEvent } from '@/hooks/useEvents';
import { useEventPricing } from '@/hooks/useSubscription';
import { useAuthStore } from '@/store/auth.store';
import { formatEventDate, formatKES, difficultyColor, categoryIcon, cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { data: event, isLoading } = useEvent(slug);
  const { data: pricing } = useEventPricing(event?.id ?? '');

  if (isLoading) return <PageSkeleton />;
  if (!event) return <div>Event not found</div>;

  const spotsLeft = event.capacity - event.enrolled;
  const isFull = spotsLeft <= 0;

  const handleBook = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${slug}`);
      return;
    }
    router.push(`/booking/${event.id}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Hero image */}
        <div className="relative h-[50vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> All Adventures
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-20">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-2xl">{categoryIcon(event.category)}</span>
                <span
                  className={cn(
                    'text-sm font-semibold px-3 py-1 rounded-full',
                    difficultyColor(event.difficulty),
                  )}
                >
                  {event.difficulty}
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-6">
                {event.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: MapPin, label: 'Location', value: event.location },
                  {
                    icon: Clock,
                    label: 'Date & Time',
                    value: formatEventDate(event.dateTime),
                  },
                  {
                    icon: Users,
                    label: 'Availability',
                    value: `${spotsLeft} of ${event.capacity} spots left`,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-stone-900 border border-stone-800 rounded-xl p-4"
                  >
                    <Icon className="w-4 h-4 text-amber-400 mb-2" />
                    <div className="text-xs text-stone-500 mb-0.5">{label}</div>
                    <div className="text-stone-200 text-sm font-medium">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="prose prose-invert prose-stone max-w-none">
                <p className="text-stone-300 text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Booking card */}
            <div className="lg:col-span-1">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sticky top-28">
                <div className="mb-6">
                  {pricing ? (
                    <>
                      <div className="text-stone-400 text-sm mb-1">
                        {pricing.reason}
                      </div>
                      {pricing.finalPrice === 0 ? (
                        <div className="text-3xl font-black text-emerald-400">
                          Free
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-3">
                          <div className="text-3xl font-black text-white">
                            {formatKES(pricing.finalPrice)}
                          </div>
                          {pricing.discount > 0 && (
                            <div className="text-stone-500 line-through">
                              {formatKES(event.price)}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-black text-white">
                        {formatKES(event.price)}
                      </div>
                      {event.memberPrice !== null &&
                        event.memberPrice !== undefined && (
                          <div className="text-amber-400 text-sm mt-1">
                            {Number(event.memberPrice) === 0
                              ? '✓ Free with membership'
                              : `${formatKES(Number(event.memberPrice))} with membership`}
                          </div>
                        )}
                    </>
                  )}
                </div>

                {/* Capacity bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-stone-400 mb-2">
                    <span>{event.enrolled} booked</span>
                    <span>{spotsLeft} spots left</span>
                  </div>
                  <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${(event.enrolled / event.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={isFull}
                  className="w-full bg-amber-400 text-stone-950 font-bold py-4 rounded-xl hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isFull ? 'Fully Booked' : 'Book This Adventure'}
                </button>

                {!isAuthenticated && (
                  <p className="text-center text-stone-500 text-xs mt-4">
                    <Link href="/login" className="text-amber-400 underline">
                      Sign in
                    </Link>{' '}
                    to see member pricing
                  </p>
                )}

                {/* What's included */}
                <div className="mt-6 pt-6 border-t border-stone-800">
                  <div className="text-stone-400 text-sm font-medium mb-3">
                    What&apos;s included
                  </div>
                  {[
                    'Professional guide',
                    'Safety equipment',
                    'First aid support',
                    'Certificate of completion',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-stone-300 text-sm mb-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen pt-20 animate-pulse">
      <div className="h-[50vh] bg-stone-800" />
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-stone-800 rounded w-1/4" />
          <div className="h-12 bg-stone-800 rounded w-3/4" />
          <div className="h-48 bg-stone-800 rounded" />
        </div>
        <div className="h-80 bg-stone-800 rounded-2xl" />
      </div>
    </div>
  );
}
