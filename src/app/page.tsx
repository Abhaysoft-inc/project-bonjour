import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import LatestPosts from "@/components/LatestPosts";
import { getPublicEventCardsSafe } from "@/lib/server/public-events";
import { getLatestBlogs } from "@/lib/server/public-blogs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_ADDRESS, SITE_NAME, SITE_SHORT_NAME, siteUrl } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Only the first few events are shown here, so only those are fetched.
  const [{ events, total }, latestPosts] = await Promise.all([
    getPublicEventCardsSafe(1, 3),
    // A blog failure shouldn't take the home page down: the strip just doesn't show.
    getLatestBlogs(3).catch((error) => {
      console.error("Loading latest blog posts failed:", error);
      return [];
    }),
  ]);

  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-clip">
      {/* Tells Google the site's name (and short name) for search results. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              alternateName: [SITE_SHORT_NAME, `${SITE_SHORT_NAME} Club`],
              url: `${siteUrl()}/`,
            },
            {
              "@type": "Organization",
              name: SITE_NAME,
              alternateName: SITE_SHORT_NAME,
              url: `${siteUrl()}/`,
              logo: `${siteUrl()}/logo.png`,
              address: SITE_ADDRESS,
            },
          ],
        }}
      />
      <Navbar />
      <Hero />
      <Events events={events} total={total} />
      <Featured />
      <LatestPosts posts={latestPosts} />
      <Footer />
    </main>
  );
}
