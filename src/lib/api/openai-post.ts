import OpenAI from "openai";

export async function generatePost(topic: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
- Short intro, at least 4 structured sections with H2s
- One bullet list and one numbered list
- A practical tip in a blockquote
- Mention 2-3 external sources or organizations with a URL that support your claims (e.g., .gov, .org, .edu, or high-authority .com sites)

**At the end, you MUST include the following exactly as shown (formatting is required):**

***

###### References
[Source Name - Title](https://example.com)\
[Another Source - Title](https://example.org)\

**Do NOT skip the horizontal rule ("***"), the H6 heading ("###### References"), or the single backslash at the end of each link to create a line break. These are required.**

- Use valid MDX Markdown formatting
- Do NOT include an H1 heading.`,
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
