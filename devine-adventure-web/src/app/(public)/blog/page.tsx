import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400/10 rounded-full mb-6">
            <BookOpen className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Stories from the Trail
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            Coming soon
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            We&apos;re putting together trip reports, route guides, and
            member stories from across the highlands, forests, and valleys.
            Check back soon — or follow along on the adventures happening
            right now.
          </p>
          <Link
            href="/events"
            className="inline-block bg-forest text-neutral-50 font-bold px-8 py-4 rounded-full hover:bg-forest-hover transition-colors"
          >
            Explore Adventures
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
