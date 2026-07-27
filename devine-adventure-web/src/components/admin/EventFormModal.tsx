'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/utils';
import { Event } from '@/types';

const CATEGORIES = ['HIKE', 'BIKE', 'PRIVATE', 'TRAINING'] as const;
const DIFFICULTIES = ['BEGINNER', 'MODERATE', 'ADVANCED'] as const;

const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  category: z.enum(CATEGORIES),
  difficulty: z.enum(DIFFICULTIES),
  dateTime: z.string().min(1, 'Date & time is required'),
  price: z.number().min(0, 'Price is required'),
  memberPrice: z.number().min(0).optional(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  images: z.string().min(1, 'At least one image URL is required'),
  isFeatured: z.boolean(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const inputClass =
  'w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-ink text-sm placeholder-neutral-400 focus:outline-none focus:border-forest transition-colors';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-neutral-600 text-sm font-medium mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-clay text-xs mt-1">{error}</p>}
    </div>
  );
}

interface Props {
  event: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EventFormModal({ event, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          location: event.location,
          category: event.category,
          difficulty: event.difficulty,
          dateTime: format(new Date(event.dateTime), "yyyy-MM-dd'T'HH:mm"),
          price: event.price,
          memberPrice: event.memberPrice ?? undefined,
          capacity: event.capacity,
          images: event.images.join(', '),
          isFeatured: event.isFeatured,
        }
      : {
          category: 'HIKE',
          difficulty: 'BEGINNER',
          isFeatured: false,
        },
  });

  const onSubmit = async (values: EventFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      category: values.category,
      difficulty: values.difficulty,
      dateTime: new Date(values.dateTime).toISOString(),
      price: values.price,
      memberPrice: values.memberPrice,
      isFree: values.price === 0,
      capacity: values.capacity,
      images: values.images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
      isFeatured: values.isFeatured,
    };

    try {
      if (event) {
        await api.put(`/admin/events/${event.id}`, payload);
        toast.success('Event updated');
      } else {
        await api.post('/admin/events', payload);
        toast.success('Event created');
      }
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save event'));
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-neutral-200 rounded-2xl p-6 z-50">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-ink font-normal text-xl font-display uppercase tracking-normal">
              {event ? 'Edit Event' : 'New Event'}
            </Dialog.Title>
            <Dialog.Close className="text-neutral-500 hover:text-ink">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Title" error={errors.title?.message}>
              <input {...register('title')} className={inputClass} />
            </Field>

            <Field label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                className={inputClass}
              />
            </Field>

            <Field label="Location" error={errors.location?.message}>
              <input {...register('location')} className={inputClass} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" error={errors.category?.message}>
                <select {...register('category')} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Difficulty" error={errors.difficulty?.message}>
                <select {...register('difficulty')} className={inputClass}>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Date & Time" error={errors.dateTime?.message}>
              <input
                type="datetime-local"
                {...register('dateTime')}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (KES)" error={errors.price?.message}>
                <input
                  type="number"
                  step="1"
                  {...register('price', { valueAsNumber: true })}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Member Price (KES)"
                error={errors.memberPrice?.message}
              >
                <input
                  type="number"
                  step="1"
                  {...register('memberPrice', {
                    setValueAs: (v) => (v === '' ? undefined : Number(v)),
                  })}
                  className={inputClass}
                  placeholder="Optional"
                />
              </Field>
            </div>

            <Field label="Capacity" error={errors.capacity?.message}>
              <input
                type="number"
                step="1"
                {...register('capacity', { valueAsNumber: true })}
                className={inputClass}
              />
            </Field>

            <Field
              label="Image URLs (comma-separated)"
              error={errors.images?.message}
            >
              <input
                {...register('images')}
                className={inputClass}
                placeholder="https://..., https://..."
              />
            </Field>

            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 text-neutral-600 text-sm">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="rounded border-neutral-200 bg-neutral-100 text-forest focus:ring-forest"
                  />
                  Featured event
                </label>
              )}
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-neutral-200 text-neutral-600 font-semibold py-3 rounded-xl hover:border-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-forest text-neutral-50 font-bold py-3 rounded-xl hover:bg-forest-hover disabled:opacity-50 transition-colors"
              >
                {isSubmitting
                  ? 'Saving...'
                  : event
                    ? 'Save Changes'
                    : 'Create Event'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
