// app/sitemap.ts
import type { MetadataRoute } from "next";
import { allPosts, type Post } from "contentlayer/generated";
import { siteUrl } from "@/lib/utils/constants";
import { getAllLocations } from "@/app/locations/_locationsData";
import { localizedPostSlugs } from "@/constants/localizedPosts";

/* -----------------------------------------------------------------------------
   Helpers
----------------------------------------------------------------------------- */

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

const join = (base: string, path: string) =>
  `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

const normalizeLastMod = (raw: string): Date =>
  raw?.includes("T") ? new Date(raw) : new Date(`${raw}T00:00:00Z`);

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

/* -----------------------------------------------------------------------------
   Sitemap
   - Static core pages
   - Canonical posts
   - Location city hubs: /locations/:state/:city  (no /locations/:state layer)
   - Localized post variants for curated slugs only (avoid 404s)
   - Tags hub + top tags
----------------------------------------------------------------------------- */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // De-dupe by absolute URL
  const entries = new Map<string, Entry>();
  const add = (e: Entry) => entries.set(e.url, e);

  // 1) Static & hubs
  [
    make("/", now, "daily", 1.0),
    make("/about", now, "monthly", 0.7),
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

  // Newest visible post timestamp (fallback)
  const newestVisibleTs =
    visiblePosts.reduce((max, p) => {
      const t = lastModifiedOf(p, now).getTime();
      return t > max ? t : max;
    }, 0) || now.getTime();

  // 2) City hubs (only /locations/:state/:city — there is NO /locations/:state)
  const locs = getAllLocations(); // [{ state, city, stateName, cityName }, ...]
  const curatedSlugs = localizedPostSlugs();

  if (process.env.NODE_ENV !== "production") {
    const missing = curatedSlugs.filter((s) => !lastModBySlug.has(s));
    if (missing.length) {
      console.warn(
        "[sitemap] Missing localized post slugs in contentlayer:",
        missing
      );
    }
  }

  locs.forEach(({ state, city }) => {
    // lastmod = newest among curated slugs that exist, else newest visible
    let ts = 0;
    for (const slug of curatedSlugs) {
      const d = lastModBySlug.get(slug);
      if (d) ts = Math.max(ts, d.getTime());
    }
    if (!ts) ts = newestVisibleTs;

    const lm = clampFuture(new Date(ts), now);
    add(make(`/locations/${state}/${city}`, lm, "weekly", 0.6));
  });

  // 3) Canonical (non-localized) posts
  visiblePosts.forEach((post) => {
    const slug = post._raw.flattenedPath.replace(/^posts\//, "");
    const lm = clampFuture(lastModBySlug.get(slug) ?? now, now);
    add(make(`/posts/${slug}`, lm, "weekly", 0.65));
  });

  // 4) Localized post variants (curated ONLY, and only if canonical exists)
  locs.forEach(({ state, city }) => {
    curatedSlugs.forEach((slug) => {
      const lmDate = lastModBySlug.get(slug);
      if (!lmDate) return; // skip missing/renamed slugs to avoid 404s
      const lm = clampFuture(lmDate, now);
      add(
        make(`/locations/${state}/${city}/posts/${slug}`, lm, "monthly", 0.55)
      );
    });
  });

  // 5) Tags hub + /tags/:tag (top N by freshness)
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

  // 6) Return stable, alpha-sorted list (absolute URLs)
  return Array.from(entries.values()).sort((a, b) =>
    a.url.localeCompare(b.url, "en")
  );
}

/* Revalidate once per day */
export const revalidate = 86_400;
