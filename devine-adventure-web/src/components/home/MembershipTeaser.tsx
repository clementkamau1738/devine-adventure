'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { MpesaMark } from '@/components/payments/MpesaMark';
import { MEMBERSHIP_PLANS } from '@/lib/membership-plans';
import { cn } from '@/lib/utils';
import {
  FadeUp,
  Stagger,
  StaggerItem,
  motion,
  useReducedMotion,
} from '@/components/motion/Motion';
import { springSoft } from '@/lib/motion';

/**
 * Homepage membership band — same three plan cards as /membership
 * (Monthly / Quarterly / Annual). CTAs go to the full membership page.
 */
export function MembershipTeaser() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-neutral-200 bg-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
        <FadeUp inView className="mb-12 text-center md:mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-forest sm:text-sm">
            Membership
          </span>
          <h2 className="mt-3 font-display text-4xl font-normal uppercase tracking-normal text-ink md:text-5xl lg:text-6xl">
            Adventure Unlimited
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base text-neutral-500 md:text-lg">
            Get member discounts, free access to selected hikes, and priority
            booking on all events.
          </p>
        </FadeUp>

        <Stagger className="grid items-stretch gap-6 md:grid-cols-3" inView>
          {MEMBERSHIP_PLANS.map((plan) => (
            <StaggerItem key={plan.type}>
            <motion.div
              whileHover={reduce ? undefined : { y: -4 }}
              transition={springSoft}
              className={cn(
                'relative h-full rounded-2xl border-2 bg-white p-6',
                plan.color,
                plan.featured &&
                  'md:scale-105 md:shadow-[0_8px_24px_rgba(17,15,13,0.1)]',
              )}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-sun px-4 py-1.5 text-xs font-bold text-ink">
                  Most Popular
                </div>
              )}

              <div className="mb-1 font-sans text-sm text-neutral-500">
                {plan.tagline}
              </div>
              <div className="mb-1 font-display text-2xl font-normal uppercase tracking-normal text-ink">
                {plan.label}
              </div>

              <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-2">
                <span className="font-display text-4xl font-normal tracking-normal text-ink">
                  KES {plan.price.toLocaleString()}
                </span>
                <span className="font-sans text-sm text-neutral-500">
                  {plan.period}
                </span>
                <MpesaMark className="self-center" />
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 font-sans text-sm text-neutral-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/membership"
                className={cn(
                  'block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-colors',
                  plan.featured
                    ? 'bg-forest text-neutral-50 hover:bg-forest-hover'
                    : 'border border-neutral-300 text-ink hover:border-ink',
                )}
              >
                Get Started
              </Link>
            </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
