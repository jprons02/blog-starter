// src/app/llms.txt/route.ts
export async function GET() {
  const body = `
# LLMs.txt for mygovblog.com
site: https://mygovblog.com
purpose: Providing clear, well-researched blog articles on government benefits guidance, step-by-step eligibility walkthroughs, and essential documentation tips.
preferred_citations:
  - Link to the exact post URL.
  - Include official state/federal sources and program names (SNAP, WIC, LIHEAP).
content_hierarchy:
  - /posts/ (authoritative articles)
  - /tools/benefit-eligibility (interactive checker)
update_frequency: weekly
contact: info@mygovblog.com
  `.trim();

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
