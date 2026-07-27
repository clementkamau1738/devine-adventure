/**
 * Pure destination-browse helpers (branding.md §11.1).
 * Group event locations into photo tiles for the homepage grid.
 */

export type EventLocationSource = {
  location: string;
  images?: string[];
};

export type DestinationTile = {
  key: string;
  name: string;
  locationQuery: string;
  image: string;
  count: number;
};

/** Target places from product copy — matched against full event location strings. */
export const TARGET_DESTINATIONS: { name: string; pattern: RegExp }[] = [
  { name: 'Aberdare', pattern: /aberdare/i },
  { name: 'Mt. Kenya', pattern: /mt\.?\s*kenya|mount\s+kenya/i },
  { name: "Hell's Gate", pattern: /hell'?s\s*gate/i },
  { name: 'Ngong Hills', pattern: /ngong/i },
  { name: 'Naivasha', pattern: /naivasha/i },
  { name: 'Karura', pattern: /karura/i },
];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200';

/**
 * Build up to a 3×2 set of destination tiles from live events.
 * An event can contribute to multiple targets (e.g. Hell's Gate + Naivasha).
 */
export function buildDestinationTiles(
  events: EventLocationSource[],
): DestinationTile[] {
  const map = new Map<string, DestinationTile>();

  for (const event of events) {
    const image = event.images?.[0] || FALLBACK_IMAGE;
    const loc = event.location ?? '';

    for (const target of TARGET_DESTINATIONS) {
      if (!target.pattern.test(loc)) continue;
      const key = target.name.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.image) existing.image = image;
      } else {
        map.set(key, {
          key,
          name: target.name,
          locationQuery: target.name,
          image,
          count: 1,
        });
      }
    }
  }

  // Preserve target order for stable 3×2 layout when all six present
  return TARGET_DESTINATIONS.map((t) => map.get(t.name.toLowerCase())).filter(
    (t): t is DestinationTile => Boolean(t),
  );
}

export function nextTestimonialIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}
