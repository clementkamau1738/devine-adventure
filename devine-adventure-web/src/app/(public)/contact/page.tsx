import { Mail, MapPin, Share2, Globe } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@devineadventure.co.ke',
    href: 'mailto:hello@devineadventure.co.ke',
  },
  {
    icon: MapPin,
    label: 'Based in',
    value: 'Nairobi, Kenya',
    href: undefined,
  },
  {
    icon: Share2,
    label: 'Instagram',
    value: '@devineadventure',
    href: 'https://instagram.com',
  },
  {
    icon: Globe,
    label: 'Facebook',
    value: 'Devine Adventure',
    href: 'https://facebook.com',
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center mb-14">
          <span className="text-forest text-sm font-semibold tracking-widest uppercase">
            Contact
          </span>
          <h1 className="font-display text-5xl font-black text-white mt-3 mb-4">
            Get in Touch
          </h1>
          <p className="text-stone-400 text-lg">
            Questions about an upcoming adventure, group bookings, or
            membership? Reach out — we usually reply within a day.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-6 grid sm:grid-cols-2 gap-4">
          {channels.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="bg-stone-900 border border-neutral-700 rounded-2xl p-5 h-full hover:border-forest/40 transition-colors">
                <Icon className="w-5 h-5 text-forest mb-3" />
                <div className="text-stone-500 text-xs mb-0.5">{label}</div>
                <div className="text-white font-semibold text-sm">{value}</div>
              </div>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {content}
              </a>
            ) : (
              <div key={label}>{content}</div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
