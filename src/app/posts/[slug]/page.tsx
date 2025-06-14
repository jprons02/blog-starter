import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import Tag from "@/app/components/Tag";
import StickyBackButton from "@/app/components/StickyBackButton";
import FadeIn from "@/app/components/FadeIn";

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${params.slug}`
  );
  if (!post) return notFound();

  const Content = getMDXComponent(post.body.code);

  return (
    <>
      <article className="max-w-3xl mx-auto py-12 px-4">
        {post.image && (
          <FadeIn>
            <div className="mb-4">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-xl w-full h-auto object-cover"
                priority
              />
            </div>
          </FadeIn>
        )}

        <FadeIn>
          <p className="text-sm" style={{ color: "var(--color-muted-text)" }}>
            {new Date(post.date).toLocaleDateString()}
          </p>
        </FadeIn>

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
            <Content />
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
import { getPostMeta } from "@/lib/seo";

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
  return getPostMeta({
    title: post.title, // Post title for <title> tag, Open Graph, and Twitter
    description: post.summary || "", // Post summary for meta description
    slug: post._raw.flattenedPath.replace(/^posts\//, ""), // Slug used to build canonical and OG URLs
    image: post.image, // Optional cover image for OG/Twitter cards
  });
}
