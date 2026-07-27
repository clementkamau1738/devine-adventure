import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const perks = [
  'Member discounts on all events',
  'Free access to freemium hikes',
  'Priority booking',
];

export function MembershipTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-forest/25 bg-gradient-to-br from-stone-900 via-stone-900 to-ink p-10 md:p-16">
        <div className="max-w-xl">
          <span className="text-forest text-sm font-semibold tracking-widest uppercase">
            Membership
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-normal text-white mt-3 mb-5 uppercase tracking-normal">
            Adventure Unlimited
          </h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-8">
            Join Devine Adventure membership and unlock discounted pricing,
            free access to selected hikes, and priority booking on every
            event we host.
          </p>

          <ul className="space-y-3 mb-10">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2 text-stone-200 text-sm"
              >
                <Check className="w-4 h-4 text-forest flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>

          <Link
            href="/membership"
            className="inline-flex items-center gap-2 bg-forest text-neutral-50 font-bold px-8 py-4 rounded-full hover:bg-forest-hover transition-colors"
          >
            View Membership Plans <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
