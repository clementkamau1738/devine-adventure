import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMonthGrid,
  eventsInMonth,
  initialCalendarMonth,
} from './calendar';
import { Event } from '@/types';

function mockEvent(partial: Partial<Event> & { dateTime: string }): Event {
  return {
    id: partial.id ?? '1',
    title: partial.title ?? 'Trip',
    slug: partial.slug ?? 'trip',
    description: '',
    location: 'Test',
    difficulty: partial.difficulty ?? 'BEGINNER',
    dateTime: partial.dateTime,
    price: 1000,
    isFree: false,
    capacity: 10,
    enrolled: 0,
    category: 'HIKE',
    images: [],
    isPublished: true,
    isFeatured: false,
  };
}

describe('calendar helpers', () => {
  it('buildMonthGrid returns full weeks covering the month', () => {
    const month = new Date(2025, 7, 1); // August 2025
    const grid = buildMonthGrid(month, []);
    assert.ok(grid.length % 7 === 0);
    assert.ok(grid.length >= 28);
    const inMonth = grid.filter((d) => d.inCurrentMonth);
    assert.equal(inMonth.length, 31);
  });

  it('eventsInMonth filters to the given month', () => {
    const events = [
      mockEvent({ id: 'a', dateTime: '2025-08-10T12:00:00' }),
      mockEvent({ id: 'b', dateTime: '2025-08-24T12:00:00' }),
      mockEvent({ id: 'c', dateTime: '2025-09-05T12:00:00' }),
    ];
    const monthEvents = eventsInMonth(events, new Date(2025, 7, 1));
    assert.equal(monthEvents.length, 2);
    assert.deepEqual(
      monthEvents.map((e) => e.id),
      ['a', 'b'],
    );
  });

  it('initialCalendarMonth prefers a month that has events', () => {
    const events = [
      mockEvent({ dateTime: '2025-09-15T06:00:00.000Z' }),
      mockEvent({ dateTime: '2025-08-02T07:30:00.000Z' }),
    ];
    const m = initialCalendarMonth(events, new Date(2026, 0, 1));
    assert.equal(m.getMonth(), 7); // August first chronologically when "now" has none
  });
});
