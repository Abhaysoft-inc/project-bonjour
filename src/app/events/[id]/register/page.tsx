import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventSitemapEntries, getPublicEvent } from "@/lib/server/public-events";
import EventRegisterClient from "./EventRegisterClient";

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

// The form is reached from the event's own page, which is the one worth indexing.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const event = await getPublicEvent((await params).id);
  return {
    title: event ? `Register: ${event.title}` : "Register",
    robots: { index: false, follow: true },
    alternates: event ? { canonical: `/events/${event.id}/register` } : undefined,
  };
}

export default async function EventRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getPublicEvent(id);
  if (!event) notFound();

  return <EventRegisterClient event={event} />;
}
