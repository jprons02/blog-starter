import { siteUrl, siteTitle, siteDescription } from "./constants";

export type SEOProps = {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: "website" | "article";
};

export function getPageMeta({
  title = siteTitle,
  description = siteDescription,
  slug = "",
  image = `${siteUrl}/default-og.jpg`,
  type = "article",
}: SEOProps) {
  const url = `${siteUrl}/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
