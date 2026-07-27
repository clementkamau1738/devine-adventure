import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function BookingCancelPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-5">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-display text-3xl font-black text-white mb-2">
            Payment Cancelled
          </h1>
          <p className="text-stone-400 mb-8">
            No charge was made. Your booking is still saved as pending — you
            can pick up where you left off from your dashboard.
          </p>

          <div className="flex gap-3">
            <Link
              href="/dashboard/bookings"
              className="flex-1 text-center border border-stone-700 text-stone-200 font-semibold py-3 rounded-xl hover:border-stone-500 transition-colors"
            >
              My Bookings
            </Link>
            <Link
              href="/events"
              className="flex-1 text-center bg-forest text-neutral-50 font-bold py-3 rounded-xl hover:bg-forest-hover transition-colors"
            >
              Browse Adventures
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
