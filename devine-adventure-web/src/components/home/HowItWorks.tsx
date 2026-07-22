import { Search, CalendarCheck, Backpack } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse Adventures',
    description:
      'Explore curated hikes, cycling trips, and wilderness experiences across Kenya, filtered by difficulty, category, and date.',
  },
  {
    icon: CalendarCheck,
    title: 'Book in Minutes',
    description:
      'Reserve your spot instantly and pay securely with M-Pesa or card. Members unlock discounted and free access to select events.',
  },
  {
    icon: Backpack,
    title: 'Show Up & Explore',
    description:
      'Meet your guide, gear up, and hit the trail. Every adventure includes professional guiding and safety equipment.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-stone-900/40 border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            How it works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-2">
            Three Steps to Your Next Trail
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="font-display text-3xl font-black text-stone-700">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
