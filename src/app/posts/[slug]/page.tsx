import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import Tag from "@/app/components/Tag";
import StickyBackButton from "@/app/components/StickyBackButton";
import FadeInWrapper from "@/app/components/FadeInWrapper";

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
            <Content />
          </div>
        </FadeInWrapper>
      </article>
      <StickyBackButton />
    </>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${params.slug}`
  );
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

/*
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer2/hooks";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === `posts/${params.slug}`
  );

  if (!post?.body.code) {
    return <div>No post here!</div>;
  }
  const Content = getMDXComponent(post.body.code);
  return (
    <div>
      {post.title}
      <Content />
    </div>
  );
}
*/
