// src/app/tags/page.tsx
import TagsPageClient from "./TagsPageClient";
import { allPosts } from "contentlayer/generated";
import { getPageMeta } from "@/lib/utils/seo";
import JsonLd from "@/app/components/JsonLd";
import { siteUrl } from "@/lib/utils/constants";

// ✅ SEO metadata (canonical + OG/Twitter handled by helper)
export const metadata = getPageMeta({
  title: "Browse topics",
  description:
    "Explore articles by topic to find help with housing, utilities, food, financial aid, and more.",
  slug: "tags",
  type: "website",
});

export default function TagsPage() {
  return (
    <>
      {/* CollectionPage schema + breadcrumb for /tags */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Browse topics",
          url: `${siteUrl}/tags`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${siteUrl}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tags",
              item: `${siteUrl}/tags`,
            },
          ],
        }}
      />
      <TagsPageClient allPosts={allPosts} />
    </>
  );
}
