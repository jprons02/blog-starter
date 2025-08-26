// /app/posts/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";
import { formatDate } from "@/lib/utils/formatDate";
import BenefitsCtaBanner from "@/app/components/BenefitsCtaBanner";
import AffiliateCtaBanner from "@/app/components/AffiliateCtaBanner";
import AffiliateDisclosure from "@/app/components/AffiliateDisclaimer";
import PostTags from "./PostTags";
import CrossLink from "@/app/components/mdxHelper/CrossLink";

/* ---------------- page ---------------- */
export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const post = allPosts.find((p) => p._raw.flattenedPath === `posts/${slug}`);
  if (!post) return notFound();

  const Content = getMDXComponent(post.body.code);

  // ✅ include the location-aware tokens; they’ll no-op without a provider
  const mdxComponents = {
    BenefitsCtaBanner,
    AffiliateCtaBanner,
    AffiliateDisclosure,
    CrossLink,
  };

  return (
    <>
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {post.title}
          </h1>
          <p
            className="font-medium uppercase tracking-wide mb-6"
            style={{ color: "var(--color-muted-text)", fontSize: "0.65rem" }}
          >
            {formatDate(post.date)}&nbsp;&nbsp;•&nbsp;&nbsp;
            {post.author?.toUpperCase() || "STAFF"}
          </p>
        </FadeIn>

        {post.image && (
          <FadeIn>
            <div className="mb-6">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                sizes="(max-width: 1024px) 100vw, 800px"
                className="rounded-xl w-full h-auto object-cover"
                priority
              />
              <figcaption className="text-sm mt-2 text-muted">
                Photo by{" "}
                <a
                  href={post.imageCreditUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.imageCreditName || "Unknown Photographer"}
                </a>{" "}
                on{" "}
                <a
                  href="https://www.pexels.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pexels
                </a>
              </figcaption>
            </div>
          </FadeIn>
        )}

        {Array.isArray(post.tags) && (
          <FadeIn>
            <PostTags tags={post.tags} />
          </FadeIn>
        )}

        <FadeIn>
          <div className="markdown-body text-base leading-relaxed">
            <Content components={mdxComponents} />
          </div>
        </FadeIn>
      </article>
    </>
  );
}

/* ---------------- metadata ---------------- */
import type { Metadata } from "next";
import { getPageMeta } from "@/lib/utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = allPosts.find((p) => p._raw.flattenedPath === `posts/${slug}`);
  if (!post) return {};

  return getPageMeta({
    title: post.seoTitle ?? post.title,
    description: post.summary || "Helpful guides on US benefit programs.",
    slug: post._raw.flattenedPath.replace(/^posts\//, ""),
    image: post.image,
    type: "article",
  });
}
