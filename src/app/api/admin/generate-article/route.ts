import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/admin/session";
import OpenAI from "openai";
import { promises as fs } from "fs";
import path from "path";

// Combined prompts for article generation
const FRONTMATTER_PROMPT = `You are an expert content writer. Generate MDX frontmatter ONLY (as a YAML block wrapped in --- at top and bottom). No prose, no code fences, no commentary.

Generate frontmatter for the given topic following these rules:
- title: Human-readable, engaging headline (35-80 chars) - MUST be wrapped in double quotes
- seoTitle: Search-optimized variant (50-60 chars) - MUST be wrapped in double quotes
- summary: Meta description style summary (150-160 chars) - MUST be wrapped in double quotes
- tags: Topic keywords, lowercase, hyphenate spaces (3-8 items) - MUST be an array with quotes like ["tag-one", "tag-two", "tag-three"]
- category: Choose 1-2 from: "Housing & Utilities", "Phones & Internet", "Health & Nutrition", "Money & Benefits" - MUST be an array like ["Category Name"]
- date: Today's date in ISO format (YYYY-MM-DD) - MUST be wrapped in double quotes

CRITICAL FORMATTING RULES:
- ALL string values MUST be wrapped in double quotes
- tags MUST be formatted as: ["tag-one", "tag-two", "tag-three"]
- category MUST be formatted as: ["Category Name"]
- date MUST be formatted as: "YYYY-MM-DD"

Example of correct format:
---
title: "Your Article Title Here"
seoTitle: "SEO Optimized Title"
summary: "This is a summary that describes the article content."
tags: ["first-tag", "second-tag", "third-tag"]
category: ["Money & Benefits"]
date: "2026-01-31"
---

Voice: helpful, informative, positive, motivating
Audience: ages 25-70, low-income, working-class

Return ONLY the YAML frontmatter block wrapped in --- on top and bottom.
Do NOT include backticks, JSON, or any explanation.`;

