// generate-post.ts
// CLI tool to create Contentlayer-compatible blog posts using OpenAI and Pexels

import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import readline from "readline";
import fetch from "node-fetch";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const POSTS_DIR = "content/posts";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

async function generatePost(topic: string) {
  const toolDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
    type: "function",
    function: {
      name: "generate_blog_post",
      description: "Create a structured blog post with metadata.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          date: { type: "string" },
          content: { type: "string" },
        },
        required: ["title", "summary", "tags", "date", "content"],
      },
    },
  };

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: `Write a detailed MDX blog post on: "${topic}".
Include:
- SEO-friendly summary
- Tags and ISO 8601 date
- Short intro, 4+ sections, bullet and number list
- A tip in a blockquote
- Valid Markdown formatting for MDX

Do NOT include an H1 heading.`,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    tools: [toolDefinition],
    tool_choice: { type: "function", function: { name: "generate_blog_post" } },
  });

  const args =
    response.choices[0].message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("OpenAI returned no arguments.");

  const { title, summary, tags, date, content } = JSON.parse(args);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return { title, summary, tags, date, slug, content };
}

interface PexelsPhoto {
  alt: string;
  src: { original: string };
  photographer: string;
}

async function fetchImages(): Promise<{ url: string; alt: string }[]> {
  const keyword = await promptUser("\n🔍 Keyword(s) for Pexels image: ");
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      keyword
    )}&orientation=landscape&per_page=3`,
    {
      headers: { Authorization: PEXELS_API_KEY },
    }
  );
  const data = (await res.json()) as { photos: PexelsPhoto[] };
  return data.photos.map((p) => ({
    url: p.src.original,
    alt: p.alt || `Image by ${p.photographer}`,
  }));
}

async function writePost(
  slug: string,
  meta: any,
  content: string,
  images: { url: string; alt: string }[]
) {
  if (images[0]) meta.image = images[0].url;

  const { title, summary, tags, date, image } = meta;

  const frontmatterLines = [
    `title: ${JSON.stringify(title)}`,
    `summary: ${JSON.stringify(summary)}`,
    `tags: ${JSON.stringify(tags)}`,
    `date: ${JSON.stringify(date)}`,
    ...(image ? [`image: ${JSON.stringify(image)}`] : []),
  ];

  const mdx = `---\n${frontmatterLines.join(
    "\n"
  )}\n---\n\n# ${title}\n\n${content.trim()}\n`;

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
