import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import { OG_DEFAULTS, SITE_NAME, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Makes canonical and share-image links absolute.
  metadataBase: new URL(siteUrl()),
  // Pages set a short title ("Events", a post's headline) and get the club's name after it.
  title: { default: SITE_NAME, template: "%s | PTSC Club" },
  description:
    "A student community for learning to code, building projects together, and growing as developers. Workshops, hackathons, and peer mentoring for all skill levels.",
  // og:title, og:description and the X/Twitter tags are filled in from each page's own
  // title and description; the share image is src/app/opengraph-image.tsx.
  openGraph: { ...OG_DEFAULTS },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white selection:bg-white selection:text-black">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
