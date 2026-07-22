'use client';
import { useAuthStore } from '@/store/auth.store';
import { useUserBookings } from '@/hooks/useBookings';
import { useMySubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { formatEventDate, formatKES } from '@/lib/utils';
import { Calendar, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';

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

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: bookingsData } = useUserBookings();
  const { data: subscription } = useMySubscription();

  const bookings = bookingsData ?? [];
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED');
  const upcoming = confirmed.filter(
    (b) => b.event && new Date(b.event.dateTime) > new Date(),
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white font-display">
          Welcome back, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-stone-400 mt-1">Here&apos;s your adventure summary</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {[
          {
            label: 'Total Bookings',
            value: bookings.length,
            icon: Calendar,
            color: 'text-blue-400',
          },
          {
            label: 'Upcoming Trips',
            value: upcoming.length,
            icon: Calendar,
            color: 'text-amber-400',
          },
          {
            label: 'Membership',
            value:
              subscription?.status === 'ACTIVE'
                ? subscription.planType
                : 'None',
            icon: CreditCard,
            color:
              subscription?.status === 'ACTIVE'
                ? 'text-emerald-400'
                : 'text-stone-500',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-5"
          >
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-stone-500 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Membership status */}
      {subscription?.status === 'ACTIVE' ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <div className="text-emerald-400 font-semibold">
              Active {subscription.planType.toLowerCase()} membership
            </div>
            <div className="text-stone-400 text-sm mt-1">
              Expires{' '}
              {new Date(subscription.endDate).toLocaleDateString('en-KE', {
                dateStyle: 'long',
              })}
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="text-emerald-400 text-sm underline"
          >
            Manage
          </Link>
        </div>
      ) : (
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <div className="text-amber-400 font-semibold">
              Become a member
            </div>
            <div className="text-stone-400 text-sm mt-1">
              Get discounts and free access to selected hikes
            </div>
          </div>
          <Link
            href="/membership"
            className="bg-amber-400 text-stone-950 font-bold px-5 py-2 rounded-full text-sm hover:bg-amber-300 transition-colors"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-amber-400 text-sm">
            View all →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🏔️</div>
            <div className="text-white font-semibold mb-2">
              No adventures yet
            </div>
            <div className="text-stone-400 text-sm mb-6">
              Your bookings will appear here
            </div>
            <Link
              href="/events"
              className="inline-block bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-full hover:bg-amber-300 transition-colors text-sm"
            >
              Explore Adventures
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center gap-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    b.event?.images?.[0] ??
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80'
                  }
                  alt={b.event?.title ?? 'Adventure'}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    {b.event?.title}
                  </div>
                  <div className="text-stone-400 text-xs">
                    {b.event?.dateTime ? formatEventDate(b.event.dateTime) : '—'}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    {statusIcon[b.status]}
                    <span
                      className={`text-xs font-semibold ${statusColor[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-stone-400 text-xs mt-1">
                    {formatKES(b.totalAmount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
