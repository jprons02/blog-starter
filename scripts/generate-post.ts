// This script is a CLI tool that prompts the user for a blog topic,
// uses OpenAI to generate a markdown post with SEO-optimized frontmatter,
// and uses the Pexels API to fetch 3 relevant images for the post.

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";
import readline from "readline";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const POSTS_DIR = "content/posts";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

async function generatePost(
  topic: string
): Promise<{ frontmatter: any; content: string }> {
  const prompt = `
You are an SEO expert and AI technical writer. Write a blog post on the topic: "${topic}".
Ensure the writing is optimized for search engines and human readability.

Return a JSON object with the following keys:
- title (professional, 5–10 words, contains primary keyword)
- summary (1–2 sentence SEO meta description with keywords)
- slug (URL-safe lowercase slug including keyword)
- tags (3–5 SEO-relevant keywords)
- date (today’s date: ${getTodayDate()})
- content (markdown content only, no frontmatter)

⚠️ Important: Return ONLY a valid JSON object. Do NOT include markdown formatting, explanations, or code blocks.
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message?.content || "{}";
  console.log("📥 Raw OpenAI response:\n", raw);

  try {
    const parsed = JSON.parse(raw);
    const { title, summary, slug, tags, date, content } = parsed;
    return {
      frontmatter: { title, summary, slug, tags, date },
      content,
    };
  } catch {
    throw new Error("Failed to parse OpenAI response as JSON.");
  }
}

async function getPexelsImages(): Promise<{ url: string; alt: string }[]> {
  const keyword = await promptUser(
    "\n🔍 Enter 1-2 keywords to search for images on Pexels: "
  );

  if (!PEXELS_API_KEY) {
    console.error("❌ Missing PEXELS_API_KEY in .env.local");
    return [];
  }

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      keyword
    )}&per_page=5`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    console.error("❌ Failed to fetch images from Pexels API.");
    return [];
  }

  interface PexelsPhoto {
    alt: string;
    src: { original: string };
    photographer: string;
  }

  const data = (await response.json()) as { photos: PexelsPhoto[] };

  return (data.photos || []).slice(0, 3).map((photo: any) => ({
    url: photo.src.original,
    alt: photo.alt || `Image from Pexels by ${photo.photographer}`,
  }));
}

async function writePostFile(
  slug: string,
  frontmatter: any,
  content: string,
  images: { url: string; alt: string }[]
) {
  if (images.length > 0) {
    frontmatter.image = images[0].url;
  }

  const formatted = matter.stringify(content, frontmatter);
  const commentBlock = [
    "{/* Suggested cover images:",
    'Add an "image: url" under the date above to include the image.',
    "",
    ...images.map((img, i) => `${i + 1}. ${img.url} — ${img.alt}`),
    "*/}",
  ].join("\n");

  const withComment = `${formatted}\n\n${commentBlock}\n`;
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  await fs.writeFile(filePath, withComment);
  console.log(`\u2728 Post saved: ${filePath}`);
}

async function run() {
  const topic = await promptUser("\u270D\uFE0F Blog topic: ");
  try {
    const { frontmatter, content } = await generatePost(topic);
    const images = await getPexelsImages();
    await writePostFile(frontmatter.slug, frontmatter, content, images);
  } catch (err) {
    console.error("\u274C Error:", err);
  }
}

run();
