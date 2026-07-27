'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatKES, getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Subscription, User } from '@/types';

interface AdminSubscription extends Subscription {
  user: Pick<User, 'name' | 'email'>;
}

export default function AdminSubscriptionsPage() {
  const [status, setStatus] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'subscriptions', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const { data } = await api.get(`/admin/subscriptions${params}`);
      return data.data as AdminSubscription[];
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/admin/subscriptions/${id}/cancel`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subscriptions'] });
      toast.success('Subscription cancelled');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Cancel failed')),
  });

  const subscriptions = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-normal text-ink font-display uppercase tracking-normal">
            Subscriptions
          </h1>
          <p className="text-neutral-500 mt-1">
            {subscriptions.length} subscriptions
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-forest"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              {['User', 'Plan', 'Amount', 'Status', 'Started', 'Expires', 'Actions'].map(
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-neutral-500">
                  Loading...
                </td>
              </tr>
            ) : (
              subscriptions.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">
                    <div className="text-ink text-xs font-medium">
                      {s.user.name}
                    </div>
                    <div className="text-neutral-500 text-xs">{s.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 text-xs capitalize">
                    {s.planType.toLowerCase()}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatKES(s.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        s.status === 'ACTIVE'
                          ? 'bg-forest/15 text-forest border border-forest/30'
                          : s.status === 'EXPIRED'
                            ? 'bg-neutral-200 text-neutral-500 border border-neutral-300'
                            : 'bg-clay/15 text-clay border border-clay/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {new Date(s.startDate).toLocaleDateString('en-KE')}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {new Date(s.endDate).toLocaleDateString('en-KE')}
                  </td>
                  <td className="px-4 py-3">
                    {s.status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          if (confirm('Cancel this subscription?'))
                            cancelSubscription.mutate(s.id);
                        }}
                        className="text-clay text-xs hover:underline"
                      >
                        Cancel
                      </button>
                    )}
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
