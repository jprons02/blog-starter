// generate-post.ts
// CLI tool to create Contentlayer-compatible blog posts using OpenAI and Pexels

import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { fetchImages, promptUser } from "../lib/pexels.ts";
import { formatPostToMDX } from "../lib/post-generator.ts";
import { generatePost } from "../lib/openai-post.ts";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const POSTS_DIR = "content/posts";

async function writePost(
  slug: string,
  meta: {
    title: string;
    summary: string;
    tags: string[];
    date: string;
    image?: string;
  },
  content: string,
  images: { url: string; alt: string }[]
) {
  if (images[0]) meta.image = images[0].url;

  const { title, summary, tags, date, image } = meta;

  const mdx = formatPostToMDX({ title, summary, tags, date, image, content });

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  await fs.writeFile(filePath, mdx);
  console.log(`✅ Saved: ${filePath}`);
}

async function run() {
  const topic = await promptUser("📝 Blog topic: ");
  const post = await generatePost(topic);
  const images = await fetchImages();
  await writePost(post.slug, post, post.content, images);
}

run();
