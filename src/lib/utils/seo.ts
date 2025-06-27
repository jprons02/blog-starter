import { siteUrl, siteTitle, siteDescription, siteImage } from "./constants";

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
  image,
  type = "article",
}: SEOProps) {
  const fallbackImage = siteImage;
  const url = `${siteUrl}/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      images: [{ url: image || fallbackImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || fallbackImage],
    },
  };
}
