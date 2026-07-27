import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Wanjiru Kamau',
    role: 'Annual Member',
    quote:
      'The Mt. Kenya summit trip was the best-organized hike I have ever done. Professional guides, great gear, and the member discount made it a no-brainer.',
  },
  {
    name: 'Brian Otieno',
    role: 'Quarterly Member',
    quote:
      'I booked the Hell’s Gate cycling trip on a whim and now I’m hooked. The booking flow is so smooth — M-Pesa payment took thirty seconds.',
  },
  {
    name: 'Amina Yusuf',
    role: 'First-time Guest',
    quote:
      'Loved the sunrise hike at Ngong Hills. Beginner-friendly like they promised, and the crew made sure nobody was left behind.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-12 md:mb-14">
          <span className="inline-block text-forest text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Community
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-normal text-ink uppercase tracking-normal">
            Adventurers Love Devine
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map(({ name, role, quote }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 md:p-7 shadow-[0_4px_16px_rgba(17,15,13,0.08)]"
            >
              {/* Sun once per card as rating mark — section’s single accent role */}
              <div className="flex gap-0.5 mb-4" aria-label="5 star rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-sun fill-sun"
                  />
                ))}
              </div>
              <p className="text-ink text-sm leading-relaxed font-sans mb-6">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="text-ink font-semibold text-sm font-sans">
                {name}
              </div>
              <div className="text-neutral-600 text-xs font-sans mt-0.5">
                {role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
