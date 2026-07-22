'use client';
import Link from 'next/link';
import { CreditCard, Check } from 'lucide-react';
import { useMySubscription, useCancelSubscription } from '@/hooks/useSubscription';
import { formatKES, getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardSubscriptionPage() {
  const { data: subscription, isLoading } = useMySubscription();
  const { mutate: cancelSubscription, isPending } = useCancelSubscription();

  const handleCancel = () => {
    if (!subscription) return;
    if (!confirm('Cancel your membership? You will lose member pricing immediately.'))
      return;
    cancelSubscription(subscription.id, {
      onSuccess: () => toast.success('Membership cancelled'),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'Could not cancel membership')),
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white font-display">
          Membership
        </h1>
        <p className="text-stone-400 mt-1">Manage your Devine Adventure plan</p>
      </div>

      {isLoading ? (
        <div className="text-stone-400">Loading...</div>
      ) : subscription?.status === 'ACTIVE' ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-400/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-bold capitalize">
                {subscription.planType.toLowerCase()} Membership
              </div>
              <span className="text-emerald-400 text-xs font-semibold">
                Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-stone-800/50 rounded-xl p-4">
              <div className="text-stone-500 text-xs mb-1">Started</div>
              <div className="text-white text-sm font-medium">
                {new Date(subscription.startDate).toLocaleDateString('en-KE', {
                  dateStyle: 'long',
                })}
              </div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-4">
              <div className="text-stone-500 text-xs mb-1">Renews / Expires</div>
              <div className="text-white text-sm font-medium">
                {new Date(subscription.endDate).toLocaleDateString('en-KE', {
                  dateStyle: 'long',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-800 mb-6">
            <span className="text-stone-400 text-sm">Amount paid</span>
            <span className="text-white font-bold">
              {formatKES(subscription.amount)}
            </span>
          </div>

          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-red-400 text-sm hover:underline disabled:opacity-50"
          >
            {isPending ? 'Cancelling...' : 'Cancel membership'}
          </button>
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="text-white font-bold text-lg mb-2">
            You&apos;re not a member yet
          </div>
          <p className="text-stone-400 text-sm mb-6 max-w-sm mx-auto">
            Get discounts on every adventure, free access to selected hikes,
            and priority booking.
          </p>
          <ul className="text-left max-w-xs mx-auto space-y-2 mb-6">
            {[
              'Member discounts on all events',
              'Free access to freemium hikes',
              'Priority booking',
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-stone-300 text-sm"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/membership"
            className="inline-block bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-full hover:bg-amber-300 transition-colors text-sm"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
