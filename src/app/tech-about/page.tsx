/* For Recruiter/Employer eyes. */

"use client";

import FadeIn from "@/app/components/FadeIn";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
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
          with modern technologies, focused on performance, SEO, and
          flexibility.
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
              components, and layout system.
            </li>
            <li>
              <strong>TypeScript:</strong> Static typing for developer safety
              and IntelliSense support.
            </li>
            <li>
              <strong>Tailwind CSS:</strong> Utility-first styling with a custom
              theme using CSS variables for dark/light mode.
            </li>
            <li>
              <strong>Framer Motion:</strong> Smooth animations for UI
              transitions.
            </li>
            <li>
              <strong>Lucide Icons:</strong> Clean and modern icon system.
            </li>
            <li>
              <strong>Dark Mode:</strong> Custom toggle using CSS variables and
              a <code>.light</code> class on the <code>&lt;html&gt;</code>{" "}
              element.
            </li>
            <li>
              <strong>Responsive Design:</strong> Mobile-first layouts by
              default.
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
            🧠 Content Management
          </h2>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            <li>
              <strong>Contentlayer v2:</strong> Type-safe MDX compiler with
              custom schema, hot reload, and live data generation.
            </li>
            <li>
              <strong>MDX v2:</strong> Markdown + JSX support with custom
              components.
            </li>
            <li>
              <strong>Prism Highlighting:</strong> For beautiful
              syntax-highlighted code blocks.
            </li>
            <li>
              <strong>Filesystem Source:</strong> Posts are stored in{" "}
              <code>content/posts/</code> and compiled automatically.
            </li>
            <li>
              <strong>Static Generation:</strong> All posts are pre-rendered at
              build time for maximum performance.
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
            🧰 Tools & Enhancements
          </h2>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            <li>
              <strong>Vitest + React Testing Library:</strong> For unit and
              component testing.
            </li>
            <li>
              <strong>SEO Meta:</strong> Open Graph + Twitter card metadata via
              <code>generateMetadata</code> functions.
            </li>
            <li>
              <strong>Vercel Deployment:</strong> Works out of the box with
              Vercel.
            </li>
            <li>
              <strong>AI Post Generator:</strong> CLI script uses OpenAI and
              Pexels API to generate complete MDX posts with metadata and cover
              images.
            </li>
          </ul>
        </section>
      </FadeIn>
    </main>
  );
}
