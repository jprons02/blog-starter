// src/lib/utils/extractFaqs.ts
// Utilities for extracting FAQ Q&A pairs from MDX content and localResources
// for use in FAQPage JSON-LD structured data.

export type FaqPair = { question: string; answer: string };

/* ------------------------------------------------------------------ */
/* 1. Extract FAQs from raw MDX (for non-localized /posts/[slug])     */
/* ------------------------------------------------------------------ */

/**
 * Parses the raw MDX body to pull Q&A pairs from the `<IfNoLocation>` FAQ
 * block (or a bare `## FAQs` section when there's no IfNoLocation wrapper).
 *
 * Pattern it expects:
 *   ### Question text here
 *   Answer text (one or more lines until the next ### or section boundary)
 */
export function extractFaqsFromMdx(raw: string): FaqPair[] {
  // 1. Try to isolate the <IfNoLocation> FAQ block first
  const noLocMatch = raw.match(
    /<IfNoLocation>[\s\S]*?## FAQs?\s*\n([\s\S]*?)<\/IfNoLocation>/i,
  );

  // 2. Otherwise fall back to a bare ## FAQs section (non-localized posts)
  const bareFaqMatch = raw.match(
    /## FAQs?\s*\n([\s\S]*?)(?=\n---|\n## |\n<|$)/i,
  );

  const faqBlock = noLocMatch?.[1] ?? bareFaqMatch?.[1];
  if (!faqBlock) return [];

  // 3. Split on ### headings to get Q&A pairs
  const parts = faqBlock.split(/^###\s+/m).filter(Boolean);
  const pairs: FaqPair[] = [];

  for (const part of parts) {
    const lines = part.trim().split("\n");
    const question = lines[0]?.trim();
    const answer = lines
      .slice(1)
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ")
      .trim();
    if (question && answer) {
      pairs.push({ question: stripMdx(question), answer: stripMdx(answer) });
    }
  }

  return pairs;
}

/** Remove markdown/MDX artifacts from text (links, bold, etc.) */
function stripMdx(s: string): string {
  return (
    s
      // [text](url) → text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // **text** or __text__
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      // *text* or _text_
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // ` backticks `
      .replace(/`([^`]+)`/g, "$1")
      .trim()
  );
}

/* ------------------------------------------------------------------ */
/* 2. Extract FAQs from localResources (for localized posts)          */
/* ------------------------------------------------------------------ */

/**
 * Given the loaded localResources bag and a topic name (e.g. "wic"),
 * returns plain-text Q&A pairs suitable for FAQPage JSON-LD.
 *
 * Handles both formats found in the city data files:
 *   - { html: "<p><strong>Q</strong><br/>A</p>" }
 *   - { qHtml: "...", aHtml: "..." }
 *   - [question, answer] tuples
 */
export function extractFaqsFromResources(
  localResources: Record<string, { faqs?: readonly unknown[] }>,
  topicName: string,
  cityName: string,
  stateName: string,
): FaqPair[] {
  // case-insensitive lookup
  const lc = topicName.toLowerCase();
  const entry = Object.entries(localResources).find(
    ([k]) => k.toLowerCase() === lc,
  );
  const faqs = entry?.[1]?.faqs;
  if (!Array.isArray(faqs) || faqs.length === 0) return [];

  const tokenize = (s: string) =>
    s.replaceAll("<City/>", cityName).replaceAll("<State/>", stateName);

  const pairs: FaqPair[] = [];
  for (const item of faqs) {
    if (isTuple(item)) {
      const [q, a] = item;
      pairs.push({
        question: tokenize(q),
        answer: tokenize(a),
      });
    } else if (isHtmlPair(item)) {
      pairs.push({
        question: tokenize(stripHtml(item.qHtml)),
        answer: tokenize(stripHtml(item.aHtml)),
      });
    } else if (isHtmlBlock(item)) {
      const parsed = parseHtmlBlock(tokenize(item.html));
      if (parsed) pairs.push(parsed);
    }
  }
  return pairs;
}

/**
 * Determines which resource topic a post uses for its FAQ section
 * by scanning the raw MDX for `<ResourceLink name="..." field="faqs" />`.
 */
export function detectFaqTopic(raw: string): string | null {
  const m = raw.match(
    /<ResourceLink\s+name=["']([^"']+)["']\s+field=["']faqs["']/i,
  );
  return m?.[1] ?? null;
}

/* ---------- internal helpers ---------- */

function isTuple(x: unknown): x is readonly [string, string] {
  return (
    Array.isArray(x) &&
    x.length === 2 &&
    typeof x[0] === "string" &&
    typeof x[1] === "string"
  );
}

function isHtmlPair(x: unknown): x is { qHtml: string; aHtml: string } {
  return (
    !!x &&
    typeof x === "object" &&
    "qHtml" in x &&
    "aHtml" in x &&
    typeof (x as Record<string, unknown>).qHtml === "string" &&
    typeof (x as Record<string, unknown>).aHtml === "string"
  );
}

function isHtmlBlock(x: unknown): x is { html: string } {
  return (
    !!x &&
    typeof x === "object" &&
    "html" in x &&
    typeof (x as Record<string, unknown>).html === "string"
  );
}

/** Strip all HTML tags from a string */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse a single `{ html }` block into a Q&A pair.
 * Assumes: `<p><strong>Question</strong><br/>Answer text</p>`
 */
function parseHtmlBlock(html: string): FaqPair | null {
  // Try to split on <strong>question</strong> + rest-as-answer
  const qMatch = html.match(/<strong>([\s\S]*?)<\/strong>/i);
  if (!qMatch) return null;

  const question = stripHtml(qMatch[1]).trim();
  // Everything after the closing </strong> tag (and any <br/> separator) is the answer
  const afterStrong = html.slice(
    html.indexOf("</strong>") + "</strong>".length,
  );
  const answer = stripHtml(afterStrong).trim();

  if (!question || !answer) return null;
  return { question, answer };
}

/* ------------------------------------------------------------------ */
/* 3. Build the FAQPage JSON-LD object                                */
/* ------------------------------------------------------------------ */

export function buildFaqJsonLd(faqs: FaqPair[], canonicalId: string) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org" as const,
    "@type": "FAQPage" as const,
    "@id": `${canonicalId}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: f.answer,
      },
    })),
  };
}
