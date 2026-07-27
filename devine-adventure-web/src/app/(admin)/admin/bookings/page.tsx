'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Download } from 'lucide-react';
import { formatKES } from '@/lib/utils';
import { Booking, User, Event } from '@/types';

interface AdminBooking extends Booking {
  user: Pick<User, 'name' | 'email'>;
  event: Event;
}

interface AdminBookingsResponse {
  bookings: AdminBooking[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function AdminBookingsPage() {
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'bookings', status],
    queryFn: async () => {
      const params = status ? `?status=${status}&limit=100` : '?limit=100';
      const { data } = await api.get(`/admin/bookings${params}`);
      return data.data as AdminBookingsResponse;
    },
  });

  const handleExport = async () => {
    const { data } = await api.get('/admin/bookings/export');
    const rows: Record<string, unknown>[] = data.data;
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${r[h] ?? ''}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white font-display">
            Bookings
          </h1>
          <p className="text-stone-400 mt-1">
            {data?.meta?.total ?? 0} total bookings
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl hover:border-stone-500 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800">
              {[
                'Reference',
                'User',
                'Event',
                'Amount',
                'Status',
                'Payment',
                'Booked',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-stone-400 font-medium px-4 py-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-stone-500">
                  Loading...
                </td>
              </tr>
            ) : (
              data?.bookings?.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-stone-800/50 hover:bg-stone-800/30"
                >
                  <td className="px-4 py-3 font-mono text-amber-400 text-xs">
                    {b.referenceCode}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white text-xs font-medium">
                      {b.user.name}
                    </div>
                    <div className="text-stone-500 text-xs">
                      {b.user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-300 text-xs line-clamp-1">
                    {b.event.title}
                  </td>
                  <td className="px-4 py-3 text-stone-300">
                    {formatKES(b.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED'
                          ? 'bg-forest/15 text-forest border border-forest/30'
                          : b.status === 'PENDING'
                            ? 'bg-ink text-sun border border-sun/25'
                            : 'bg-clay/15 text-clay border border-clay/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold ${
                        b.paymentStatus === 'PAID'
                          ? 'text-forest'
                          : b.paymentStatus === 'FAILED'
                            ? 'text-clay'
                            : 'text-sun'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {new Date(b.createdAt).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
