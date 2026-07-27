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
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
          Community
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-2">
          Adventurers Love Devine
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map(({ name, role, quote }) => (
          <div
            key={name}
            className="bg-stone-900 border border-neutral-700 rounded-2xl p-6"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              &ldquo;{quote}&rdquo;
            </p>
            <div className="text-white font-semibold text-sm">{name}</div>
            <div className="text-stone-500 text-xs">{role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
