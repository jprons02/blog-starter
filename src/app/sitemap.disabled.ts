// app/sitemap.ts
/*
import type { MetadataRoute } from "next";
import { allPosts, type Post } from "contentlayer/generated";
import { siteUrl } from "@/lib/utils/constants";
import { getAllLocations } from "@/app/locations/_locationsData";
import { localizedPostSlugs } from "@/constants/localizedPosts";



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

  // 2) State hubs & city hubs
  const locs = getAllLocations();
  const states = Array.from(new Set(locs.map((l) => l.state)));
  states.forEach((state) =>
    add(make(`/locations/${state}`, now, "weekly", 0.7))
  );
  locs.forEach(({ state, city }) =>
    add(make(`/locations/${state}/${city}`, now, "weekly", 0.6))
  );

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
  const curated = localizedPostSlugs();
  const lastModBySlug = new Map<string, Date>();
  visiblePosts.forEach((p) =>
    lastModBySlug.set(
      p._raw.flattenedPath.replace(/^posts\//, ""),
      lastModifiedOf(p, now)
    )
  );

  locs.forEach(({ state, city }) => {
    curated.forEach((slug) => {
      const lm = clampFuture(lastModBySlug.get(slug) ?? now, now);
      add(
        make(`/locations/${state}/${city}/posts/${slug}`, lm, "monthly", 0.55)
      );
    });
  });

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

  // 6) Localized tag pages: /locations/:state/:city/tags/:tag
  locs.forEach(({ state, city }) => {
    topTagEntries.forEach(([tagSlug, lm]) => {
      add(
        make(
          `/locations/${state}/${city}/tags/${tagSlug}`,
          clampFuture(lm, now),
          "weekly",
          0.42
        )
      );
    });
  });

  // 7) Return stable, alpha-sorted list
  return Array.from(entries.values()).sort((a, b) =>
    a.url.localeCompare(b.url)
  );
}


export const revalidate = 86400;
*/

// app/sitemap.ts
/*
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(); // simple, deterministic
  return [
    {
      url: "https://mygovblog.com/",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://mygovblog.com/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://mygovblog.com/tools/check-benefits",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://mygovblog.com/locations",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}

export const revalidate = 86400; // daily
*/
