import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const perks = [
  'Member discounts on all events',
  'Free access to freemium hikes',
  'Priority booking on every trip',
];

/** Group hike moment — community/belonging (not solo landscape). */
const MEMBERSHIP_PHOTO =
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200';

export function MembershipTeaser() {
  return (
    <section className="bg-neutral-100 border-y border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-stretch">
        {/* Left — approved copy + checklist, unchanged */}
        <div className="px-6 py-14 md:py-16 flex items-center">
          <div
            className="bg-white rounded-2xl p-8 md:p-12 lg:p-14 w-full max-w-xl
              shadow-[0_4px_16px_rgba(17,15,13,0.08)]"
          >
            <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Membership
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-ink uppercase tracking-normal mb-4">
              Adventure Unlimited
            </h2>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-sans mb-8 max-w-lg">
              Join Devine Adventure membership and unlock discounted pricing,
              free access to selected hikes, and priority booking on every
              event we host.
            </p>

            <ul className="space-y-3 mb-10">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 text-ink text-sm font-sans"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-forest/10 shrink-0">
                    <Check
                      className="w-3.5 h-3.5 text-forest"
                      strokeWidth={2.5}
                    />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <Link
              href="/membership"
              className="inline-flex items-center gap-2 bg-forest text-neutral-50 font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-forest-hover transition-colors"
            >
              View Membership Plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right — tall rounded-rect photo, full band height, flush to band edge */}
        <div className="relative min-h-[22rem] sm:min-h-[26rem] lg:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MEMBERSHIP_PHOTO}
            alt="Members on a guided hike together"
            className="absolute inset-0 w-full h-full object-cover object-center
              rounded-none lg:rounded-l-2xl"
          />
        </div>
      </div>
    </section>
  );
}
