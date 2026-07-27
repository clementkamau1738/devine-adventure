import { cn } from '@/lib/utils';

type MpesaMarkProps = {
  className?: string;
  /** Show "accepted" helper text under the mark */
  showLabel?: boolean;
};

/**
 * Compact M-Pesa trust mark for the point of decision (price / CTA).
 * Branding §11.4 — KE e-commerce pattern; keep small and quiet next to price.
 */
export function MpesaMark({ className, showLabel = false }: MpesaMarkProps) {
  return (
    <span
      className={cn('inline-flex flex-col items-start gap-0.5', className)}
      title="Pay with M-Pesa"
    >
      <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-void/60 px-1.5 py-0.5">
        {/* Minimal STK / phone glyph — not an official Safaricom asset */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="text-[#00A651] shrink-0"
        >
          <rect
            x="7"
            y="2"
            width="10"
            height="20"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
        <span className="text-[10px] font-bold tracking-wide text-[#00A651] leading-none">
          M-PESA
        </span>
      </span>
      {showLabel && (
        <span className="text-[10px] text-stone-500 font-sans leading-none">
          Instant STK push
        </span>
      )}
    </span>
  );
}
