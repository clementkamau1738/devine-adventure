import { cn } from '@/lib/utils';

type PageHeroBannerProps = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** About-style tall hero vs short listing banner */
  size?: 'short' | 'tall';
  className?: string;
  children?: React.ReactNode;
};

/**
 * Atmospheric photo banner (About language).
 * short = Adventures / Calendar; tall = About.
 */
export function PageHeroBanner({
  image,
  eyebrow,
  title,
  subtitle,
  size = 'short',
  className,
  children,
}: PageHeroBannerProps) {
  return (
    <section
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        size === 'tall'
          ? 'min-h-[70vh] md:min-h-[78vh]'
          : 'min-h-[280px] md:min-h-[320px]',
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden />

      <div
        className={cn(
          'relative z-10 mx-auto max-w-3xl px-6 text-center',
          // Extra top pad so copy clears the fixed navbar
          size === 'tall'
            ? 'pt-32 pb-28 md:pt-36 md:pb-32'
            : 'pt-28 pb-12 md:pt-32 md:pb-14',
        )}
      >
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-sun sm:text-sm md:mb-5">
          {eyebrow}
        </span>
        <h1
          className={cn(
            'font-atmospheric font-normal not-italic leading-[1.15] text-white',
            size === 'tall'
              ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
              : 'text-3xl sm:text-4xl md:text-5xl',
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              'mx-auto max-w-xl font-sans leading-relaxed text-neutral-50',
              size === 'tall'
                ? 'mt-6 text-base sm:text-lg'
                : 'mt-3 text-sm sm:text-base',
            )}
          >
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
