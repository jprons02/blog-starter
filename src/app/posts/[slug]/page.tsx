import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import Tag from "@/app/components/ui/Tag";
import StickyBackButton from "@/app/components/layout/StickyBackButton";
import FadeIn from "@/app/components/ui/FadeIn";
import { formatDate } from "@/lib/utils/formatDate";
import BenefitsCtaBanner from "@/app/components/BenefitsCtaBanner";

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${params.slug}`
  );
  if (!post) return notFound();

  const Content = getMDXComponent(post.body.code);
  const components = { BenefitsCtaBanner };
  return (
    <>
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {post.title}
          </h1>
          <p
            className="font-medium uppercase tracking-wide mb-6"
            style={{
              color: "var(--color-muted-text)",
              fontSize: "0.65rem",
            }}
          >
            {formatDate(post.date)}
            &nbsp;&nbsp;•&nbsp;&nbsp;
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
            <div className="flex flex-wrap gap-2 mt-2 mb-6">
              {post.tags.map((tag: string) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn>
          <div className="markdown-body text-base leading-relaxed">
            <Content components={components} />
          </div>
        </FadeIn>
      </article>
      <StickyBackButton />
    </>
  );
}

// Dynamically generates SEO metadata for individual blog posts
// using Contentlayer data and a reusable metadata helper.
// Includes Open Graph and Twitter card support.
import { getPageMeta } from "@/lib/utils/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find the matching post from Contentlayer using the flattenedPath format (e.g., 'posts/my-post')
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${slug}`
  );
  if (!post) return {};

  // Generate SEO metadata using a reusable helper
  return getPageMeta({
    title: post.title, // Post title for <title> tag, Open Graph, and Twitter
    description: post.summary || "Helpful guides on US benefit programs.", // Post summary for meta description
    slug: post._raw.flattenedPath.replace(/^posts\//, ""), // Slug used to build canonical and OG URLs
    image: post.image, // Optional cover image for OG/Twitter cards
    type: "article",
  });
}
