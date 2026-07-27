'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatKES } from '@/lib/utils';
import { Users, Calendar, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';
import { Booking, Event, User } from '@/types';

interface AdminKpis {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

interface AdminBookingSummary extends Booking {
  user: Pick<User, 'name' | 'email'>;
  event: Event;
}

interface AdminDashboardData {
  kpis: AdminKpis;
  recentBookings: AdminBookingSummary[];
  upcomingEvents: Event[];
}

function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data.data as AdminDashboardData;
    },
    refetchInterval: 30000,
  });
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return <div className="text-stone-400">Loading dashboard...</div>;
  }

  const { kpis, recentBookings, upcomingEvents } = data;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-normal text-white font-display uppercase tracking-normal">
          Dashboard
        </h1>
        <p className="text-stone-400 mt-1">Platform overview — live data</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          {
            label: 'Total Users',
            value: kpis.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-forest',
          },
          {
            label: 'Published Events',
            value: kpis.totalEvents.toLocaleString(),
            icon: Calendar,
            color: 'text-forest',
          },
          {
            label: 'Confirmed Bookings',
            value: kpis.totalBookings.toLocaleString(),
            icon: CheckCircle,
            color: 'text-forest',
          },
          {
            label: 'Active Members',
            value: kpis.activeSubscriptions.toLocaleString(),
            icon: CreditCard,
            color: 'text-forest',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-stone-900 border border-neutral-700 rounded-2xl p-5"
          >
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-stone-500 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Revenue highlight */}
      <div className="bg-gradient-to-r from-forest/15 to-forest/5 border border-forest/25 rounded-2xl p-6 mb-10 flex items-center gap-6">
        <TrendingUp className="w-10 h-10 text-forest flex-shrink-0" />
        <div>
          <div className="text-stone-400 text-sm mb-1">
            Total Revenue (All Time)
          </div>
          <div className="font-display text-4xl font-normal tracking-normal text-white">
            {formatKES(kpis.totalRevenue)}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent bookings */}
        <div>
          <h2 className="text-white font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-white text-sm font-semibold">
                    {b.user.name}
                  </div>
                  <div className="text-stone-400 text-xs">{b.event.title}</div>
                  <div className="text-stone-500 text-xs font-mono mt-0.5">
                    {b.referenceCode}
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    b.status === 'CONFIRMED'
                      ? 'bg-forest/15 text-forest border border-forest/30'
                      : b.status === 'PENDING'
                        ? 'bg-ink text-sun border border-sun/25'
                        : 'bg-clay/15 text-clay border border-clay/30'
                  }`}
                >
                  {b.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div>
          <h2 className="text-white font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {upcomingEvents.map((e) => {
              const fill = Math.round((e.enrolled / e.capacity) * 100);
              return (
                <div
                  key={e.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm font-semibold">
                      {e.title}
                    </div>
                    <div className="text-stone-400 text-xs">
                      {new Date(e.dateTime).toLocaleDateString('en-KE')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest rounded-full"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                    <div className="text-stone-400 text-xs">
                      {e.enrolled}/{e.capacity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
