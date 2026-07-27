/**
 * Prebuild booking paths for static export (event IDs from API at build time).
 */
export async function generateStaticParams() {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!base) {
    return [{ eventId: 'placeholder' }];
  }

  try {
    const res = await fetch(`${base}/events?limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [{ eventId: 'placeholder' }];
    const json = (await res.json()) as {
      data?: { events?: { id: string }[] };
    };
    const events = json.data?.events ?? [];
    if (events.length === 0) return [{ eventId: 'placeholder' }];
    return events.map((e) => ({ eventId: e.id }));
  } catch {
    return [{ eventId: 'placeholder' }];
  }
}

export default function BookingEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
