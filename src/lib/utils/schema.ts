// utils/schema.ts
import { siteTitle, siteUrl } from "./constants";

export function blogPostingSchema(post: {
  slug: string;
  title: string;
  summary?: string;
  image?: string; // e.g., "/images/postImages/VA-Housing-Assistance.jpg"
  date: string; // "2025-03-27"
  dateModified?: string; // optional
}) {
  const canonical = `${siteUrl}/posts/${post.slug}`;

  const toISO = (d?: string) =>
    d?.includes("T") ? d : d ? `${d}T00:00:00Z` : undefined;

  const publishedISO = toISO(post.date);
  const modifiedISO = toISO(post.dateModified) ?? publishedISO;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#blogposting`,
    mainEntityOfPage: canonical,
    headline: post.title,
    description: post.summary,
    image: post.image
      ? {
          "@type": "ImageObject",
          url: `${siteUrl}${post.image}`, // absolute URL
          width: 1200,
          height: 630,
        }
      : undefined,
    inLanguage: "en-US",
    isAccessibleForFree: true, // ✅ real boolean
    datePublished: publishedISO, // ✅ ISO 8601 w/ timezone
    dateModified: modifiedISO, // ✅ ISO 8601 w/ timezone
    author: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteTitle,
      url: siteUrl, // ✅ add url to satisfy hint
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
  };
}

export function breadcrumbsSchema(slug: string, title: string) {
  const canonical = `${siteUrl}/posts/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Posts",
        item: `${siteUrl}/posts`,
      },
      { "@type": "ListItem", position: 3, name: title, item: canonical },
    ],
  };
}
