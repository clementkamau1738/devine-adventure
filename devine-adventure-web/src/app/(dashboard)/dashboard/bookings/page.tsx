'use client';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useUserBookings, useCancelBooking } from '@/hooks/useBookings';
import { formatEventDate, formatKES, getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusIcon = {
  CONFIRMED: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  PENDING: <Clock className="w-4 h-4 text-amber-400" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-400" />,
};

const statusColor = {
  CONFIRMED: 'text-emerald-400',
  PENDING: 'text-amber-400',
  CANCELLED: 'text-red-400',
};

export default function DashboardBookingsPage() {
  const { data: bookingsData, isLoading } = useUserBookings();
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const bookings = bookingsData ?? [];

  const handleCancel = (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    cancelBooking(id, {
      onSuccess: () => toast.success('Booking cancelled'),
      onError: (err) => toast.error(getApiErrorMessage(err, 'Could not cancel booking')),
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white font-display">
          My Bookings
        </h1>
        <p className="text-stone-400 mt-1">{bookings.length} total bookings</p>
      </div>

      {isLoading ? (
        <div className="text-stone-400">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🏔️</div>
          <div className="text-white font-semibold mb-2">No bookings yet</div>
          <Link
            href="/events"
            className="inline-block bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-full hover:bg-amber-300 transition-colors text-sm mt-4"
          >
            Explore Adventures
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex items-center gap-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  b.event?.images?.[0] ??
                  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100'
                }
                alt={b.event?.title ?? 'Adventure'}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {b.event?.title}
                </div>
                <div className="text-stone-400 text-sm">
                  {b.event?.dateTime ? formatEventDate(b.event.dateTime) : '—'}
                </div>
                <div className="text-stone-500 text-xs font-mono mt-1">
                  {b.referenceCode}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 justify-end mb-1">
                  {statusIcon[b.status]}
                  <span className={`text-xs font-semibold ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-stone-300 text-sm font-semibold">
                  {formatKES(b.totalAmount)}
                </div>
                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={isPending}
                    className="text-red-400 text-xs hover:underline mt-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
