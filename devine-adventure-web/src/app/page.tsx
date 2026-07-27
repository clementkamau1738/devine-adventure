import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { DifficultyFilterStrip } from '@/components/home/DifficultyFilterStrip';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { MembershipTeaser } from '@/components/home/MembershipTeaser';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-neutral-50">
        {/* Hero locked — do not alter */}
        <HeroSection />
        <Suspense fallback={null}>
          <DifficultyFilterStrip />
        </Suspense>
        <FeaturedEvents />
        <HowItWorks />
        <MembershipTeaser />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
