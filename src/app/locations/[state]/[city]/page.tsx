// src/app/locations/[state]/[city]/page.tsx
import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import { allLocationDocs } from "contentlayer/generated";
import {
  LocationProvider,
  City,
  State,
  IfLocation,
  ResourceLink,
  type QAItem,
} from "../../_locationsCtx";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl } from "@/lib/utils/constants";

import {
  LOCATION_REGISTRY,
  findLocationModule,
  type LocationModule,
} from "@/data/locations/registry";

/* -------------------------------- Types -------------------------------- */

type LegacyJson = {
  city: string;
  state: string;
  resources?: Record<string, Record<string, string>>;
  faq?: [string, string][];
  faqByTopic?: Record<string, readonly QAItem[]>;
  localResources?: LocationModule["localResources"];
};

type LoadedLocation = {
  city: string;
  state: string;
  /** Legacy-friendly link bag used by older MDX bits */
  resources: Record<string, Record<string, string>>;
  /** Optional legacy visible FAQ array */
  faq?: [string, string][];
  /** Topic -> QA items (used by location-aware components) */
  faqByTopic: Record<string, readonly QAItem[]>;
  /** Rich TS resources for <ResourceLink field="faqs" /> */
  localResources: LocationModule["localResources"];
};

/* --------------------------- Legacy JSON (fallback) --------------------------- */

function cityJsonPath(s: string, c: string) {
  return path.join(process.cwd(), "data", "locations", s, `${c}.json`);
}

async function loadLegacyJson(
  state: string,
  city: string
): Promise<LoadedLocation | null> {
  try {
    const raw = await fs.readFile(cityJsonPath(state, city), "utf8");
    const json = JSON.parse(raw) as LegacyJson;
    return {
      city: json.city,
      state: json.state,
      resources: json.resources ?? {},
      faq: json.faq,
      faqByTopic: json.faqByTopic ?? {},
      localResources: json.localResources ?? {},
    };
  } catch {
    return null;
  }
}

/* -------------- Derive legacy-friendly fields from TS module -------------- */

function deriveFromModule(mod: LocationModule): LoadedLocation {
  const resources: Record<string, Record<string, string>> = {};
  const faqByTopic: Record<string, readonly QAItem[]> = {};

  for (const [name, obj] of Object.entries(mod.localResources)) {
    const out: Record<string, string> = {};

    // Legacy aliases so older components continue to work
    if (obj.link) out.applyUrl = obj.link;
    if (obj.phone) out.phone = obj.phone;

    // Copy any other string fields (contact, email, etc.)
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") out[k] = v;
    }

    resources[name] = out;

    if (Array.isArray(obj.faqs)) {
      faqByTopic[name] = obj.faqs;
    }
  }

  return {
    city: mod.city,
    state: mod.state,
    resources,
    faqByTopic,
    localResources: mod.localResources,
  };
}

/* -------------------------------- Data loader ------------------------------- */

async function loadLocation(
  state: string,
  city: string
): Promise<LoadedLocation | null> {
  // Prefer TS registry
  const mod = findLocationModule(state, city);
  if (mod) return deriveFromModule(mod);

  // Fallback to legacy JSON file
  return loadLegacyJson(state, city);
}

/* ----------------------------------- Page ----------------------------------- */

export default async function LocationPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();

  const data = await loadLocation(s, c);
  if (!data) return notFound();

  const tpl = allLocationDocs.find(
    (d) => d._raw.flattenedPath === "locations/template"
  );
  if (!tpl) return notFound();
  const Mdx = getMDXComponent(tpl.body.code);

  const canonical = `${siteUrl}/locations/${s}/${c}`;

  return (
    <>
      {/* Breadcrumbs */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumbs`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: { "@type": "WebPage", "@id": `${siteUrl}/` },
            },
            {
              "@type": "ListItem",
              position: 2,
              name: data.state,
              item: { "@type": "WebPage", "@id": `${siteUrl}/locations/${s}` },
            },
            {
              "@type": "ListItem",
              position: 3,
              name: `${data.city}, ${data.state}`,
              item: { "@type": "WebPage", "@id": canonical },
            },
          ],
        }}
      />

      {/* WebPage */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: `Government Assistance in ${data.city}, ${data.state}`,
          inLanguage: "en-US",
          about: {
            "@type": "City",
            name: data.city,
            addressRegion: data.state,
          },
          spatialCoverage: {
            "@type": "City",
            name: data.city,
            addressRegion: data.state,
          },
        }}
      />

      {/* Optional legacy FAQ schema (only if `data.faq` exists) */}
      {Array.isArray(data.faq) && data.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: data.faq.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }}
        />
      )}

      <LocationProvider
        value={{
          city: data.city,
          state: data.state,
          resources: data.resources,
          faqByTopic: data.faqByTopic,
          localResources: data.localResources,
        }}
      >
        <article className="max-w-3xl mx-auto px-4 py-10">
          <Mdx components={{ City, State, IfLocation, ResourceLink }} />

          {/* Optional visible legacy FAQ render */}
          {Array.isArray(data.faq) && data.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-3">
                FAQs for {data.city}, {data.state}
              </h2>
              <ul className="space-y-4">
                {data.faq.map(([q, a], i) => (
                  <li key={i}>
                    <p className="font-medium">{q}</p>
                    <p className="text-sm text-muted-foreground">{a}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </LocationProvider>
    </>
  );
}

/* --------------------------------- Metadata --------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();
  const data = await loadLocation(s, c);
  if (!data) return {};

  const title = `Government Assistance in ${data.city}, ${data.state} (2025): SNAP, WIC, LIHEAP & Medicaid`;
  const pathUrl = `/locations/${s}/${c}`;
  return {
    title,
    description: `How to apply for SNAP, WIC, LIHEAP, and Medicaid in ${data.city}, ${data.state}. Local offices, phone numbers, and official links — plus a free eligibility checker.`,
    alternates: { canonical: pathUrl },
    openGraph: {
      type: "article",
      url: pathUrl,
      title,
      description: `Apply for benefits in ${data.city}, ${data.state}.`,
    },
  };
}

/* ----------------------- Build-time params from the registry ----------------------- */
export async function generateStaticParams() {
  return Object.keys(LOCATION_REGISTRY).map((key) => {
    const [state, city] = key.split("/");
    return { state, city };
  });
}

export const revalidate = 86400;
