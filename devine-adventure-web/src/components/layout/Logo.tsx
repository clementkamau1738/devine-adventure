import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  variant?: 'full' | 'mark';
  theme?: 'dark' | 'light';
  /** Height of the lockup in px (width derives from intrinsic ratio ~2.53:1) */
  height?: number;
  className?: string;
  href?: string;
  priority?: boolean;
};

/**
 * Lockup from official assets — always height-driven with auto width so
 * mark + script + ADVENTURES keep source proportions (branding.md §4).
 * Uses <img> (not next/image) to avoid aspect-ratio compression bugs.
 */
export function Logo({
  variant = 'full',
  theme = 'dark',
  height = 40,
  className,
  href = '/',
  priority = false,
}: LogoProps) {
  const isMark = variant === 'mark';
  const src = isMark
    ? '/devine-icon.png'
    : theme === 'light'
      ? '/devine-logo-light.png'
      : '/devine-logo.png';

  // Intrinsic ratios
  const naturalW = isMark ? 512 : 1600;
  const naturalH = isMark ? 512 : 632;
  const renderedH = isMark ? Math.min(height, 40) : height;
  const renderedW = Math.round(renderedH * (naturalW / naturalH));

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Devine Adventures"
      width={renderedW}
      height={renderedH}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
      className={cn('block object-contain object-left shrink-0', className)}
      style={{
        width: renderedW,
        height: renderedH,
        maxWidth: isMark ? renderedW : 'min(220px, 55vw)',
      }}
    />
  );

  if (!href) return img;

  return (
    <Link
      href={href}
      className="inline-flex items-center shrink-0 leading-none"
      aria-label="Devine Adventures home"
    >
      {img}
    </Link>
  );
}
