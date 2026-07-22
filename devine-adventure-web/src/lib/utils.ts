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

export function difficultyColor(diff: string) {
  return (
    {
      BEGINNER: 'text-emerald-400 bg-emerald-400/10',
      MODERATE: 'text-amber-400 bg-amber-400/10',
      ADVANCED: 'text-red-400 bg-red-400/10',
    }[diff] ?? 'text-stone-400 bg-stone-400/10'
  );
}

export function categoryIcon(cat: string) {
  return (
    { HIKE: '🏔️', BIKE: '🚵', PRIVATE: '🎯', TRAINING: '💪' }[cat] ?? '🌿'
  );
}
