'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMySubscription, useSubscribe } from '@/hooks/useSubscription';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

const PLANS = [
  {
    type: 'MONTHLY',
    label: 'Monthly',
    price: 2500,
    period: '/month',
    tagline: 'Try it out',
    color: 'border-stone-700',
    features: [
      'Member discounts on all events',
      'Free access to freemium hikes',
      'Priority booking',
      'Adventure newsletter',
    ],
  },
  {
    type: 'QUARTERLY',
    label: 'Quarterly',
    price: 6500,
    period: '/3 months',
    tagline: 'Most popular',
    color: 'border-amber-400',
    featured: true,
    features: [
      'Everything in Monthly',
      'Save KES 1,000',
      '3-month commitment',
      'Early event access',
    ],
  },
  {
    type: 'ANNUAL',
    label: 'Annual',
    price: 22000,
    period: '/year',
    tagline: 'Best value',
    color: 'border-stone-700',
    features: [
      'Everything in Quarterly',
      'Save KES 8,000',
      '1 free private hike slot',
      'Devine merch kit',
    ],
  },
];

export default function MembershipPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: subscription } = useMySubscription();
  const { mutateAsync: subscribe, isPending } = useSubscribe();
  const router = useRouter();

  const handleSubscribe = async (planType: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/membership');
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
      <main className="min-h-screen pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
              Membership
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-black text-white mt-3 mb-4">
              Adventure Unlimited
            </h1>
            <p className="text-stone-400 text-xl max-w-xl mx-auto">
              Get member discounts, free access to selected hikes, and
              priority booking on all events.
            </p>
          </div>

          {/* Active subscription notice */}
          {subscription?.status === 'ACTIVE' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-10 text-center">
              <div className="text-emerald-400 font-semibold">
                ✓ You have an active {subscription.planType.toLowerCase()}{' '}
                membership
              </div>
              <div className="text-stone-400 text-sm mt-1">
                Expires{' '}
                {new Date(subscription.endDate).toLocaleDateString('en-KE', {
                  dateStyle: 'long',
                })}
              </div>
            </div>
          )}

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {PLANS.map((plan) => (
              <div
                key={plan.type}
                className={`bg-stone-900 border-2 ${plan.color} rounded-2xl p-6 relative ${plan.featured ? 'scale-105' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-stone-400 text-sm mb-1">
                  {plan.tagline}
                </div>
                <div className="font-display text-2xl font-black text-white mb-1">
                  {plan.label}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">
                    KES {plan.price.toLocaleString()}
                  </span>
                  <span className="text-stone-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-stone-300 text-sm"
                    >
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={isPending || subscription?.status === 'ACTIVE'}
                  className={`w-full py-3.5 rounded-xl font-bold transition-colors ${
                    plan.featured
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      : 'border border-stone-600 text-white hover:border-stone-400'
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
