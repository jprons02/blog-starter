import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypePrism from "rehype-prism-plus";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    date: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" } },
    image: { type: "string", required: false },
    author: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    imageCreditName: { type: "string", required: false },
    imageCreditUrl: { type: "string", required: false },
  },
  computedFields: {
    url: {
      type: "string",
      //resolve: (post) => post._raw.flattenedPath,
      resolve: (post) =>
        `/posts/${post._raw.flattenedPath.replace(/^posts\//, "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [rehypePrism],
  },
});
