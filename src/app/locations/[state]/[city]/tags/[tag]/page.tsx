// app/locations/[state]/[city]/tags/[tag]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPosts, type Post } from "contentlayer/generated";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl, siteTitle } from "@/lib/utils/constants";
import { findLocation } from "@/app/locations/_locationsData";
import { LocationProvider } from "@/app/locations/_locationsCtx";
import TagPageClient from "@/app/tags/[tag]/TagPageClient";

type Params = { state: string; city: string; tag: string };

const slugifyTag = (t: string) => t.toLowerCase().replace(/\s+/g, "-");
const unslugTag = (s: string) => decodeURIComponent(s).replace(/-/g, " ");

function postHasTag(p: Post, targetSlug: string) {
  return (p.tags || []).some((t) => slugifyTag(t) === targetSlug);
}

export default async function LocalTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state, city, tag } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();

  const loc = findLocation(s, c);
  if (!loc) return notFound();

  // Filter posts for this tag (by slug)
  const posts = allPosts.filter((p) => postHasTag(p, tag));

  const canonical = `${siteUrl}/locations/${s}/${c}/tags/${encodeURIComponent(
    tag
  )}`;
  const tagHuman = unslugTag(tag);

  // --- JSON-LD: Breadcrumbs + WebPage + ItemList (first 20 items) ---
  const itemListElements = posts.slice(0, 20).map((p, i) => {
    const slug = p._raw.flattenedPath.replace(/^posts\//, "");
    return {
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/locations/${s}/${c}/posts/${slug}`,
      name: p.title,
    };
  });

  const ogDefault = `${siteUrl}/og/default.jpg`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumbs`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Locations",
              item: `${siteUrl}/locations`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: loc.stateName,
              item: `${siteUrl}/locations/${s}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: `${loc.cityName}, ${loc.stateName}`,
              item: `${siteUrl}/locations/${s}/${c}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: `Tag: ${tagHuman}`,
              item: canonical,
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: `Posts tagged “${tagHuman}” in ${loc.cityName}, ${loc.stateName}`,
          inLanguage: "en-US",
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: ogDefault,
            width: 1200,
            height: 630,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          numberOfItems: itemListElements.length,
          itemListElement: itemListElements,
        }}
      />

      {/* Provide city/state context for any location-aware components */}
      <LocationProvider
        value={{
          // Display names
          cityName: loc.cityName,
          stateName: loc.stateName,

          // URL slugs
          citySlug: loc.city, // e.g. "los-angeles"
          stateSlug: loc.state, // e.g. "california"

          // Data bags (resources is required; others optional)
          resources: {}, // or your real bag if you have one here
          faqByTopic: {}, // optional; include if your MDX reads it
          // localResources: {},   // optional
        }}
      >
        {/* Reuse your existing client page, but we’ll give it “current” below */}
        <TagPageClient
          posts={posts}
          tag={tagHuman}
          current={{
            state: s,
            city: c,
            stateName: loc.stateName,
            cityName: loc.cityName,
          }}
        />
      </LocationProvider>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state, city, tag } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();
  const loc = findLocation(s, c);
  if (!loc) return {};

  const tagHuman = decodeURIComponent(tag).replace(/-/g, " ");
  const pathUrl = `/locations/${s}/${c}/tags/${encodeURIComponent(tag)}`;
  const canonicalAbs = `${siteUrl}${pathUrl}`;
  const ogImage = `${siteUrl}/og/default.jpg`;

  return {
    title: `“${tagHuman}” in ${loc.cityName}, ${loc.stateName} — local guides`,
    description: `Articles about ${tagHuman} for ${loc.cityName}, ${loc.stateName}.`,
    alternates: { canonical: canonicalAbs },
    openGraph: {
      type: "website",
      url: canonicalAbs,
      siteName: siteTitle,
      title: `“${tagHuman}” in ${loc.cityName}, ${loc.stateName}`,
      description: `Local articles about ${tagHuman}.`,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Posts tagged “${tagHuman}” in ${loc.cityName}, ${loc.stateName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `“${tagHuman}” in ${loc.cityName}, ${loc.stateName}`,
      description: `Local articles about ${tagHuman}.`,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export const revalidate = 86400;
