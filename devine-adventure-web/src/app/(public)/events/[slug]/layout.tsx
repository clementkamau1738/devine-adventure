/**
 * Server layout so static export can prebuild event detail paths.
 * Page itself stays client-side and loads live data from the API.
 */
export async function generateStaticParams() {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!base) {
    return [{ slug: 'placeholder' }];
  }

  try {
    const res = await fetch(`${base}/events?limit=100`, {
      // Build-time snapshot; runtime still fetches fresh data in the client page
      cache: 'no-store',
    });
    if (!res.ok) return [{ slug: 'placeholder' }];
    const json = (await res.json()) as {
      data?: { events?: { slug: string }[] };
    };
    const events = json.data?.events ?? [];
    if (events.length === 0) return [{ slug: 'placeholder' }];
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    return [{ slug: 'placeholder' }];
  }
}

export default function EventSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
