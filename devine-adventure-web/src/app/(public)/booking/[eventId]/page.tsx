'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/store/auth.store';
import { useBookingStore } from '@/store/booking.store';
import { useInitiateBooking } from '@/hooks/useBookings';
import { useEventPricing } from '@/hooks/useSubscription';
import { formatKES, getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BookingInitiatePage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { isAuthenticated } = useAuthStore();
  const { setBooking, setPricing } = useBookingStore();
  const router = useRouter();

  const { data: pricing, isLoading: pricingLoading } = useEventPricing(eventId);
  const { mutateAsync: initiate, isPending } = useInitiateBooking();

  useEffect(() => {
    if (!isAuthenticated) router.push(`/login?redirect=/booking/${eventId}`);
  }, [isAuthenticated, eventId, router]);

  const handleConfirm = async () => {
    try {
      const result = await initiate({ eventId });
      setBooking(result.booking);
      setPricing(result.pricing);

      if (!result.requiresPayment) {
        router.push(`/booking/success?ref=${result.booking.referenceCode}`);
      } else {
        router.push(`/booking/checkout`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Booking failed. Please try again.'));
    }
  };

  if (pricingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-400">
        Loading pricing...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <h1 className="font-display text-4xl font-black text-white mb-8">
            Confirm Booking
          </h1>

          {pricing && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6">
              <div className="text-stone-400 text-sm mb-1">Price breakdown</div>
              <div className="flex justify-between text-stone-300 mb-2">
                <span>Event price</span>
                <span>{formatKES(pricing.originalPrice)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-400 mb-2">
                  <span>{pricing.reason}</span>
                  <span>- {formatKES(pricing.discount)}</span>
                </div>
              )}
              <div className="border-t border-stone-700 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>
                  {pricing.finalPrice === 0
                    ? 'FREE'
                    : formatKES(pricing.finalPrice)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full bg-amber-400 text-stone-950 font-bold py-4 rounded-xl hover:bg-amber-300 disabled:opacity-50 transition-colors"
          >
            {isPending
              ? 'Processing...'
              : pricing?.finalPrice === 0
                ? 'Confirm (Free)'
                : 'Proceed to Payment'}
          </button>
        </div>
      </main>
    </>
  );
}
