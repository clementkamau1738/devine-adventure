'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useBookingByRef } from '@/hooks/useBookings';
import { formatEventDate, formatKES } from '@/lib/utils';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') ?? '';
  const { data: booking, isLoading, isError } = useBookingByRef(ref);

  if (!ref || isError) {
    return (
      <div className="max-w-lg mx-auto px-6 text-center py-20">
        <div className="text-ink font-semibold mb-2">
          We couldn&apos;t find that booking
        </div>
        <p className="text-neutral-500 text-sm mb-8">
          Check your dashboard for your latest bookings.
        </p>
        <Link
          href="/dashboard/bookings"
          className="inline-block bg-forest text-neutral-50 font-bold px-6 py-3 rounded-full hover:bg-forest-hover transition-colors text-sm"
        >
          Go to My Bookings
        </Link>
      </div>
    );
  }

  if (isLoading || !booking) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center text-neutral-500">
        Loading your booking...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-forest/10 rounded-full mb-5">
          <CheckCircle className="w-8 h-8 text-forest" />
        </div>
        <h1 className="font-display text-3xl font-normal text-ink mb-2 uppercase tracking-normal">
          Booking Confirmed
        </h1>
        <p className="text-neutral-500">
          A confirmation has been sent to your email.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
          <span className="text-neutral-500 text-sm">Reference</span>
          <span className="text-forest font-mono font-semibold">
            {booking.referenceCode}
          </span>
        </div>

        {booking.event && (
          <div className="mb-4">
            <div className="text-ink font-bold text-lg mb-2">
              {booking.event.title}
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-1.5">
              <MapPin className="w-3.5 h-3.5" /> {booking.event.location}
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
              <Clock className="w-3.5 h-3.5" />{' '}
              {formatEventDate(booking.event.dateTime)}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <span className="text-neutral-500 text-sm">Status</span>
          <span className="text-forest text-sm font-semibold">
            {booking.status}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-neutral-500 text-sm">Amount Paid</span>
          <span className="font-display font-normal tracking-normal text-ink">
            {formatKES(booking.totalAmount)}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href="/dashboard/bookings"
          className="flex-1 text-center border border-neutral-200 text-neutral-700 font-semibold py-3 rounded-xl hover:border-neutral-300 transition-colors"
        >
          My Bookings
        </Link>
        <Link
          href="/events"
          className="flex-1 flex items-center justify-center gap-2 bg-forest text-neutral-50 font-bold py-3 rounded-xl hover:bg-forest-hover transition-colors"
        >
          More Adventures <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Suspense
          fallback={
            <div className="max-w-lg mx-auto px-6 py-20 text-center text-neutral-500">
              Loading...
            </div>
          }
        >
          <BookingSuccessContent />
        </Suspense>
      </main>
    </>
  );
}
