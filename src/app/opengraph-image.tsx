import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read once, at build time.
const logo = `data:image/png;base64,${await readFile(join(process.cwd(), "public/logo.png"), "base64")}`;

// The share card for every page without its own: the logo and the club's name on the
// site's dark background. Blog posts and events have their own cards.
export default async function Image() {
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
          {`~/${SITE_SHORT_NAME.toLowerCase()}`}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not a page */}
          <img src={logo} width={192} height={240} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
              {SITE_NAME}
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#a3a3a3" }}>
              Learn to code, build real projects, and grow with fellow students.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a3a3a3" }}>
          <span>KNIT Sultanpur</span>
          <span style={{ color: "#ffffff", fontWeight: 700 }}>{SITE_SHORT_NAME}</span>
        </div>
      </div>
    ),
    size
  );
}
