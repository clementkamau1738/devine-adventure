'use client';

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, stagger, viewOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type FadeUpProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode;
  delay?: number;
  /** Animate when scrolled into view */
  inView?: boolean;
};

/** Fade + slight rise — respects prefers-reduced-motion */
export function FadeUp({
  children,
  className,
  delay = 0,
  inView = false,
  ...rest
}: FadeUpProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const props = inView
    ? {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: viewOnce,
      }
    : {
        initial: 'hidden' as const,
        animate: 'visible' as const,
      };

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ delay }}
      {...props}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode;
  inView?: boolean;
  variants?: Variants;
};

/** Parent for staggered children using fadeUp children */
export function Stagger({
  children,
  className,
  inView = true,
  variants = stagger,
  ...rest
}: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      {...(inView
        ? { whileInView: 'visible', viewport: viewOnce }
        : { animate: 'visible' })}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode;
};

export function StaggerItem({
  children,
  className,
  ...rest
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={cn(className)} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}

export { motion, useReducedMotion };
