import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventSitemapEntries, getPublicEvent } from "@/lib/server/public-events";
import { makeExcerpt } from "@/lib/blog-text";
import { OG_DEFAULTS } from "@/lib/site";
import EventDetailClient from "./EventDetailClient";

export const instant = false;

// Every published event is built ahead of time and served from the CDN; one added
// later is built on its first visit. Event changes and registrations rebuild it.
export async function generateStaticParams() {
  try {
    const events = await getEventSitemapEntries();
    // At least one is required; a placeholder that 404s is fine when there are none.
    return events.length ? events.map((e) => ({ id: e.id })) : [{ id: "no-events-yet" }];
  } catch (error) {
    console.error("Events: couldn't read the events to prebuild:", error);
    return [{ id: "no-events-yet" }];
  }
}

type Props = { params: Promise<{ id: string }> };

// Each event gets its own title, description and share card. The canonical address
// uses the slug, so the same event reached by its database id isn't a duplicate.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getPublicEvent((await params).id);
  if (!event) return { robots: { index: false } };

  const description = makeExcerpt(event.description, 155);
  const url = `/events/${event.id}`;
  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_DEFAULTS,
      title: event.title,
      description,
      url,
      // No cover photo ("/bg.jpg" is the placeholder): leave images out so the generated
      // card in ./opengraph-image.tsx is used.
      ...(event.image !== "/bg.jpg" ? { images: [{ url: event.image, alt: event.title }] } : {}),
    },
    twitter: { card: "summary_large_image", title: event.title, description },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Looked up before anything streams, so an unknown event is a real 404 (not a 200 page
  // that says "not found").
  const event = await getPublicEvent(id);
  if (!event) notFound();

  return <EventDetailClient event={event} />;
}
