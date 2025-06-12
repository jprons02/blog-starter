import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import Tag from "@/app/components/Tag";
import StickyBackButton from "@/app/components/StickyBackButton";
import FadeInWrapper from "@/app/components/FadeInWrapper";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((p) => p.url === `/blog/${params.slug}`);
  if (!post) return notFound();

  const MDXContent = useMDXComponent(post.body.code);

  return (
    <>
      <article className="max-w-3xl mx-auto py-12 px-4">
        {post.image && (
          <FadeInWrapper>
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
          </FadeInWrapper>
        )}

        <FadeInWrapper>
          <p className="text-sm" style={{ color: "var(--color-muted-text)" }}>
            {new Date(post.date).toLocaleDateString()}
          </p>
        </FadeInWrapper>

        {Array.isArray(post.tags) && (
          <FadeInWrapper>
            <div className="flex flex-wrap gap-2 mt-2 mb-6">
              {post.tags.map((tag: string) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          </FadeInWrapper>
        )}

        <FadeInWrapper>
          <div className="markdown-body text-base leading-relaxed">
            <MDXContent />
          </div>
        </FadeInWrapper>
      </article>
      <StickyBackButton />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((p) => p.url === `/blog/${params.slug}`);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary || "",
    openGraph: {
      title: post.title,
      description: post.summary || "",
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || "",
      images: post.image ? [post.image] : [],
    },
  };
}
