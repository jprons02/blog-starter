// app/locations/[state]/[city]/posts/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import { getPublishedPosts } from "@/lib/posts";

import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";
import BenefitsCtaBanner from "@/app/components/BenefitsCtaBanner";
import AffiliateCtaBanner from "@/app/components/AffiliateCtaBanner";
import AffiliateDisclosure from "@/app/components/AffiliateDisclaimer";
import PostTags from "@/app/posts/[slug]/PostTags";
import JsonLd from "@/app/components/JsonLd";
import CrossLink from "@/app/components/mdxHelper/CrossLink";
import { formatDate } from "@/lib/utils/formatDate";
import { getPostSlug } from "@/lib/utils/getPostSlug";
import { siteUrl, siteTitle } from "@/lib/utils/constants";
import MDXClient from "@/app/components/MDXClient"; // "use client" wrapper
import AdSlot from "@/app/components/ads/AdSlot";

// server data (no "use client")
import {
  getAllLocations,
  findLocation,
  loadLocalResources,
} from "@/app/locations/_locationsData";

// client tokens/context for MDX
import {
  LocationProvider,
  City,
  State,
  IfLocation,
  IfNoLocation,
  ResourceLink,
  type QAItem,
  type LocalResource,
} from "@/app/locations/_locationsCtx";

/* ---------------- helpers ---------------- */
type WithDateModified = { dateModified: string };
function hasDateModified(x: unknown): x is WithDateModified {
  return (
    !!x &&
    typeof x === "object" &&
    "dateModified" in x &&
    typeof (x as Record<string, unknown>).dateModified === "string"
  );
}

// Build legacy-friendly bags from typed localResources so your MDX keeps working
function deriveFromLocalResources(
  localResources: Record<string, LocalResource>,
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

    if (Array.isArray(obj.faqs)) {
      faqByTopic[name] = obj.faqs;
    }
  }

  return { resources, faqByTopic };
}

/* ---------------- page ---------------- */
type Params = { state: string; city: string; slug: string };

