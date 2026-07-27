'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { User } from '@/types';

interface AdminUser extends User {
  _count: { bookings: number; subscriptions: number };
}

interface AdminUsersResponse {
  users: AdminUser[];
  meta: { total: number; page: number };
}

const ROLES = ['GUEST', 'MEMBER', 'ADMIN'] as const;

export default function AdminUsersPage() {
  const [role, setRole] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', role],
    queryFn: async () => {
      const params = role ? `?role=${role}` : '';
      const { data } = await api.get(`/admin/users${params}`);
      return data.data as AdminUsersResponse;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await api.put(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Update failed')),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-normal text-ink font-display uppercase tracking-normal">Users</h1>
          <p className="text-neutral-500 mt-1">{data?.meta?.total ?? 0} total users</p>
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-forest"
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              {['User', 'Contact', 'Role', 'Activity', 'Joined'].map((h) => (
                <th
                  key={h}
                  className="text-left text-neutral-500 font-medium px-5 py-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-neutral-500">
                  Loading...
                </td>
              </tr>
            ) : (
              data?.users?.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-5 py-4">
                    <div className="text-ink font-medium">{u.name}</div>
                    <span
                      className={`text-xs font-semibold ${u.isVerified ? 'text-forest' : 'text-neutral-500'}`}
                    >
                      {u.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 text-xs">
                    <div>{u.email}</div>
                    <div className="text-neutral-500">{u.phone ?? '—'}</div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateRole.mutate({ id: u.id, role: e.target.value })
                      }
                      className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-forest"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 text-xs">
                    {u._count.bookings} bookings · {u._count.subscriptions} subs
                  </td>
                  <td className="px-5 py-4 text-neutral-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-KE')}
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
