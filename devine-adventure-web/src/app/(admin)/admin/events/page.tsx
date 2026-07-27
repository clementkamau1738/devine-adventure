'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatEventDate, formatKES, getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { EventFormModal } from '@/components/admin/EventFormModal';
import { Event } from '@/types';

interface AdminEventsResponse {
  events: Event[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function AdminEventsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: async () => {
      const { data } = await api.get('/admin/events?limit=50');
      return data.data as AdminEventsResponse;
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({
      id,
      isPublished,
    }: {
      id: string;
      isPublished: boolean;
    }) => {
      await api.put(`/admin/events/${id}/publish`, { isPublished });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success('Updated');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Update failed')),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/events/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'events'] });
      toast.success('Event deleted');
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Delete failed')),
  });

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-normal text-ink font-display uppercase tracking-normal">
            Events
          </h1>
          <p className="text-neutral-500 mt-1">
            {data?.meta?.total ?? 0} total events
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-forest text-neutral-50 font-bold px-5 py-2.5 rounded-xl hover:bg-forest-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              {['Event', 'Date', 'Price', 'Capacity', 'Status', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-neutral-500 font-medium px-5 py-4"
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
                <td colSpan={6} className="text-center py-10 text-neutral-500">
                  Loading...
                </td>
              </tr>
            ) : (
              data?.events?.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-5 py-4">
                    <div className="text-ink font-medium line-clamp-1">
                      {event.title}
                    </div>
                    <div className="text-neutral-500 text-xs">
                      {event.category} · {event.difficulty}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 text-xs">
                    {formatEventDate(event.dateTime)}
                  </td>
                  <td className="px-5 py-4 text-neutral-600">
                    {formatKES(event.price)}
                  </td>
                  <td className="px-5 py-4 text-neutral-600">
                    {event.enrolled}/{event.capacity}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        event.isPublished
                          ? 'bg-forest/15 text-forest border border-forest/30'
                          : 'bg-neutral-200 text-neutral-500 border border-neutral-300'
                      }`}
                    >
                      {event.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          togglePublish.mutate({
                            id: event.id,
                            isPublished: !event.isPublished,
                          })
                        }
                        className="p-1.5 text-neutral-500 hover:text-ink rounded"
                        title={event.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {event.isPublished ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 text-neutral-500 hover:text-forest rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this event?'))
                            deleteEvent.mutate(event.id);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-clay rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            qc.invalidateQueries({ queryKey: ['admin', 'events'] });
          }}
        />
      )}
    </div>
  );
}
