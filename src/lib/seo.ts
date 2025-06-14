import { siteUrl } from "./constants";

export type SEOProps = {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: "website" | "article";
};

const BASE_URL = siteUrl;

export function getPostMeta({
  title,
  description,
  slug = "",
  image = `${BASE_URL}/default-og.jpg`,
  type = "article",
}: SEOProps) {
  const url = `${BASE_URL}/blog/${slug}`;

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
    metadataBase: new URL(BASE_URL),
  };
}
