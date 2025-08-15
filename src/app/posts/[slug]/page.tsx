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

function hasDateModified(x: unknown): x is { dateModified: string } {
  return (
    !!x &&
    typeof x === "object" &&
    "dateModified" in x &&
    typeof (x as Record<string, unknown>).dateModified === "string"
  );
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${params.slug}`
  );
  if (!post) return notFound();

  const Content = getMDXComponent(post.body.code);
  const components = {
    BenefitsCtaBanner,
    AffiliateCtaBanner,
    AffiliateDisclosure,
  };

  const canonical = `${siteUrl}/posts/${params.slug}`;
  const toISO = (d?: string) =>
    d?.includes("T") ? d : d ? `${d}T00:00:00Z` : undefined;
  const publishedISO = toISO(post.date as string);
  const modifiedISO = toISO(
    hasDateModified(post) ? post.dateModified : post.date
  );
  const imageObj = post.image
    ? {
        "@type": "ImageObject",
        url: `${siteUrl}${
          post.image.startsWith("/") ? post.image : `/${post.image}`
        }`,
        width: 1200,
        height: 630,
      }
    : undefined;

  return (
    <>
      {/* ✅ BlogPosting */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${canonical}#blogposting`,
          mainEntityOfPage: canonical,
          headline: post.title,
          description: post.summary ?? "",
          image: imageObj, // ImageObject with size
          inLanguage: "en-US",
          isAccessibleForFree: true, // boolean
          datePublished: publishedISO, // ISO 8601 w/ timezone
          dateModified: modifiedISO, // ISO 8601 w/ timezone
          author: post.author
            ? { "@type": "Person", name: post.author, url: siteUrl } // add url to silence hint
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
              // include logo object
              "@type": "ImageObject",
              url: `${siteUrl}/logo/blog_logo_dark.svg`,
              width: 512,
              height: 512,
            },
          },
        }}
      />

      {/* ✅ Breadcrumbs */}
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
            style={{
              color: "var(--color-muted-text)",
              fontSize: "0.65rem",
            }}
          >
            {formatDate(post.date)}
            &nbsp;&nbsp;•&nbsp;&nbsp;
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
            <Content components={components} />
          </div>
        </FadeIn>
      </article>
    </>
  );
}

// Dynamically generates SEO metadata for individual blog posts
// using Contentlayer data and a reusable metadata helper.
// Includes Open Graph and Twitter card support.
import { getPageMeta } from "@/lib/utils/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find the matching post from Contentlayer using the flattenedPath format (e.g., 'posts/my-post')
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${slug}`
  );
  if (!post) return {};

  // Generate SEO metadata using a reusable helper
  return getPageMeta({
    title: post.seoTitle ?? post.title, // Post title for <title> tag, Open Graph, and Twitter
    description: post.summary || "Helpful guides on US benefit programs.", // Post summary for meta description
    slug: post._raw.flattenedPath.replace(/^posts\//, ""), // Slug used to build canonical and OG URLs
    image: post.image, // Optional cover image for OG/Twitter cards
    type: "article",
  });
}
