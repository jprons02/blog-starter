// app/sitemap.ts
import type { MetadataRoute } from "next";
import { allPosts, type Post } from "contentlayer/generated";
import { siteUrl } from "@/lib/utils/constants";
import { getAllLocations } from "@/app/locations/_locationsData";
import { localizedPostSlugs } from "@/constants/localizedPosts";

/* ----------------------------- helpers (typed) ----------------------------- */

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

const normalizeLastMod = (raw: string): Date =>
  raw.includes("T") ? new Date(raw) : new Date(`${raw}T00:00:00Z`);

const lastModifiedOf = (p: Post, fallback: Date): Date => {
  const m = p as unknown as MaybeFrontmatterDates;
  const raw = m.updatedAt ?? m.lastmod ?? p.date;
  return raw ? normalizeLastMod(raw) : fallback;
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
  changeFrequency?: Entry["changeFrequency"],
  priority?: number
): Entry => ({
  url: join(siteUrl, path),
  lastModified,
  changeFrequency,
  priority,
});

const slugifyTag = (t: string) =>
  encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"));

/* --------------------------------- sitemap --------------------------------- */

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

  // Visible posts + per-slug lastmod
  const visiblePosts = allPosts.filter(isVisible);
  const lastModBySlug = new Map<string, Date>();
  visiblePosts.forEach((p) => {
    const slug = p._raw.flattenedPath.replace(/^posts\//, "");
    lastModBySlug.set(slug, lastModifiedOf(p, now));
  });

  // 2) City hubs with meaningful lastmod (newest among curated localized posts)
  const locs = getAllLocations();
  const curated = localizedPostSlugs();
  locs.forEach(({ state, city }) => {
    let ts = 0;
    for (const slug of curated) {
      const d = lastModBySlug.get(slug);
      if (d) ts = Math.max(ts, d.getTime());
    }
    const lm = clampFuture(ts ? new Date(ts) : now, now);
    add(make(`/locations/${state}/${city}`, lm, "weekly", 0.6));
  });

  // 3) Canonical (non-localized) posts
  visiblePosts.forEach((post) => {
    const slug = post._raw.flattenedPath.replace(/^posts\//, "");
    const lm = clampFuture(lastModBySlug.get(slug) ?? now, now);
    add(make(`/posts/${slug}`, lm, "weekly", 0.6));
  });

  // 4) Localized post variants (curated)
  locs.forEach(({ state, city }) => {
    curated.forEach((slug) => {
      const lm = clampFuture(lastModBySlug.get(slug) ?? now, now);
      add(
        make(`/locations/${state}/${city}/posts/${slug}`, lm, "monthly", 0.55)
      );
    });
  });

  // 5) Global tags hub + /tags/:tag (top N by freshness)
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

  const MAX_TAGS = 200;
  Array.from(newestByTag.entries())
    .sort((a, b) => b[1].getTime() - a[1].getTime())
    .slice(0, MAX_TAGS)
    .forEach(([tagSlug, lm]) =>
      add(make(`/tags/${tagSlug}`, clampFuture(lm, now), "weekly", 0.45))
    );

  // 6) Return stable, alpha-sorted list
  return Array.from(entries.values()).sort((a, b) =>
    a.url.localeCompare(b.url, "en")
  );
}

/* Revalidate once per day */
export const revalidate = 86400;
