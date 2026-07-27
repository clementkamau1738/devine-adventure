'use client';
import Link from 'next/link';
import { ArrowRight, Mountain, Users, Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <span className="inline-block text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase mb-6">
            Kenya&apos;s Adventure Collective
          </span>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6 text-white">
            Find Your <em className="not-italic text-amber-400">Wild</em>
          </h1>

          <p className="text-stone-300 text-xl leading-relaxed mb-10 max-w-xl">
            Curated hikes, cycling adventures, and wilderness experiences
            across Kenya. Join thousands of adventurers exploring the
            highlands, forests, and valleys.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-forest text-neutral-50 font-bold px-8 py-4 rounded-full hover:bg-forest-hover transition-colors"
            >
              Explore Adventures <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 border border-stone-400 text-stone-200 font-semibold px-8 py-4 rounded-full hover:border-forest hover:text-forest transition-colors"
            >
              View Membership Plans
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10">
            {[
              { icon: Mountain, value: '50+', label: 'Adventures' },
              { icon: Users, value: '2,400+', label: 'Members' },
              { icon: Calendar, value: '120+', label: 'Events Hosted' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-forest" />
                <div>
                  <div className="text-white font-bold text-xl">{value}</div>
                  <div className="text-stone-400 text-sm">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
