import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { isAxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string | string[] }>(err)) {
    const message = err.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
  }
  return fallback;
}

export function formatKES(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatEventDate(dateStr: string) {
  return format(new Date(dateStr), 'EEE, MMM d, yyyy · h:mm a');
}

export function formatRelative(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function isEventPast(dateStr: string) {
  return isPast(new Date(dateStr));
}

export function capacityPercent(enrolled: number, capacity: number) {
  return Math.round((enrolled / capacity) * 100);
}

/** Soft text chips (filters, lists) */
export function difficultyColor(diff: string) {
  return (
    {
      BEGINNER: 'bg-forest/15 text-forest border border-forest/30',
      MODERATE: 'bg-sun/15 text-ink border border-sun/40',
      ADVANCED: 'bg-clay/15 text-clay border border-clay/30',
    }[diff] ?? 'bg-neutral-100 text-neutral-500 border border-neutral-200'
  );
}

/** Solid pills on photography (Featured cards) */
export function difficultyPillOnPhoto(diff: string) {
  return (
    {
      BEGINNER: 'bg-forest text-neutral-50',
      MODERATE: 'bg-sun text-ink',
      ADVANCED: 'bg-clay text-neutral-50',
    }[diff] ?? 'bg-neutral-800 text-neutral-50'
  );
}

export function difficultyLabel(diff: string) {
  return diff.charAt(0) + diff.slice(1).toLowerCase();
}

export function categoryIcon(cat: string) {
  return (
    { HIKE: '🏔️', BIKE: '🚵', PRIVATE: '🎯', TRAINING: '💪' }[cat] ?? '🌿'
  );
}

/** Short place name from full event location string. */
export function destinationLabel(location: string): string {
  const main = location.split(',')[0]?.trim() ?? location;
  return main
    .replace(/\s+National Park$/i, '')
    .replace(/\s+Forest$/i, ' Forest')
    .trim();
}
