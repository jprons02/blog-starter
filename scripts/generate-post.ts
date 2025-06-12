// This script is a CLI tool that prompts the user for a blog topic,
// uses OpenAI to generate an SEO-optimized blog post in MDX format,
// fetches 3 relevant images from the Pexels API (landscape only),
// and saves the post to the `content/posts` directory in Contentlayer-compatible format.

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
  const toolDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
    type: "function",
    function: {
      name: "generate_blog_post",
      description:
        "Create a structured, SEO-optimized blog post about a topic.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          slug: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          date: { type: "string" },
          content: { type: "string" },
        },
        required: ["title", "summary", "slug", "tags", "date", "content"],
      },
    },
  };

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: `Write a fully fleshed-out blog post on: "${topic}" that includes:

- A strong H1 title
- SEO-optimized summary, slug, tags, and date
- A short introductory paragraph
- At least 4 sections with H2s and H3s if needed
- One bulleted list (\* or -) and one numbered list (1. 2. 3.)
- One blockquote with a tip or insight
- Natural language with helpful, informative tone
- Well-structured Markdown with ul/li and MDX-safe formatting`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    tools: [toolDefinition],
    tool_choice: { type: "function", function: { name: "generate_blog_post" } },
  });

  const toolCall = response.choices[0].message?.tool_calls?.[0];
  if (!toolCall || !toolCall.function?.arguments) {
    throw new Error("No tool_call or arguments returned by OpenAI.");
  }

  const parsed = JSON.parse(toolCall.function.arguments);
  const { title, summary, slug, tags, date, content: rawContent } = parsed;
  const cleanedContent = rawContent.replace(/^# .*?\n+/i, "").trim();

  return {
    frontmatter: { title, summary, slug, tags, date },
    content: `# ${title}\n\n${cleanedContent}`,
  };
}

async function getPexelsImages(): Promise<{ url: string; alt: string }[]> {
  const keyword = await promptUser(
    "\n🔍 Enter 1-2 keywords to search for images on Pexels: "
  );

  if (!PEXELS_API_KEY) {
    console.error("❌ Missing PEXELS_API_KEY in .env.local");
    return [];
  }

  interface PexelsPhoto {
    alt: string;
    src: { original: string };
    photographer: string;
  }

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      keyword
    )}&orientation=landscape&per_page=5`,
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

  const data = (await response.json()) as { photos: PexelsPhoto[] };

  return data.photos.slice(0, 3).map((photo) => ({
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

  const formatted = matter.stringify("", frontmatter);

  const commentLines = [
    "{/* Suggested cover images: */",
    "{/* Add an 'image: url' under the date above to include the image. */}",
    ...images.map((img, i) => `{/* ${i + 1}. ${img.url} — ${img.alt} */}`),
  ];

  const commentBlock = commentLines.join("\n");
  const withFrontmatter = `${formatted}\n${commentBlock}\n\n${content}\n`;

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  await fs.writeFile(filePath, withFrontmatter);
  console.log(`\u2728 Contentlayer-ready post saved: ${filePath}`);
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
