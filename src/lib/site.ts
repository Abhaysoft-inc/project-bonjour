/**
 * The site's public address with no trailing slash, e.g. "https://ptsc.app".
 * Used for canonical links, share images, the sitemap and the RSS feed.
 * Set APP_URL in production; Vercel's own production URL is the fallback.
 */
export function siteUrl() {
  const configured = process.env.APP_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Programming and Tech Skills Club";
export const SITE_SHORT_NAME = "PTSC";

/**
 * Open Graph fields every page shares. A page that sets its own `openGraph` replaces the
 * layout's whole object (Next merges metadata shallowly), so spread these into it.
 */
export const OG_DEFAULTS = { siteName: SITE_NAME, locale: "en_IN", type: "website" } as const;

/** The site-wide share card (src/app/opengraph-image.tsx), for pages that set their own openGraph. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Where the club is based. Every event is held here too. */
export const SITE_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "KNIT Sultanpur",
  addressLocality: "Sultanpur",
  addressRegion: "Uttar Pradesh",
  postalCode: "228118",
  addressCountry: "IN",
} as const;
