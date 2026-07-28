'use client';

import { Search, CalendarCheck, Backpack } from 'lucide-react';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/Motion';

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
    <section className="border-y border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <FadeUp inView className="mb-10 text-center md:mb-12">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-forest sm:text-sm">
            How it works
          </span>
          <h2 className="font-display text-4xl font-normal uppercase tracking-normal text-ink md:text-5xl">
            Three Steps to Your Next Trail
          </h2>
        </FadeUp>

        <Stagger className="grid gap-10 md:grid-cols-3 md:gap-12" inView>
          {steps.map(({ icon: Icon, title, description }, i) => (
            <StaggerItem key={title} className="text-center md:text-left">
              <div className="mb-5 flex items-center justify-center gap-4 md:justify-start">
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
              <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-neutral-600 md:mx-0">
                {description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
