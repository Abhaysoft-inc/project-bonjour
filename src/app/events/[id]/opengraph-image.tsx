import { ImageResponse } from "next/og";
import { getPublicEvent } from "@/lib/server/public-events";
import { SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";

export const alt = "PTSC event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card for an event without a cover photo: its title, date and venue on the
// site's dark background. Events with a cover photo share that instead (see page.tsx).
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const event = await getPublicEvent((await params).id);
  const title = event?.title ?? "PTSC events";
  const titleSize = title.length > 90 ? 48 : title.length > 55 ? 58 : 70;
  const month = event ? event.month.charAt(0) + event.month.slice(1).toLowerCase() : "";
  const when = event ? `${month} ${Number(event.day)}, ${event.year}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080809",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#34d399", letterSpacing: 2 }}>
          {`~/${SITE_SHORT_NAME.toLowerCase()}/events${event ? ` · ${event.tag.toLowerCase()}` : ""}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5 }}>
            {title}
          </div>
          {event && (
            <div style={{ display: "flex", fontSize: 32, color: "#d4d4d4" }}>
              {`${when} · ${event.locationTitle}`}
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a3a3a3" }}>
          <span>{SITE_NAME}</span>
          <span style={{ color: "#ffffff", fontWeight: 700 }}>{SITE_SHORT_NAME}</span>
        </div>
      </div>
    ),
    size
  );
}
