// /app/posts/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";
import { formatDate } from "@/lib/utils/formatDate";
import BenefitsCtaBanner from "@/app/components/BenefitsCtaBanner";
import AffiliateCtaBanner from "@/app/components/AffiliateCtaBanner";
import AffiliateDisclosure from "@/app/components/AffiliateDisclaimer";
import PostTags from "./PostTags";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl } from "@/lib/utils/constants";
import CrossLink from "@/app/components/mdxHelper/CrossLink";

import {
  LocationProvider,
  City,
  State,
  IfLocation,
  IfNoLocation,
  ResourceLink,
  type QAItem, // ← reuse FAQ item type
} from "@/app/locations/_locationsCtx";

import {
  findLocationModule,
  type LocationModule,
  type LocalResource,
} from "@/data/locations/registry";

/* ---------------- helpers ---------------- */
function hasDateModified(x: unknown): x is { dateModified: string } {
  return (
    !!x &&
    typeof x === "object" &&
    "dateModified" in x &&
    typeof (x as Record<string, unknown>).dateModified === "string"
  );
}

/** Minimal legacy-compatible resource shape we derive for MDX fallbacks */
type DerivedResource = {
  applyUrl?: string;
  countyUrl?: string;
  stateUrl?: string;
  infoUrl?: string;
  phone?: string;
  contact?: string;
  email?: string;
  faqs?: readonly QAItem[];
  // allow passing through other string fields without widening to `any`
  [k: string]: string | readonly QAItem[] | undefined;
};

/** Derive legacy `resources` and `faqByTopic` from a TS LocationModule.
 *  This keeps existing MDX fallbacks working while supporting <ResourceLink field="faqs" />.
 */
function deriveFromModule(mod: LocationModule) {
  const resources: Record<string, DerivedResource> = {};
  const faqByTopic: Record<string, readonly QAItem[]> = {};

  const entries = Object.entries(mod.localResources ?? {}) as [
    string,
    LocalResource
  ][];

  for (const [name, obj] of entries) {
    // Initialize per-key bucket
    resources[name] = resources[name] ?? {};

    // Primary CTA & common fields
    if (obj.link) resources[name].applyUrl = obj.link;
    if (obj.phone) resources[name].phone = obj.phone;
    if (obj.contact) resources[name].contact = obj.contact;
    if (obj.email) resources[name].email = obj.email;

    // Copy any additional string fields (e.g., stateUrl, providerSearchUrl)
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string" && resources[name][k] == null) {
        resources[name][k] = v;
      }
    }

    // FAQ passthrough for topic-aware usage
    if (Array.isArray(obj.faqs)) {
      faqByTopic[name] = obj.faqs;
      resources[name].faqs = obj.faqs;
    }
  }

  return {
    resources,
    faqByTopic,
    localResources: mod.localResources ?? {},
  };
}

/* ---------------- page ---------------- */
export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ city?: string; state?: string }>;
}) {
  const { slug } = await props.params;
  const { city, state } = await props.searchParams;

  const post = allPosts.find((p) => p._raw.flattenedPath === `posts/${slug}`);
  if (!post) return notFound();

  const Content = getMDXComponent(post.body.code);

  const mdxComponents = {
    BenefitsCtaBanner,
    AffiliateCtaBanner,
    AffiliateDisclosure,
    City,
    State,
    IfLocation,
    IfNoLocation,
    ResourceLink,
    CrossLink,
  };

  const canonical = `${siteUrl}/posts/${slug}`;
  const toISO = (d?: string) =>
    d?.includes("T") ? d : d ? `${d}T00:00:00Z` : undefined;
  const publishedISO = toISO(post.date as string);
  const modifiedISO = toISO(
    hasDateModified(post) ? post.dateModified : post.date
  );
  const imageObj = post.image
    ? {
        "@type": "ImageObject" as const,
        url: `${siteUrl}${
          post.image.startsWith("/") ? post.image : `/${post.image}`
        }`,
        width: 1200,
        height: 630,
      }
    : undefined;

  const article = (
    <>
      {/* BlogPosting */}
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
                name: "MyGovBlog",
                url: siteUrl,
                "@id": `${siteUrl}#organization`,
              },
          publisher: {
            "@type": "Organization",
            "@id": `${siteUrl}#organization`,
            name: "MyGovBlog",
            url: siteUrl,
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/logo/blog_logo_dark.svg`,
              width: 512,
              height: 512,
            },
          },
        }}
      />

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
              name: "Posts",
              item: { "@type": "WebPage", "@id": `${siteUrl}/posts` },
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: { "@type": "WebPage", "@id": canonical },
            },
          ],
        }}
      />

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
            <Content components={mdxComponents} />
          </div>
        </FadeIn>
      </article>
    </>
  );

  // TS-only: look up module via registry (no fs/json)
  if (city && state) {
    const mod = findLocationModule(state, city);
    if (mod) {
      const derived = deriveFromModule(mod);
      return (
        <LocationProvider
          value={{
            city: mod.city,
            state: mod.state,
            resources: derived.resources, // legacy compatibility
            faqByTopic: derived.faqByTopic,
            localResources: derived.localResources, // for <ResourceLink field="faqs" />
          }}
        >
          {article}
        </LocationProvider>
      );
    }
    // Module not found → still wrap so <IfLocation> can render minimally
    return (
      <LocationProvider
        value={{
          city,
          state,
          resources: {},
          faqByTopic: {},
          localResources: {},
        }}
      >
        {article}
      </LocationProvider>
    );
  }

  // No location → generic experience
  return article;
}

/* ---------------- metadata ---------------- */
import { getPageMeta } from "@/lib/utils/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = allPosts.find((p) => p._raw.flattenedPath === `posts/${slug}`);
  if (!post) return {};

  return getPageMeta({
    title: post.seoTitle ?? post.title,
    description: post.summary || "Helpful guides on US benefit programs.",
    slug: post._raw.flattenedPath.replace(/^posts\//, ""),
    image: post.image,
    type: "article",
  });
}
