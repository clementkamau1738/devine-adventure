import { Mountain, Users, Calendar, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

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
      <main className="min-h-screen pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <span className="text-forest text-sm font-semibold tracking-widest uppercase">
            About Us
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-normal text-white mt-3 mb-6 uppercase tracking-normal">
            Kenya&apos;s Adventure Collective
          </h1>
          <p className="text-stone-400 text-xl leading-relaxed max-w-2xl mx-auto">
            Devine Adventure started with a simple idea: the best way to see
            Kenya is on foot, on a bike, and with people who know the terrain.
            We now run curated hikes, cycling routes, and wilderness
            experiences across the highlands, forests, and valleys — for
            first-timers and seasoned adventurers alike.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6 mb-20">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-stone-900 border border-neutral-700 rounded-2xl p-6"
            >
              <Icon className="w-6 h-6 text-forest mb-4" />
              <div className="text-white font-bold text-lg mb-2">{title}</div>
              <p className="text-stone-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-ink border border-neutral-700 rounded-2xl p-8 flex flex-wrap gap-10 justify-center text-center">
            {[
              { icon: Mountain, value: '50+', label: 'Adventures run' },
              { icon: Users, value: '2,400+', label: 'Members' },
              { icon: Calendar, value: '120+', label: 'Events hosted' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon className="w-5 h-5 text-forest mx-auto mb-2" />
                <div className="text-white font-black text-2xl">{value}</div>
                <div className="text-stone-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
