import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDestinationTiles,
  nextTestimonialIndex,
  TARGET_DESTINATIONS,
} from './destinations';

describe('buildDestinationTiles', () => {
  it('maps seed-style events onto the six target destinations', () => {
    const events = [
      {
        location: 'Mt. Kenya National Park, Nanyuki',
        images: ['https://example.com/mtkenya.jpg'],
      },
      {
        location: 'Ngong Hills, Kajiado County',
        images: ['https://example.com/ngong.jpg'],
      },
      {
        location: "Hell's Gate National Park, Naivasha",
        images: ['https://example.com/hells.jpg'],
      },
      {
        location: 'Aberdare National Park, Nyeri',
        images: ['https://example.com/aberdare.jpg'],
      },
      {
        location: 'Karura Forest, Nairobi',
        images: ['https://example.com/karura.jpg'],
      },
    ];

    const tiles = buildDestinationTiles(events);
    const names = tiles.map((t) => t.name);

    assert.ok(names.includes('Mt. Kenya'));
    assert.ok(names.includes('Ngong Hills'));
    assert.ok(names.includes("Hell's Gate"));
    assert.ok(names.includes('Naivasha'), 'Naivasha from Hell’s Gate location string');
    assert.ok(names.includes('Aberdare'));
    assert.ok(names.includes('Karura'));
    assert.equal(tiles.length, 6);
    assert.equal(tiles.find((t) => t.name === "Hell's Gate")?.image, 'https://example.com/hells.jpg');
  });

  it('preserves TARGET_DESTINATIONS order', () => {
    const events = TARGET_DESTINATIONS.map((t, i) => ({
      location: t.name,
      images: [`https://example.com/${i}.jpg`],
    }));
    // Hell's Gate location alone shouldn't break order of matched set
    const tiles = buildDestinationTiles([
      { location: 'Karura Forest, Nairobi', images: ['k'] },
      { location: 'Aberdare National Park', images: ['a'] },
      { location: 'Mt. Kenya', images: ['m'] },
    ]);
    const order = tiles.map((t) => t.name);
    assert.deepEqual(order, ['Aberdare', 'Mt. Kenya', 'Karura']);
  });

  it('returns empty array when no locations match', () => {
    assert.deepEqual(buildDestinationTiles([{ location: 'Unknown Place' }]), []);
  });
});

describe('nextTestimonialIndex', () => {
  it('rotates 0→1→2→0 for three quotes', () => {
    assert.equal(nextTestimonialIndex(0, 3), 1);
    assert.equal(nextTestimonialIndex(1, 3), 2);
    assert.equal(nextTestimonialIndex(2, 3), 0);
  });

  it('handles empty list', () => {
    assert.equal(nextTestimonialIndex(0, 0), 0);
  });
});
