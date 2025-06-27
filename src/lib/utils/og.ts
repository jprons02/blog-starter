/** Metadata dynamic images */

import { allPosts } from "contentlayer/generated";
import { siteImage } from "@/lib/utils/constants";

export function getOgImageForTag(tag: string): string {
  const normalizedTag = tag.toLowerCase();

  const post = allPosts.find((p) =>
    p.tags?.some((t) => t.toLowerCase() === normalizedTag)
  );

  return post?.image || siteImage;
}
