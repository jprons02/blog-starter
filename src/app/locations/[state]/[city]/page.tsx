// /app/locations/[state]/[city]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import { allPosts } from "contentlayer/generated";
import { siteUrl } from "@/lib/utils/constants";

// Server-only data helpers (no "use client")
import {
  getAllLocations,
  findLocation,
  loadLocalResources,
} from "@/app/locations/_locationsData";

// Client context/tokens for location-aware UI
import {
  LocationProvider,
  type QAItem,
  type LocalResource,
} from "@/app/locations/_locationsCtx";

// Your client page component
import TagsPageClient from "@/app/tags/TagsPageClient";

// ── Types you can move to src/types if you like
type Params = { state: string; city: string };
type HeaderData = { title: string; subtitle?: string };
type TagsPageLocation = {
  state: string;
  city: string;
  stateName: string;
  cityName: string;
};

// Build legacy-friendly bags from typed localResources
function deriveFromLocalResources(
  localResources: Record<string, LocalResource>
) {
  const resources: Record<string, Record<string, string>> = {};
  const faqByTopic: Record<string, readonly QAItem[]> = {};

  const entries = Object.entries(localResources) as [string, LocalResource][];

  for (const [name, obj] of entries) {
    const out: Record<string, string> = {};
    if (obj.link) out.applyUrl = obj.link;
    if (obj.phone) out.phone = obj.phone;
    if (obj.contact) out.contact = obj.contact;
    if (obj.email) out.email = obj.email;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") out[k] = v;
    }
    resources[name] = out;
    if (Array.isArray(obj.faqs)) faqByTopic[name] = obj.faqs;
  }

  return { resources, faqByTopic };
}

/* ---------------------------------- Page ---------------------------------- */
export default async function CityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state, city } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();

  const loc = findLocation(s, c);
  if (!loc) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[locations] Missing in LOCATIONS: ${s}/${c}`);
    }
    return notFound();
  }

  // Load per-city resources (ok if file missing)
  const localResources = (await loadLocalResources(s, c)) as Record<
    string,
    LocalResource
  >;
  if (
    process.env.NODE_ENV !== "production" &&
    Object.keys(localResources).length === 0
  ) {
    console.warn(`[locations] No data file at app/locations/data/${s}/${c}.ts`);
  }

  const { resources, faqByTopic } = deriveFromLocalResources(localResources);

  // Build props for your client component
  const header: HeaderData = {
    title: `Browse ${loc.cityName}, ${loc.stateName} articles`,
    subtitle: `City-focused articles and trusted links tailored to government assistance programs in ${loc.cityName}.`,
  };

  // Example: pass other cities in the same state (or whatever list you prefer)
  const locations: TagsPageLocation[] = getAllLocations()
    .filter((l) => l.state === s)
    .map((l) => ({
      state: l.state,
      city: l.city,
      stateName: l.stateName,
      cityName: l.cityName,
    }));

  const canonical = `${siteUrl}/locations/${s}/${c}`;

  const DEFAULT_CATEGORY = "Housing & Utilities"; // matches your client’s initial tab
  const initialPosts = allPosts.filter((p) =>
    p.category?.some(
      (cat) => cat.toLowerCase() === DEFAULT_CATEGORY.toLowerCase()
    )
  );

  // limit to items you actually show (e.g., first 20 on the grid)
  const itemListElements = initialPosts.slice(0, 20).map((post, i) => {
    const slug = post._raw.flattenedPath.replace(/^posts\//, "");
    return {
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/locations/${s}/${c}/posts/${slug}`,
      name: post.title,
    };
  });

  return (
    <>
      {/* Breadcrumbs JSON-LD */}
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
              item: { "@type": "WebPage", "@id": `${siteUrl}/locations` },
            },
            {
              "@type": "ListItem",
              position: 2,
              name: loc.stateName,
              item: {
                "@type": "WebPage",
                "@id": `${siteUrl}/locations/${s}`,
              },
            },
            {
              "@type": "ListItem",
              position: 3,
              name: `${loc.cityName}, ${loc.stateName}`,
              item: { "@type": "WebPage", "@id": canonical },
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListOrder: "http://schema.org/ItemListOrderAscending",
          numberOfItems: itemListElements.length,
          itemListElement: itemListElements,
        }}
      />

      {/* WebPage JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: header.title,
          inLanguage: "en-US",
          about: {
            "@type": "City",
            name: loc.cityName,
            addressRegion: loc.stateName,
          },
          spatialCoverage: {
            "@type": "City",
            name: loc.cityName,
            addressRegion: loc.stateName,
          },
        }}
      />

      {/* Provide location context so your tokens/components work */}
      <LocationProvider
        value={{
          city: loc.cityName,
          state: loc.stateName,
          resources, // string-only bag for legacy bits
          faqByTopic, // for <ResourceLink field="faqs" />
          localResources, // full typed bag
        }}
      >
        {/* Your client page takes plain data props */}
        <TagsPageClient
          header={header}
          locations={locations}
          current={{
            state: s,
            city: c,
            stateName: loc.stateName,
            cityName: loc.cityName,
          }}
          allPosts={allPosts}
        />
      </LocationProvider>
    </>
  );
}

/* ------------------------------ Metadata (SEO) ------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();
  const loc = findLocation(s, c);
  if (!loc) return {};

  const title = `Government Assistance in ${loc.cityName}, ${loc.stateName} (2025): SNAP, WIC, LIHEAP & Medicaid`;
  const pathUrl = `/locations/${s}/${c}`;

  return {
    title,
    description: `How to apply for SNAP, WIC, LIHEAP, and Medicaid in ${loc.cityName}, ${loc.stateName}. Local offices, phone numbers, and official links — plus a free eligibility checker.`,
    alternates: { canonical: pathUrl },
    openGraph: {
      type: "article",
      url: pathUrl,
      title,
      description: `Apply for benefits in ${loc.cityName}, ${loc.stateName}.`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Apply for benefits in ${loc.cityName}, ${loc.stateName}.`,
    },
    robots: { index: true, follow: true },
  };
}

/* -------------------------- Static params for SSG -------------------------- */
export async function generateStaticParams() {
  return getAllLocations().map(({ state, city }) => ({ state, city }));
}

export const revalidate = 86400;
