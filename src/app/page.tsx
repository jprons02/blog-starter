import { allPosts } from "contentlayer/generated";
import BlogIndexClient from "@/app/posts/BlogIndexClient";
import { getPageMeta } from "@/lib/utils/seo";
import {
  siteTitle,
  siteDescription,
  siteImage,
  siteUrl,
} from "@/lib/utils/constants";
import JsonLd from "@/app/components/JsonLd";

export const metadata = getPageMeta({
  title: siteTitle,
  description: siteDescription,
  slug: "", // homepage has no slug
  image: siteImage, // fallback OG image
  type: "website",
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteTitle,
          url: siteUrl,
          logo: `${siteUrl}/logo/blog_logo_dark.svg`,
          /*
          sameAs: [
            "https://www.facebook.com/MyGovBlog",
            "https://twitter.com/MyGovBlog",
            "https://www.instagram.com/MyGovBlog",
            "https://www.linkedin.com/company/mygovblog",
          ],
          */
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteTitle,
          url: siteUrl,
          inLanguage: "en-US",
        }}
      />
      <BlogIndexClient posts={allPosts} />
    </>
  );
}