const ARTICLE_PROMPT = `You are an expert content writer creating helpful, accessible content about government assistance programs and benefits. Write like a human, not a robot. Do not fabricate sources or quotes.

Voice: helpful, informative, positive, motivating
Audience: ages 25-70, low-income, working-class
Language: English

STRUCTURE REQUIREMENTS:

1. INTRO (H2):
- Write a single-sentence hook heading (H2) that is NOT equal to or paraphrasing the title (max 110 chars)
- One to two sentences introducing the topic with a hook
- End with: <IfLocation>In <City/>, <State/>, [relevant local context]—watch for <State/>-specific callouts to follow the right steps.</IfLocation><IfNoLocation>Some details vary by state—watch for local notes as you go.</IfNoLocation>

2. CTA BANNER (after intro):
<BenefitsCtaBanner focus="[relevant-focus]" copy="[compelling CTA text]. " />

3. LOCATION CTA (after banner):
<IfLocation>
<div className="not-prose my-12 p-4 rounded-xl border-[3px] bg-muted">
  <p className="mb-2"><strong>Quick links for <City/>, <State/>:</strong></p>
  <ul className="list-disc ml-5 space-y-1">
    <li><ResourceLink name="[program]">Apply for [program name]</ResourceLink></li>
    <li><ResourceLink name="[program]" field="contact">[Program] office & contacts — <City/>, <State/></ResourceLink></li>
  </ul>
</div>
</IfLocation>

4. AD SLOT:
<AdSlot slot="9495189900" />

5. BODY SECTIONS (3-5 sections with H2):
- 1 Core Section (choose from: "Start here: what to do first", "Quick wins you can try today", "Common mistakes & how to avoid them", "Where people get stuck", "Tools & links worth saving", "Your next steps (one-page plan)")
- 2 Deep Dive Sections with specific, insight-driven H2s (32-90 chars) that name the angle plainly and hook curiosity
  Examples: "The Copay Cliff: How a $1 Raise Can Spike Your Child Care Bill", "Why Providers Opt Out—and How That Shrinks Your Options"
- Each deep dive must include: one specific non-obvious claim, a tiny scenario (1-2 sentences), 3-6 bullet points
- Use bullets where helpful, keep sections link-free

6. CROSSLINK (insert after first section):
<CrossLink href="./how-to-apply-for-snap-benefits-food-stamps-without-the-confusion">How to Apply for SNAP Benefits (Food Stamps) Without the Confusion</CrossLink>

7. CHECK BENEFITS CTA (after last section, before FAQ):
<IfLocation>
<div className="mt-3">👉 Want a quick read on eligibility? <a href="/tools/check-benefits" className="underline">Check benefits for <City/>, <State/></a>.</div>
</IfLocation>

8. FAQ SECTION:
---

<IfLocation>
  <h2>FAQs for <City/>, <State/></h2>
  <ResourceLink name="[program]" field="faqs" />
</IfLocation>

<IfNoLocation>
## FAQs

### [Question 1]?
[Answer 1]

### [Question 2]?
[Answer 2]

### [Question 3]?
[Answer 3]

### [Question 4]?
[Answer 4]
</IfNoLocation>

9. REFERENCES (at least 3-5, prefer .gov, .edu, .org):
---
###### References

<div className="references">
<a href="[url]" target="_blank" rel="noopener noreferrer">[Source Title]</a><br />
</div>

VALIDATION RULES:
- No links outside Personal story or References (except allowed MDX components)
- No placeholder strings (oaicite, contentReference, TBD, source?)
- All URLs must be HTTPS
- H2 intro header must be different from title
- Include exactly one CrossLink in body sections
- Horizontal rules only before FAQ and References

Return ONLY the article content (no frontmatter, that comes separately).
Do NOT wrap in code blocks.`;

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = getSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    // Generate frontmatter first
    const frontmatterResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: FRONTMATTER_PROMPT },
        {
          role: "user",
          content: `Generate frontmatter for an article about: "${topic}"

Today's date is: ${new Date().toISOString().split("T")[0]}`,
        },
      ],
      temperature: 0.7,
    });

    const frontmatter = frontmatterResponse.choices[0].message?.content?.trim();

    if (!frontmatter) {
      return NextResponse.json(
        { error: "Failed to generate frontmatter" },
        { status: 500 },
      );
    }

    // Generate article content
    const articleResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ARTICLE_PROMPT },
        {
          role: "user",
          content: `Write a complete MDX article about: "${topic}"

Use the following frontmatter as context for the title (do NOT include frontmatter in your response):
${frontmatter}

Remember:
- The H2 intro heading must be DIFFERENT from the title
- Include all required MDX components (IfLocation, IfNoLocation, BenefitsCtaBanner, CrossLink, etc.)
- Use real, verifiable sources for references
- Write for a low-income, working-class audience seeking help`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const articleContent = articleResponse.choices[0].message?.content?.trim();

    if (!articleContent) {
      return NextResponse.json(
        { error: "Failed to generate article" },
        { status: 500 },
      );
    }

    // Combine frontmatter and article
    const fullArticle = `${frontmatter}\n\n${articleContent}`;

    // Extract slug from frontmatter for filename
    const slugMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
    const title = slugMatch ? slugMatch[1] : topic;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if file already exists
    const postsDir = path.join(process.cwd(), "content", "posts");
    const filePath = path.join(postsDir, `${slug}.mdx`);

    let fileExists = false;
    try {
      await fs.access(filePath);
      fileExists = true;
    } catch {
      // File doesn't exist
    }

    // Return the generated content for preview (don't save yet)
    return NextResponse.json({
      success: true,
      message: `Article generated successfully`,
      slug,
      filePath: `content/posts/${slug}.mdx`,
      content: fullArticle,
      fileExists,
    });
  } catch (error) {
    console.error("Error generating article:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate article",
      },
      { status: 500 },
    );
  }
}
