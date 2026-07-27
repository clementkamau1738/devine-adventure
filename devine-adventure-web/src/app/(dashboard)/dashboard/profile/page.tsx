'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^\+254[0-9]{9}$/, 'Use a valid Kenyan number (+254...)')
    .optional()
    .or(z.literal('')),
});

type ProfileValues = z.infer<typeof profileSchema>;

const inputClass =
  'w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-forest transition-colors disabled:opacity-50';

export default function DashboardProfilePage() {
  const { user, updateUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '' },
  });

  const { mutateAsync: saveProfile, isPending } = useMutation({
    mutationFn: async (values: ProfileValues) => {
      const { data } = await api.put('/users/me', {
        name: values.name,
        phone: values.phone || undefined,
      });
      return data.data;
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    try {
      const updated = await saveProfile(values);
      updateUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update profile'));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-normal text-white font-display uppercase tracking-normal">
          Profile
        </h1>
        <p className="text-stone-400 mt-1">Manage your account details</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          {user?.role === 'MEMBER' && (
            <span className="bg-forest/15 text-forest border border-forest/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              Member
            </span>
          )}
          {user?.role === 'ADMIN' && (
            <span className="bg-clay/15 text-clay border border-clay/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              Admin
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              user?.isVerified
                ? 'bg-forest/15 text-forest border border-forest/30'
                : 'bg-stone-700 text-stone-400 border border-stone-600'
            }`}
          >
            {user?.isVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-stone-300 text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              value={user?.email ?? ''}
              disabled
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-1.5">
              Full Name
            </label>
            <input {...register('name')} className={inputClass} />
            {errors.name && (
              <p className="text-clay text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-stone-300 text-sm font-medium mb-1.5">
              Phone
            </label>
            <input
              {...register('phone')}
              className={inputClass}
              placeholder="+254712345678"
            />
            {errors.phone && (
              <p className="text-clay text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="bg-forest text-neutral-50 font-bold px-6 py-3 rounded-xl hover:bg-forest-hover disabled:opacity-50 transition-colors text-sm"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
