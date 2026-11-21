import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import { SITE_NAME, siteUrl } from "@/lib/site";

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
  openGraph: { siteName: SITE_NAME, type: "website" },
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
