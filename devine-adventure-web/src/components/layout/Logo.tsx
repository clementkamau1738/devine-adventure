import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  /** 'full' = lockup (mark + wordmark); 'mark' = icon only */
  variant?: 'full' | 'mark';
  /** Tailwind height classes for the image */
  className?: string;
  href?: string;
  priority?: boolean;
};

/**
 * Brand logo from /public (generated from official PDF lockup).
 * Dark UI uses /devine-logo.png (reversed script); light uses /devine-logo-light.png.
 */
export function Logo({
  variant = 'full',
  className,
  href = '/',
  priority = false,
}: LogoProps) {
  const isMark = variant === 'mark';
  const img = (
    <Image
      src={isMark ? '/devine-icon.png' : '/devine-logo.png'}
      alt="Devine Adventures"
      width={isMark ? 512 : 1600}
      height={isMark ? 512 : 632}
      className={cn(
        'w-auto object-contain',
        isMark ? 'h-10' : 'h-9 md:h-10',
        className,
      )}
      priority={priority}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} className="inline-flex items-center shrink-0">
      {img}
    </Link>
  );
}
