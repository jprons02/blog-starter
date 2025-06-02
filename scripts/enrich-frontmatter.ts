import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const POSTS_DIR = "content/posts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📅 Return today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// 🧼 Ensure consistent frontmatter ordering
function formatFrontmatter(data: Record<string, any>): Record<string, any> {
  return {
    title: data.title ?? "",
    date: data.date ?? getTodayDate(),
    slug: data.slug ?? "",
    summary: data.summary ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

// 🧠 Generate core SEO fields from blog content
async function generateSEOFields(content: string): Promise<{
  title: string;
  summary: string;
  slug: string;
  tags: string[];
}> {
  const prompt = `
You are an SEO assistant for a technical blog. Based on the blog content below, return a JSON object with these fields:

1. title: (5–10 words, professional, capitalized)
2. summary: (1–2 sentence SEO meta description)
3. slug: (URL-safe lowercase slug)
4. tags: (3–5 relevant keywords, lowercase)

Content:
${content}

Return only valid JSON.
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    return JSON.parse(response.choices[0].message?.content || "{}");
  } catch {
    console.warn("⚠️ Failed to parse SEO fields from OpenAI.");
    return {
      title: "",
      summary: "",
      slug: "",
      tags: [],
    };
  }
}

// ✨ Enrich a single post with SEO frontmatter
async function enrichPost(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  const needsEnrichment =
    !data.title ||
    !data.summary ||
    !data.slug ||
    !data.tags ||
    data.tags.length === 0;

  let enriched = { ...data };

  if (needsEnrichment) {
    const generated = await generateSEOFields(content);

    enriched = {
      ...enriched,
      title: enriched.title || generated.title,
      summary: enriched.summary || generated.summary,
      slug: enriched.slug || generated.slug,
      tags:
        Array.isArray(enriched.tags) && enriched.tags.length > 0
          ? enriched.tags
          : generated.tags,
    };
  }

  enriched.date = enriched.date || getTodayDate();

  const ordered = formatFrontmatter(enriched);
  const updatedFile = matter.stringify(content, ordered);
  await fs.writeFile(filePath, updatedFile);
  console.log(`✨ Enriched frontmatter saved: ${path.basename(filePath)}`);
}

// 🔁 Enrich all MDX posts in content/posts
async function run() {
  const files = await fs.readdir(POSTS_DIR);
  for (const file of files) {
    if (file.endsWith(".mdx")) {
      const fullPath = path.join(POSTS_DIR, file);
      await enrichPost(fullPath);
    }
  }
}

run().catch(console.error);
