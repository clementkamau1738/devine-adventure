'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatKES } from '@/lib/utils';
import { TrendingUp, Smartphone, CreditCard } from 'lucide-react';

interface RevenueByMethod {
  method: 'MPESA' | 'CARD';
  _sum: { amount: number | null };
  _count: number;
}

interface RevenuePayment {
  id: string;
  amount: number;
  method: 'MPESA' | 'CARD';
  transactionRef: string;
  createdAt: string;
  booking: { event: { title: string; category: string } } | null;
}

interface RevenueAnalytics {
  total: number;
  byMethod: RevenueByMethod[];
  payments: RevenuePayment[];
}

const methodIcon = { MPESA: Smartphone, CARD: CreditCard };
const methodLabel = { MPESA: 'M-Pesa', CARD: 'Card' };

export default function AdminRevenuePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'revenue', from, to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const { data } = await api.get(`/admin/revenue?${params.toString()}`);
      return data.data as RevenueAnalytics;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-normal text-ink font-display uppercase tracking-normal">
            Revenue
          </h1>
          <p className="text-neutral-500 mt-1">Payment analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-forest"
          />
          <span className="text-neutral-500 text-sm">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {isLoading || !data ? (
        <div className="text-neutral-500">Loading...</div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-forest/15 to-forest/5 border border-forest/25 rounded-2xl p-6 mb-8 flex items-center gap-6">
            <TrendingUp className="w-10 h-10 text-forest flex-shrink-0" />
            <div>
              <div className="text-neutral-500 text-sm mb-1">
                Total Revenue{from || to ? ' (filtered)' : ''}
              </div>
              <div className="font-display text-4xl font-normal tracking-normal text-ink">
                {formatKES(data.total)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {data.byMethod.map((m) => {
              const Icon = methodIcon[m.method];
              return (
                <div
                  key={m.method}
                  className="bg-white border border-neutral-200 rounded-2xl p-5"
                >
                  <Icon className="w-5 h-5 text-forest mb-3" />
                  <div className="text-2xl font-black text-ink">
                    {formatKES(Number(m._sum.amount ?? 0))}
                  </div>
                  <div className="text-neutral-500 text-sm">
                    {methodLabel[m.method]} · {m._count} payments
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  {['Event', 'Method', 'Reference', 'Amount', 'Date'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-neutral-500 font-medium px-4 py-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-neutral-500"
                    >
                      No payments in this range
                    </td>
                  </tr>
                ) : (
                  data.payments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-neutral-200 hover:bg-neutral-50"
                    >
                      <td className="px-4 py-3 text-neutral-600 text-xs line-clamp-1">
                        {p.booking?.event.title ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 text-xs">
                        {methodLabel[p.method]}
                      </td>
                      <td className="px-4 py-3 font-mono text-forest text-xs">
                        {p.transactionRef}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {formatKES(Number(p.amount))}
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        {new Date(p.createdAt).toLocaleDateString('en-KE')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
