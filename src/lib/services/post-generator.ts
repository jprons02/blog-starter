/**
 * ✅ formatPostToMDX()
 *
 * Generates a complete MDX string for a blog post, including:
 * - YAML frontmatter (title, summary, tags, date, image)
 * - A heading based on the title
 * - The main post content
 *
 * This is used to save blog posts in Contentlayer-compatible `.mdx` format.
 */

export function formatPostToMDX(meta: {
  title: string;
  summary: string;
  tags: string[];
  date: string;
  image?: string;
  imageCreditName?: string;
  imageCreditUrl?: string;
  content: string;
}) {
  const {
    title,
    summary,
    tags,
    date,
    image,
    imageCreditName,
    imageCreditUrl,
    content,
  } = meta;

  const frontmatterLines = [
    `title: ${JSON.stringify(title)}`,
    `summary: ${JSON.stringify(summary)}`,
    `tags: ${JSON.stringify(tags)}`,
    `date: ${JSON.stringify(date)}`,
    ...(image ? [`image: ${JSON.stringify(image)}`] : []),
    ...(imageCreditName
      ? [`imageCreditName: ${JSON.stringify(imageCreditName)}`]
      : []),
    ...(imageCreditUrl
      ? [`imageCreditUrl: ${JSON.stringify(imageCreditUrl)}`]
      : []),
  ];

  const mdx = `---\n${frontmatterLines.join(
    "\n"
  )}\n---\n\n# ${title}\n\n${content.trim()}\n`;

  return mdx;
}
