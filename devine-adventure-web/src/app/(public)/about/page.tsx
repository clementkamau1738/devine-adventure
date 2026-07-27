import { Mountain, Users, Calendar, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920';

const values = [
  {
    icon: Mountain,
    title: 'Local expertise',
    body: 'Every route is scouted and guided by Kenyans who grew up in these highlands, forests, and valleys.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety first',
    body: 'Certified guides, vetted equipment, and first-aid support on every hike, ride, and expedition.',
  },
  {
    icon: Users,
    title: 'A real community',
    body: 'Members and guests train, hike, and celebrate together — this is a collective, not just a booking site.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-50">
        {/* Full-bleed atmospheric hero — Playfair Regular (not italic) */}
        <section className="relative min-h-[70vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Ink scrim ~40% — warm, not a teal color-wash */}
          <div className="absolute inset-0 bg-ink/40" aria-hidden />

          <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 md:py-32 text-center">
            <span className="inline-block text-sun text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-5">
              Kenya&apos;s Adventure Collective
            </span>
            <h1 className="font-atmospheric text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.15] not-italic">
              Where the light finds the ridge first
            </h1>
            <p className="mt-6 text-neutral-50 text-base sm:text-lg font-sans max-w-xl mx-auto leading-relaxed">
              Guided days on foot and by bike, held by people who know these
              highlands by heart.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(17,15,13,0.08)]"
            >
              <Icon className="w-6 h-6 text-forest mb-4" />
              <div className="text-ink font-semibold text-lg mb-2 font-sans">
                {title}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed font-sans">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-neutral-100 rounded-2xl p-8 flex flex-wrap gap-10 justify-center text-center">
            {[
              { icon: Mountain, value: '50+', label: 'Adventures run' },
              { icon: Users, value: '2,400+', label: 'Members' },
              { icon: Calendar, value: '120+', label: 'Events hosted' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon className="w-5 h-5 text-forest mx-auto mb-2" />
                <div className="font-display text-2xl font-normal tracking-normal text-ink">
                  {value}
                </div>
                <div className="text-neutral-600 text-sm font-sans">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
