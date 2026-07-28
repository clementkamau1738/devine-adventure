import { Mountain, Users, Calendar, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeroBanner } from '@/components/layout/PageHeroBanner';

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
      <main className="flex-1 min-h-0 bg-neutral-50">
        <PageHeroBanner
          image={HERO_IMAGE}
          eyebrow="Kenya's Adventure Collective"
          title="Where the light finds the ridge first"
          subtitle="Guided days on foot and by bike, held by people who know these highlands by heart."
          size="tall"
        />

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
