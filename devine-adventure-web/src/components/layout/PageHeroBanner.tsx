'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easeOut, fadeUp, stagger } from '@/lib/motion';

type PageHeroBannerProps = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  size?: 'short' | 'tall';
  className?: string;
  children?: React.ReactNode;
};

/**
 * Atmospheric photo banner with light entrance motion.
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
  const reduce = useReducedMotion();

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
      <motion.img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: easeOut }}
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden />

      <motion.div
        className={cn(
          'relative z-10 mx-auto max-w-3xl px-6 text-center',
          size === 'tall'
            ? 'pt-32 pb-28 md:pt-36 md:pb-32'
            : 'pt-28 pb-12 md:pt-32 md:pb-14',
        )}
        variants={stagger}
        initial={reduce ? false : 'hidden'}
        animate="visible"
      >
        <motion.span
          variants={fadeUp}
          className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-sun sm:text-sm md:mb-5"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className={cn(
            'font-atmospheric font-normal not-italic leading-[1.15] text-white',
            size === 'tall'
              ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
              : 'text-3xl sm:text-4xl md:text-5xl',
          )}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            variants={fadeUp}
            className={cn(
              'mx-auto max-w-xl font-sans leading-relaxed text-neutral-50',
              size === 'tall'
                ? 'mt-6 text-base sm:text-lg'
                : 'mt-3 text-sm sm:text-base',
            )}
          >
            {subtitle}
          </motion.p>
        ) : null}
        {children}
      </motion.div>
    </section>
  );
}
