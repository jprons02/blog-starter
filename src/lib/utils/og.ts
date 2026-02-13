/** Metadata dynamic images */

import { getPublishedPosts } from "@/lib/posts";
import { siteImage } from "@/lib/utils/constants";

export function getOgImageForTag(tag: string): string {
  const normalizedTag = tag.toLowerCase();

  const post = getPublishedPosts().find((p) =>
    p.tags?.some((t) => t.toLowerCase() === normalizedTag),
  );

  return post?.image || siteImage;
}
