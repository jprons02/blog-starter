// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypePrism from "rehype-prism-plus";
import rehypeExternalLinks from "rehype-external-links";
var Post = defineDocumentType(() => ({
  name: "Post",
  // ✅ Only index real posts, not the location template
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    seoTitle: { type: "string", required: false },
    summary: { type: "string", required: true },
    date: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" } },
    category: { type: "list", of: { type: "string" } },
    image: { type: "string", required: false },
    author: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    imageCreditName: { type: "string", required: false },
    imageCreditUrl: { type: "string", required: false }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => {
        const path = post._raw.flattenedPath.replace(/^posts\//, "");
        const slug = path.replace(/^\d{2}-\d{4}\//, "");
        return `/posts/${slug}`;
      }
    }
  }
}));
var LocationDoc = defineDocumentType(() => ({
  name: "LocationDoc",
  // ✅ Exactly the one MDX template we render for every city
  filePathPattern: "locations/template.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: false }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post, LocationDoc],
  mdx: {
    rehypePlugins: [
      rehypePrism,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] }
      ]
    ]
  }
});
export {
  LocationDoc,
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-GCQGHD2J.mjs.map
