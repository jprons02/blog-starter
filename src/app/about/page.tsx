"use client";

import FadeIn from "@/app/components/FadeIn";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <FadeIn>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          About This Blog Starter
        </h1>
        <p
          className="text-base mb-10 leading-relaxed"
          style={{ color: "var(--color-muted-text)" }}
        >
          This is a premium, production-ready headless blog starter kit built
          with modern technologies and designed for speed, SEO, and
          customization.
        </p>
      </FadeIn>

      <FadeIn>
        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            🖼️ Front-end
          </h2>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            <li>
              <strong>Next.js (App Router):</strong> File-based routing, server
              components, and layout management.
            </li>
            <li>
              <strong>TypeScript:</strong> Strong typing for maintainability and
              tooling support.
            </li>
            <li>
              <strong>Tailwind CSS:</strong> Utility-first styling for fast UI
              development, using a custom theme built with CSS variables for
              colors, spacing, and dark mode.
            </li>
            <li>
              <strong>Framer Motion:</strong> Smooth, declarative animations for
              menus, components, and transitions.
            </li>
            <li>
              <strong>Lucide React Icons:</strong> Clean, modern icon system.
            </li>
            <li>
              <strong>Dark Mode:</strong> Tailwind’s <code>dark:</code> class
              plus toggle component.
            </li>
            <li>
              <strong>Responsive Design:</strong> Mobile-first layouts using
              Tailwind utilities.
            </li>
          </ul>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mb-12">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            🧠 Back-end
          </h2>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            <li>
              <strong>MDX v2:</strong> Blog content written in Markdown + JSX
              for rich formatting and custom components.
            </li>
            <li>
              <strong>gray-matter:</strong> Parses frontmatter metadata from MDX
              files.
            </li>
            <li>
              <strong>File System Routing:</strong> Posts are stored as{" "}
              <code>.mdx</code> files in <code>content/posts/</code>.
            </li>
            <li>
              <strong>Dynamic Routing:</strong> Slug-based routes dynamically
              render each post.
            </li>
            <li>
              <strong>Static Generation:</strong> Prebuilt at compile time via
              `force-static`.
            </li>
          </ul>
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            🧰 Tools & Plugins
          </h2>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            <li>
              <strong>Jest + React Testing Library:</strong> For unit and
              component testing.
            </li>
            <li>
              <strong>Lucide Icons:</strong> Simple, modern icon set.
            </li>
            <li>
              <strong>ContentLayer or gray-matter:</strong> Optional content
              schema tools.
            </li>
            <li>
              <strong>SEO Setup:</strong> Custom Head tags or via{" "}
              <code>next-seo</code>.
            </li>
            <li>
              <strong>Deployment:</strong> Vercel-compatible out of the box.
            </li>
            <li>
              <strong>AI SEO Automation:</strong> Includes a custom script using
              the OpenAI API to auto-generate and enrich frontmatter (title,
              slug, summary, tags) for MDX posts based on content.
            </li>
          </ul>
        </section>
      </FadeIn>
    </main>
  );
}
