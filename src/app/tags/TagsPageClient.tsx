/*
"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/app/components/ui/BlogCard";
import Tag from "@/app/components/ui/Tag";
import FadeIn from "@/app/components/ui/FadeIn";
import { sortPosts } from "@/lib/posts";
import type { Post } from "contentlayer/generated";
import { useTagNavigation } from "@/app/hooks/useTagNavigation";

const CATEGORIES = [
  "Housing & Utilities",
  "Phones & Internet",
  "Health & Nutrition",
  "Money & Benefits",
];

export default function TagsPageClient({ allPosts }: { allPosts: Post[] }) {
  const goToTagPage = useTagNavigation();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [postsByCategory, setPostsByCategory] = useState<Post[]>([]);

  useEffect(() => {
    setPostsByCategory(
      allPosts.filter((post) =>
        post.category?.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      ) || []
    );
  }, [selectedCategory, allPosts]);

  const handleTagClick = goToTagPage;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const tagMap = new Map<string, string>();
  for (const post of postsByCategory) {
    for (const rawTag of post.tags || []) {
      const key = rawTag.toLowerCase();
      if (!tagMap.has(key)) tagMap.set(key, rawTag);
    }
  }

  const tags = Array.from(tagMap.values()).sort();
  const sortedPosts = sortPosts(postsByCategory);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Browse by Tag
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition hover:shadow-sm hover:brightness-110"
            style={{
              backgroundColor:
                selectedCategory === category
                  ? "var(--color-primary)"
                  : "var(--color-tag-bg)",
              color:
                selectedCategory === category
                  ? "var(--color-background)"
                  : "var(--color-tag-text)",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Tag key={tag} name={tag} onClick={() => handleTagClick(tag)} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard post={post} onTagClick={goToTagPage} />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
*/

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BlogCard from "@/app/components/ui/BlogCard";
import Tag from "@/app/components/ui/Tag";
import FadeIn from "@/app/components/ui/FadeIn";
import { sortPosts } from "@/lib/posts";
import type { Post } from "contentlayer/generated";
import { useTagNavigation } from "@/app/hooks/useTagNavigation";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Housing & Utilities",
  "Phones & Internet",
  "Health & Nutrition",
  "Money & Benefits",
];

type HeaderData = { title: string; subtitle?: string };
type TagsPageLocation = {
  state: string;
  city: string;
  stateName: string;
  cityName: string;
};

type Props = {
  allPosts: Post[];
  header?: HeaderData;
  locations?: TagsPageLocation[];
  current?: TagsPageLocation; // when on a city page
};

function slugifyTag(t: string) {
  return encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"));
}

export default function TagsPageClient({
  allPosts,
  header,
  locations,
  current,
}: Props) {
  const goToTagPage = useTagNavigation();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const router = useRouter();

  // Filter posts by selected category
  const postsByCategory = useMemo(() => {
    const lc = selectedCategory.toLowerCase();
    return (
      allPosts.filter((post) =>
        post.category?.some((cat) => cat.toLowerCase() === lc)
      ) || []
    );
  }, [selectedCategory, allPosts]);

  const handleTagClick = (tag: string) => {
    if (current) {
      router.push(
        `/locations/${current.state}/${current.city}/tags/${slugifyTag(tag)}`
      );
    } else {
      router.push(`/tags/${slugifyTag(tag)}`);
    }
  };
  const handleCategoryChange = (category: string) =>
    setSelectedCategory(category);

  // Build a unique tag list
  const tags = useMemo(() => {
    const tagMap = new Map<string, string>();
    for (const post of postsByCategory) {
      for (const rawTag of post.tags || []) {
        const key = rawTag.toLowerCase();
        if (!tagMap.has(key)) tagMap.set(key, rawTag);
      }
    }
    return Array.from(tagMap.values()).sort();
  }, [postsByCategory]);

  const sortedPosts = useMemo(
    () => sortPosts(postsByCategory),
    [postsByCategory]
  );

  // 👇 Build the destination URL for each card.
  // If we're on a city page (current is set), send users to the localized article.
  // Otherwise, fall back to the standard /posts/:slug.
  const buildPostHref = useMemo(() => {
    if (!current) {
      return (post: Post) =>
        `/posts/${post._raw.flattenedPath.replace(/^posts\//, "")}`;
    }
    return (post: Post) =>
      `/locations/${current.state}/${
        current.city
      }/posts/${post._raw.flattenedPath.replace(/^posts\//, "")}`;
  }, [current]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          {header?.title ?? "Browse by Tag"}
        </h1>
        {header?.subtitle && (
          <p className="text-muted-foreground mt-1">{header.subtitle}</p>
        )}
      </header>

      {/* Optional locations list */}
      {Array.isArray(locations) && locations.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            Cities{current?.stateName ? ` in ${current.stateName}` : ""}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {locations.map((loc) => {
              const href = `/locations/${loc.state}/${loc.city}`;
              const isCurrent =
                current &&
                loc.state === current.state &&
                loc.city === current.city;
              return (
                <li key={`${loc.state}/${loc.city}`}>
                  <Link
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`inline-block px-3 py-1 rounded-full text-sm transition hover:shadow-sm ${
                      isCurrent
                        ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                        : "bg-[var(--color-tag-bg)] text-[var(--color-tag-text)]"
                    }`}
                  >
                    {loc.cityName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition hover:shadow-sm hover:brightness-110"
            style={{
              backgroundColor:
                selectedCategory === category
                  ? "var(--color-primary)"
                  : "var(--color-tag-bg)",
              color:
                selectedCategory === category
                  ? "var(--color-background)"
                  : "var(--color-tag-text)",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Tag key={tag} name={tag} onClick={() => handleTagClick(tag)} />
        ))}
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <FadeIn key={post._id}>
            <BlogCard
              post={post}
              onTagClick={goToTagPage}
              href={buildPostHref(post)}
            />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