export default async function LocalizedPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state, city, slug } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();

  // 1) Find post + location
  const post = getPublishedPosts().find(
    (p) => getPostSlug(p._raw.flattenedPath) === slug,
  );
  const loc = findLocation(s, c);
  if (!post || !loc) return notFound();

  // 2) Load per-city resources (ok if missing)
  const localResources = (await loadLocalResources(s, c)) as Record<
    string,
    LocalResource
  >;
  const { resources, faqByTopic } = deriveFromLocalResources(localResources);

  // 3) Same MDX renderer + components as /posts/[slug], plus location tokens
  const Content = getMDXComponent(post.body.code);
  const mdxComponents = {
    BenefitsCtaBanner,
    AffiliateCtaBanner,
    AffiliateDisclosure,
    CrossLink,
    City,
    State,
    IfLocation,
    IfNoLocation,
    ResourceLink,
    AdSlot,
  };

  // 4) Canonical + JSON-LD (localized)
  const canonical = `${siteUrl}/locations/${s}/${c}/posts/${slug}`;
  const toISO = (d?: string) =>
    d?.includes("T") ? d : d ? `${d}T00:00:00Z` : undefined;
  const publishedISO = toISO(post.date as string);
  const modifiedISO = toISO(
    hasDateModified(post) ? post.dateModified : post.date,
  );

  const imageAbs = post.image
    ? `${siteUrl}${post.image.startsWith("/") ? post.image : `/${post.image}`}`
    : undefined;

  const imageObj = imageAbs
    ? {
        "@type": "ImageObject" as const,
        url: imageAbs,
        width: 1200,
        height: 630,
      }
    : undefined;

  return (
    <>
      {/* BlogPosting JSON-LD (localized canonical) */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${canonical}#blogposting`,
          mainEntityOfPage: canonical,
          headline: post.title,
          description: post.summary ?? "",
          image: imageObj,
          inLanguage: "en-US",
          isAccessibleForFree: true,
          datePublished: publishedISO,
          dateModified: modifiedISO,
          author: post.author
            ? { "@type": "Person", name: post.author, url: siteUrl }
            : {
                "@type": "Organization",
                name: siteTitle,
                url: siteUrl,
                "@id": `${siteUrl}#organization`,
              },
          publisher: {
            "@type": "Organization",
            "@id": `${siteUrl}#organization`,
            name: siteTitle,
            url: siteUrl,
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/logo/blog_logo_dark.svg`,
              width: 512,
              height: 512,
            },
          },
          // Optional geo hint:
          areaServed: {
            "@type": "City",
            name: loc.cityName,
            address: { "@type": "PostalAddress", addressRegion: loc.stateName },
          },
        }}
      />

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
              item: {
                "@type": "WebPage",
                "@id": `${siteUrl}/locations/${s}/${c}`,
              },
            },
            {
              "@type": "ListItem",
              position: 4,
              name: post.title,
              item: { "@type": "WebPage", "@id": canonical },
            },
          ],
        }}
      />

      {/* ⬇️ Identical visual output to /posts/[slug], just with LocationProvider */}
      <LocationProvider
        value={{
          // Display names
          cityName: loc.cityName,
          stateName: loc.stateName,
          // URL slugs (use these for links in CrossLink, etc.)
          citySlug: loc.city, // "los-angeles"
          stateSlug: loc.state, // "california"
          // Data bags
          resources,
          faqByTopic,
          localResources,
        }}
      >
        <article className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
          <FadeIn>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {post.title}
            </h1>
            <p
              className="font-medium uppercase tracking-wide mb-6"
              style={{ color: "var(--color-muted-text)", fontSize: "0.65rem" }}
            >
              {formatDate(post.date)}&nbsp;&nbsp;•&nbsp;&nbsp;
              {post.author?.toUpperCase() || "STAFF"}
            </p>
          </FadeIn>

          {post.image && (
            <FadeIn>
              <div className="mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={400}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="rounded-xl w-full h-auto object-cover"
                  priority
                />
                <figcaption className="text-sm mt-2 text-muted">
                  Photo by{" "}
                  <a
                    href={post.imageCreditUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.imageCreditName || "Unknown Photographer"}
                  </a>{" "}
                  on{" "}
                  <a
                    href="https://www.pexels.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pexels
                  </a>
                </figcaption>
              </div>
            </FadeIn>
          )}

          {Array.isArray(post.tags) && (
            <FadeIn>
              <PostTags tags={post.tags} />
            </FadeIn>
          )}

          <FadeIn>
            <div className="markdown-body text-base leading-relaxed">
              <MDXClient>
                <Content components={mdxComponents} />
              </MDXClient>
            </div>
          </FadeIn>
        </article>
      </LocationProvider>
    </>
  );
}

/* ---------------- metadata ---------------- */
import { localizedPostSlugs } from "@/constants/localizedPosts";

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = localizedPostSlugs();
  const locs = getAllLocations();
  const out: Params[] = [];
  for (const { state, city } of locs) {
    for (const slug of slugs) out.push({ state, city, slug });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state, city, slug } = await params;
  const s = state.toLowerCase();
  const c = city.toLowerCase();

  const post = getPublishedPosts().find(
    (p) => getPostSlug(p._raw.flattenedPath) === slug,
  );
  const loc = findLocation(s, c);
  if (!post || !loc) return {};

  const title = `${post.seoTitle ?? post.title} — ${loc.cityName}, ${
    loc.stateName
  }`;
  const description =
    post.summary ??
    `Guidance for ${loc.cityName}, ${loc.stateName} on benefits programs.`;
  const pathUrl = `/locations/${s}/${c}/posts/${slug}`;
  const canonicalAbs = `${siteUrl}${pathUrl}`;

  const toISO = (d?: string) =>
    d?.includes("T") ? d : d ? `${d}T00:00:00Z` : undefined;
  const publishedTime = toISO(post.date as string);
  const modifiedTime = toISO(
    hasDateModified(post) ? post.dateModified : post.date,
  );

  const imageAbs = post.image
    ? `${siteUrl}${post.image.startsWith("/") ? post.image : `/${post.image}`}`
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalAbs },
    openGraph: {
      type: "article",
      url: canonicalAbs,
      siteName: siteTitle,
      title,
      description,
      locale: "en_US",
      publishedTime,
      modifiedTime,
      images: imageAbs
        ? [{ url: imageAbs, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageAbs ? [imageAbs] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export const revalidate = 86400;
