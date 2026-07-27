import Link from 'next/link';
import { Globe, Share2, Mail } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';
import { CONTACT_EMAIL } from '@/lib/contact';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'All Adventures', href: '/events' },
      { label: 'Calendar', href: '/events/calendar' },
      { label: 'Membership', href: '/membership' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
];

/** Sitewide light chrome footer — classes must stay static (no window/Date branches). */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4">
              <Logo theme="light" height={40} />
            </div>
            <p className="max-w-xs font-sans text-sm leading-relaxed text-neutral-600">
              Kenya&apos;s premier outdoor adventure booking platform. Hikes,
              bikes, and wilderness experiences across the highlands, forests,
              and valleys.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <WhatsAppLink variant="icon" />
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-neutral-500 hover:text-forest transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-neutral-500 hover:text-forest transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Email"
                className="text-neutral-500 hover:text-forest transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-ink text-sm font-semibold mb-4 font-sans">
                {col.title}
              </div>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-600 hover:text-forest text-sm font-medium transition-colors font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-sm font-sans">
          <span>
            © {new Date().getFullYear()} Devine Adventure. All rights
            reserved.
          </span>
          <span>Made for the highlands, forests, and valleys of Kenya.</span>
        </div>
      </div>
    </footer>
  );
}
