import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { Event } from '@/types';

export type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
};

/** Build a Sunday-start month grid (cells may spill into prev/next month). */
export function buildMonthGrid(
  month: Date,
  events: Event[],
): CalendarDay[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return days.map((date) => ({
    date,
    inCurrentMonth: isSameMonth(date, month),
    isToday: isToday(date),
    events: eventsForDay(events, date),
  }));
}

export function eventsForDay(events: Event[], day: Date): Event[] {
  return events
    .filter((e) => isSameDay(new Date(e.dateTime), day))
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
}

export function eventsInMonth(events: Event[], month: Date): Event[] {
  return events
    .filter((e) => isSameMonth(new Date(e.dateTime), month))
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
}

/** Prefer current month if it has events; else first month with events; else today. */
export function initialCalendarMonth(events: Event[], now = new Date()): Date {
  if (eventsInMonth(events, now).length > 0) {
    return startOfMonth(now);
  }
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );
  if (sorted[0]) return startOfMonth(new Date(sorted[0].dateTime));
  return startOfMonth(now);
}

export function shiftMonth(month: Date, delta: number): Date {
  return addMonths(month, delta);
}

export function dayKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function difficultyDotClass(diff: string): string {
  return (
    {
      BEGINNER: 'bg-forest',
      MODERATE: 'bg-sun',
      ADVANCED: 'bg-clay',
    }[diff] ?? 'bg-neutral-400'
  );
}
