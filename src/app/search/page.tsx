// app/search/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getPostSlug } from "@/lib/utils/getPostSlug";

export const metadata: Metadata = {
  title: "Search",
  description: "Find articles on housing, utilities, food, and benefits.",
  alternates: { canonical: "/search" },
  // Keep search results out of the index, but let bots follow links.
  robots: { index: false, follow: true },
};

// In Next 15 typed routes, searchParams is a Promise
type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const { q } = await props.searchParams;
  const query = (q ?? "").trim();
  const needle = query.toLowerCase();

  const results = query
    ? getPublishedPosts().filter((p) => {
        const haystack = [
          p.title,
          p.summary,
          ...(Array.isArray(p.tags) ? p.tags : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
    : [];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <form action="/search" method="get" className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search MyGovBlog…"
          className="w-full border rounded-xl px-4 py-3"
        />
      </form>

      {query ? (
        <>
          <p className="text-sm mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for “
            {query}”
          </p>
          <ul className="space-y-5">
            {results.map((p) => {
              const slug = getPostSlug(p._raw.flattenedPath);
              return (
                <li key={p._id}>
                  <h3 className="font-semibold text-lg">
                    <Link href={`/posts/${slug}`}>{p.title}</Link>
                  </h3>
                  {p.summary && (
                    <p className="text-sm text-muted-foreground">{p.summary}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Type a term to search.</p>
      )}
    </main>
  );
}
