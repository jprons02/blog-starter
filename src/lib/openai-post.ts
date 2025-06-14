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
