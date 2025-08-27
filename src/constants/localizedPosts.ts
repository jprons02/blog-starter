// src/constants/localizedPosts.ts
// Slugs must exactly match /posts/*.mdx flattenedPath names
export const LOCALIZED_SLUGS = [
  "wic-vs-snap-what-s-the-difference-and-can-you-get-both",
  "how-to-apply-for-snap-benefits-food-stamps-without-the-confusion",
  "medicaid-101-how-low-income-health-coverage-works-in-your-state",
  "affordable-childcare-help-through-ccdf",
  "unemployment-benefits-and-job-search-tips",
  "mental-health-tips-for-unemployed-job-seekers",
  "how-to-get-help-with-utility-bills-liheap-and-other-resources",
] as const;

export type LocalizedSlug = (typeof LOCALIZED_SLUGS)[number];

export const LOCALIZED_POSTS = new Set<string>(LOCALIZED_SLUGS);

// Optional helpers (keep your existing API)
export const isLocalizedPost = (slug: string) => LOCALIZED_POSTS.has(slug);
export const localizedPostSlugs = () => [...LOCALIZED_SLUGS];
