import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/posts";
import { getPostSlug } from "@/lib/utils/getPostSlug";

interface Props {
  currentSlug: string;
  tags: string[];
  /** Optional: prefix for links, e.g. "/locations/florida/miami" */
  basePath?: string;
  max?: number;
}

/**
 * Server component that renders related posts based on tag overlap.
 * Falls back to most-recent posts when no tags match.
 */
export default function RelatedPosts({
  currentSlug,
  tags,
  basePath = "",
  max = 3,
}: Props) {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  const scored = getPublishedPosts()
    .map((p) => {
      const slug = getPostSlug(p._raw.flattenedPath);
      if (slug === currentSlug) return null;
      const overlap = (p.tags ?? []).filter((t) =>
        tagSet.has(t.toLowerCase()),
      ).length;
      return { slug, title: p.title, image: p.image, overlap };
    })
    .filter(Boolean) as {
    slug: string;
    title: string;
    image?: string;
    overlap: number;
  }[];

  // Sort by tag overlap (desc), break ties by array order (already date-sorted)
  scored.sort((a, b) => b.overlap - a.overlap);

  const related = scored.slice(0, max);
  if (!related.length) return null;

  return (
    <nav
      aria-label="Related articles"
      className="mt-12 pt-8 border-t border-white/10"
    >
      <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((p) => (
          <li key={p.slug}>
            <Link
              href={`${basePath}/posts/${p.slug}`}
              className="group block rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition"
            >
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.title}
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover"
                />
              )}
              <span className="block p-3 text-sm font-medium leading-snug group-hover:underline">
                {p.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
