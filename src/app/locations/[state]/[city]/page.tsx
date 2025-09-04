// /app/locations/[state]/[city]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import { allPosts } from "contentlayer/generated";
import { siteUrl, siteImage, siteTitle } from "@/lib/utils/constants";

// Server-only data helpers
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

/* ------------------------------- Types -------------------------------- */
type Params = { state: string; city: string };
type HeaderData = { title: string; subtitle?: string };
type TagsPageLocation = {
  state: string;
  city: string;
  stateName: string;
  cityName: string;
};

/* -------------------------- Small helpers ----------------------------- */
/**
 * Choose a representative OG image for the city index page by borrowing
 * a post's frontmatter image. Prefers "Housing & Utilities" content, then any.
 */
const ogImage = `${siteUrl}${siteImage}`;

/* ------- Legacy-friendly bags from typed localResources (for tokens) ------- */
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

    // copy any additional string fields (e.g., providerSearchUrl)
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") out[k] = v;
    }
    resources[name] = out;

    if (Array.isArray(obj.faqs)) faqByTopic[name] = obj.faqs;
  }

  return { resources, faqByTopic };
}

/* -------------------------- Simple FAQ tuple guard ------------------------- */
function isTupleQA(x: unknown): x is readonly [string, string] {
  return (
    Array.isArray(x) &&
    x.length === 2 &&
    typeof x[0] === "string" &&
    typeof x[1] === "string"
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default async function CityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state, city } = await params; // <-- await the promise
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

  // Build props for your client component (generic, city-focused copy)
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

  // ItemList JSON-LD mirrors your initial visible grid
  const DEFAULT_CATEGORY = "Housing & Utilities"; // matches your client’s initial tab
  const initialPosts = allPosts.filter((p) =>
    p.category?.some(
      (cat) => cat.toLowerCase() === DEFAULT_CATEGORY.toLowerCase()
    )
  );

  const itemListElements = initialPosts.slice(0, 20).map((post, i) => {
    const slug = post._raw.flattenedPath.replace(/^posts\//, "");
    return {
      "@type": "ListItem" as const,
      position: i + 1,
      url: `${siteUrl}/locations/${s}/${c}/posts/${slug}`,
      name: post.title,
    };
  });

  // Optional: aggregate tuple FAQs for FAQPage JSON-LD (limit to keep lean)
  const faqTuples: Array<readonly [string, string]> = [];
  for (const v of Object.values(localResources)) {
    const faqs = (v as LocalResource).faqs;
    if (Array.isArray(faqs)) {
      for (const item of faqs) {
        if (isTupleQA(item)) faqTuples.push(item);
        if (faqTuples.length >= 10) break; // soft cap
      }
    }
    if (faqTuples.length >= 10) break;
  }

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

      {/* ItemList JSON-LD (reflect the initial grid) */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${canonical}#itemlist`,
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
          primaryImageOfPage: ogImage
            ? {
                "@type": "ImageObject",
                url: ogImage,
                width: 1200,
                height: 630,
              }
            : undefined,
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

      {/* Optional FAQPage JSON-LD (only if we found tuple Q&As) */}
      {faqTuples.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: faqTuples.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }}
        />
      )}

      {/* Provide location context so your tokens/components work */}
      <LocationProvider
        value={{
          // ✅ display names
          cityName: loc.cityName,
          stateName: loc.stateName,

          // ✅ URL slugs (from _locationsData)
          citySlug: loc.city, // e.g. "los-angeles"
          stateSlug: loc.state, // e.g. "california"

          // ✅ data bags
          resources, // string-only bag for legacy bits
          faqByTopic, // for <ResourceLink field="faqs" />
          localResources, // typed per-city resources
        }}
      >
        {/* Client page: list UI + cards linking to localized posts */}
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
  const { state, city } = await params; // <-- await the promise
  const s = state.toLowerCase();
  const c = city.toLowerCase();
  const loc = findLocation(s, c);
  if (!loc) return {};

  const pathUrl = `/locations/${s}/${c}`;
  const title = `Local guides in ${loc.cityName}, ${loc.stateName} — articles & resources (2025)`;
  const description = `City-focused articles with curated links and tips for navigating government assistance in ${loc.cityName}, ${loc.stateName}.`;

  // Borrow an article image for social previews (absolute URL).
  const ogImage = `${siteUrl}${siteImage}`;

  return {
    title,
    description,
    // Use absolute canonical for consistency with all crawlers
    alternates: { canonical: `${siteUrl}${pathUrl}` },
    openGraph: {
      type: "website",
      url: `${siteUrl}${pathUrl}`,
      siteName: `${siteTitle}`,
      title,
      description,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Local guides in ${loc.cityName}, ${loc.stateName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      // site: "@yourhandle" // optional
    },
    robots: { index: true, follow: true },
  };
}

/* -------------------------- Static params for SSG -------------------------- */
export async function generateStaticParams() {
  return getAllLocations().map(({ state, city }) => ({ state, city }));
}

export const revalidate = 86400;
