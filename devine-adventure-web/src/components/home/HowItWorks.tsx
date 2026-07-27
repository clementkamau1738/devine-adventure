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
    <section className="bg-white border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-14 md:mb-16">
          <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            How it works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-normal text-ink uppercase tracking-normal">
            Three Steps to Your Next Trail
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-forest/10">
                  <Icon className="w-6 h-6 text-forest" strokeWidth={1.75} />
                </div>
                <span className="font-display text-3xl font-normal tracking-normal text-neutral-300">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-normal uppercase tracking-normal text-ink mb-2">
                {title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed font-sans max-w-sm mx-auto md:mx-0">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
