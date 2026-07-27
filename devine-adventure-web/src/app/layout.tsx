import type { Metadata } from 'next';
import { Anton, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
});
/** Block display face — branding.md §3 (H1–H3 / price numerals). */
const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  weight: '400',
});

export const metadata: Metadata = {
  title: { default: 'Devine Adventure', template: '%s | Devine Adventure' },
  description:
    "Kenya's premier outdoor adventure booking platform. Hikes, bikes, and more.",
  openGraph: {
    siteName: 'Devine Adventure',
    locale: 'en_KE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${anton.variable}`}
    >
      <body className="bg-stone-950 text-stone-100 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
