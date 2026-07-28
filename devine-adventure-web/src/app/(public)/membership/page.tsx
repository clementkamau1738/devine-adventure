'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMySubscription, useSubscribe } from '@/hooks/useSubscription';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { MpesaMark } from '@/components/payments/MpesaMark';
import { MEMBERSHIP_PLANS } from '@/lib/membership-plans';

export default function MembershipPage() {
  const { isAuthenticated } = useAuthStore();
  // Do not fetch /subscriptions/me as a guest — that 401 used to bounce to login
  const { data: subscription } = useMySubscription(isAuthenticated);
  const { mutateAsync: subscribe, isPending } = useSubscribe();
  const router = useRouter();

  const handleSubscribe = async (planType: string) => {
    if (!isAuthenticated) {
      // Explicit action only — browsing plans stays public
      router.push('/register?redirect=/membership');
      return;
    }
    try {
      await subscribe(planType);
      toast.success('Membership activated!');
      router.push('/dashboard/subscription');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not activate membership'));
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-0 pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-forest text-sm font-semibold tracking-widest uppercase">
              Membership
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-normal text-ink mt-3 mb-4 uppercase tracking-normal">
              Adventure Unlimited
            </h1>
            <p className="text-neutral-500 text-xl max-w-xl mx-auto">
              Get member discounts, free access to selected hikes, and
              priority booking on all events.
            </p>
          </div>

          {/* Active subscription notice */}
          {subscription?.status === 'ACTIVE' && (
            <div className="bg-forest/10 border border-forest/30 rounded-2xl p-5 mb-10 text-center">
              <div className="text-forest font-semibold">
                ✓ You have an active {subscription.planType.toLowerCase()}{' '}
                membership
              </div>
              <div className="text-neutral-500 text-sm mt-1">
                Expires{' '}
                {new Date(subscription.endDate).toLocaleDateString('en-KE', {
                  dateStyle: 'long',
                })}
              </div>
            </div>
          )}

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.type}
                className={`bg-white border-2 ${plan.color} rounded-2xl p-6 relative ${plan.featured ? 'scale-105' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sun text-ink text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-neutral-500 text-sm mb-1">
                  {plan.tagline}
                </div>
                <div className="font-display text-2xl font-normal uppercase tracking-normal text-ink mb-1">
                  {plan.label}
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 mb-6">
                  <span className="font-display text-4xl font-normal tracking-normal text-ink">
                    KES {plan.price.toLocaleString()}
                  </span>
                  <span className="text-neutral-500 text-sm font-sans">
                    {plan.period}
                  </span>
                  <MpesaMark className="self-center" />
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-neutral-600 text-sm"
                    >
                      <Check className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={isPending || subscription?.status === 'ACTIVE'}
                  className={`w-full py-3.5 rounded-xl font-bold transition-colors ${
                    plan.featured
                      ? 'bg-forest text-neutral-50 hover:bg-forest-hover'
                      : 'border border-neutral-300 text-ink hover:border-neutral-300'
                  } disabled:opacity-50`}
                >
                  {subscription?.status === 'ACTIVE'
                    ? 'Current Plan'
                    : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
