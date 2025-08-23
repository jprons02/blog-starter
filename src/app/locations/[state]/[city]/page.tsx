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
} from "../../_locationsCtx";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl } from "@/lib/utils/constants";

function cityPath(s: string, c: string) {
  return path.join(process.cwd(), "data", "locations", s, `${c}.json`);
}
async function loadLocation(state: string, city: string) {
  try {
    return JSON.parse(await fs.readFile(cityPath(state, city), "utf8"));
  } catch {
    return null;
  }
}

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
      {/* FAQPage (optional, if data.faq exists) */}
      {Array.isArray(data.faq) && data.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: data.faq.map(([q, a]: [string, string]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }}
        />
      )}

      <LocationProvider value={data}>
        <article className="max-w-3xl mx-auto px-4 py-10">
          <Mdx components={{ City, State, IfLocation, ResourceLink }} />
          {/* Optional visible FAQ render */}
          {Array.isArray(data.faq) && data.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-3">
                FAQs for {data.city}, {data.state}
              </h2>
              <ul className="space-y-4">
                {data.faq.map(([q, a]: [string, string], i: number) => (
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

export async function generateStaticParams() {
  return [{ state: "az", city: "phoenix" }];
}

export const revalidate = 86400;
