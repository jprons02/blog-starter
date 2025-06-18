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
  images: {
    url: string;
    alt: string;
    photographer: string;
    photographer_url: string;
  }[]
) {
  const image = images[0];

  const mdx = formatPostToMDX({
    ...meta,
    image: image?.url,
    imageCreditName: image?.photographer,
    imageCreditUrl: image?.photographer_url,
    content,
  });

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
