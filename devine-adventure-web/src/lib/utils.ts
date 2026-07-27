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

/** Unified difficulty pill — branding §10: Beginner forest, Moderate sun-on-ink, Advanced clay */
export function difficultyColor(diff: string) {
  return (
    {
      BEGINNER: 'bg-forest/15 text-forest border border-forest/30',
      MODERATE: 'bg-ink text-sun border border-sun/25',
      ADVANCED: 'bg-clay/15 text-clay border border-clay/30',
    }[diff] ?? 'bg-stone-800 text-stone-400 border border-stone-700'
  );
}

export function categoryIcon(cat: string) {
  return (
    { HIKE: '🏔️', BIKE: '🚵', PRIVATE: '🎯', TRAINING: '💪' }[cat] ?? '🌿'
  );
}
