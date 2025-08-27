// Slugs must match your Contentlayer slugs (file names under /posts)
// THIS IS WRONG
export const LOCALIZED_POSTS = new Set<string>([
  "how-to-apply-for-snap-benefits-food-stamps-without-the-confusion",
  "wic-benefits-how-to-apply",
  "liheap-energy-assistance-what-to-know",
]);

// Optional helpers
export const isLocalizedPost = (slug: string) => LOCALIZED_POSTS.has(slug);
export const localizedPostSlugs = () => Array.from(LOCALIZED_POSTS);
