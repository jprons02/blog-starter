// app/sitemap.ts

import type { MetadataRoute } from "next";
import { allPosts, type Post } from "contentlayer/generated";
import { siteUrl } from "@/lib/utils/constants";

type MaybeFrontmatterDates = {
  updatedAt?: string;
  lastmod?: string;
  date?: string;
};
type MaybeVisibility = {
  draft?: boolean;
  unlisted?: boolean;
  private?: boolean;
};

const lastModifiedOf = (p: Post, fallback: Date): Date => {
  const m = p as unknown as MaybeFrontmatterDates;
  const raw = m.updatedAt ?? m.lastmod ?? p.date;
  return raw ? new Date(raw) : fallback;
};

const isVisible = (p: Post): boolean => {
  const v = p as unknown as MaybeVisibility;
  return !(v.draft || v.unlisted || v.private);
};

const clampFuture = (d: Date, now: Date) =>
  d.getTime() > now.getTime() ? now : d;

const join = (base: string, path: string) =>
  `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

type Entry = MetadataRoute.Sitemap[number];
const make = (
  path: string,
  lastModified: Date,
  changeFrequency: Entry["changeFrequency"],
  priority: number
): Entry => ({
  url: join(siteUrl, path),
  lastModified,
  changeFrequency,
  priority,
});

const slugifyTag = (t: string) =>
  encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"));

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries = new Map<string, Entry>(); // de-dupe by absolute URL
  const add = (e: Entry) => entries.set(e.url, e);

  // 1) Static & hubs
  [
    make("/", now, "daily", 1.0),
    make("/about", now, "monthly", 0.8),
    make("/tools/check-benefits", now, "weekly", 0.9),
    make("/locations", now, "weekly", 0.8),
  ].forEach(add);

  // 3) Canonical (non-localized) posts
  const visiblePosts = allPosts.filter(isVisible);
  visiblePosts.forEach((post) => {
    const slug = post._raw.flattenedPath.replace(/^posts\//, "");
    add(
      make(
        `/posts/${slug}`,
        clampFuture(lastModifiedOf(post, now), now),
        "weekly",
        0.6
      )
    );
  });

  // 4) Localized post variants (curated)
  const lastModBySlug = new Map<string, Date>();
  visiblePosts.forEach((p) =>
    lastModBySlug.set(
      p._raw.flattenedPath.replace(/^posts\//, ""),
      lastModifiedOf(p, now)
    )
  );

  // 5) Global tags hub + /tags/:tag (dated by freshest related post)
  add(make("/tags", now, "weekly", 0.5));
  const newestByTag = new Map<string, Date>();
  visiblePosts.forEach((p) => {
    const lm = lastModifiedOf(p, now);
    (p.tags ?? []).forEach((t) => {
      const key = slugifyTag(t);
      const prev = newestByTag.get(key);
      if (!prev || lm > prev) newestByTag.set(key, lm);
    });
  });

  // 3) Soft cap (top N tags by freshness) to keep sitemap lean as you grow
  const MAX_TAGS = 200; // adjust as needed
  const topTagEntries = Array.from(newestByTag.entries())
    .sort((a, b) => b[1].getTime() - a[1].getTime())
    .slice(0, MAX_TAGS);

  topTagEntries.forEach(([tagSlug, lm]) =>
    add(make(`/tags/${tagSlug}`, clampFuture(lm, now), "weekly", 0.45))
  );

  // 7) Return stable, alpha-sorted list
  return Array.from(entries.values()).sort((a, b) =>
    a.url.localeCompare(b.url)
  );
}

export const revalidate = 86400;
