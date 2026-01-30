// src/app/tools/check-benefits/page.tsx
import type { Metadata } from "next";
// NOTE: adjust this import if your file lives elsewhere:
import BenefitForm from "@/app/components/forms/BenefitForm";
import { siteTitle, siteUrl, siteImage } from "@/lib/utils/constants";

const ogImage = `${siteUrl}${siteImage}`;

export const metadata: Metadata = {
  title: "Benefits Eligibility Checker",
  description:
    "Use our free benefits eligibility checker to quickly see potential programs you may qualify for—like SNAP, WIC, LIHEAP, and Medicaid. Fast, private, and mobile‑friendly.",
  alternates: { canonical: `${siteUrl}/tools/check-benefits` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteUrl}/tools/check-benefits`,
    siteName: siteTitle,
    title: "Benefits Eligibility Checker",
    description:
      "Quickly check potential eligibility for SNAP, WIC, LIHEAP, Medicaid, and more.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Benefits Eligibility Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Benefits Eligibility Checker",
    description:
      "See potential eligibility for SNAP, WIC, LIHEAP, Medicaid, and more in minutes.",
    images: [ogImage],
  },
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function BenefitCheckerPage() {
  const pageUrl = `${siteUrl}/tools/check-benefits`;

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Benefits Eligibility Checker",
    url: pageUrl,
    applicationCategory: "PublicService",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: siteTitle,
      url: siteUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Benefits Checker",
        item: pageUrl,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this the official application?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This is a free screening tool to help you understand potential eligibility. We link to official state and federal resources for applications.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate are the results?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Results are estimates based on your answers and public guidelines. Final eligibility is determined by the administering agency. Our calculations are generally accurate because we use the official U.S. government API for poverty levels, ensuring income thresholds are based on the latest federal data.",
        },
      },
      {
        "@type": "Question",
        name: "What information do I need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Basic household size, ZIP code, monthly income range, and a few situational questions (e.g., children, disability, veteran status).",
        },
      },
      {
        "@type": "Question",
        name: "Is it free and private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The checker is free. If you opt in, we may email you resources to help with next steps.",
        },
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 check-benefits-page">
      {/* JSON-LD */}
      <JsonLd data={webAppJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <header className="mb-6">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--color-primary)" }}
        >
          Benefits Eligibility Checker
        </h1>
        <p className="text-[var(--color-muted-text)] mt-2">
          Find out which programs you might qualify for—like SNAP, WIC, LIHEAP,
          and Medicaid—in just a few minutes.
        </p>
        <p className="text-xs mt-2 text-[var(--color-muted-text)]">
          This is a free screening tool. Final eligibility is determined by your
          state or federal agency.
        </p>
      </header>

      {/* Inline form (same component your modal uses) */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 md:p-6 shadow-sm max-w-[500px]">
        <BenefitForm variant="page" />
      </section>

      {/* On-page FAQ so the FAQPage JSON-LD reflects visible content */}
      <section className="mt-16">
        <h2 className="text-xl text-[var(--color-muted-text)]">
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-4">
          <details className="group border border-[var(--color-border)] rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-[var(--color-muted-text)]">
              Is this the official application?
            </summary>
            <p className="mt-2 text-[var(--color-muted-text)]">
              No. This tool helps you understand potential eligibility and
              provides links to official application sites.
            </p>
          </details>

          <details className="group border border-[var(--color-border)] rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-[var(--color-muted-text)]">
              How accurate are the results?
            </summary>
            <p className="mt-2 text-[var(--color-muted-text)]">
              Results are estimates based on your answers and public guidelines.
              Final eligibility is determined by the administering agency. Our
              calculations are generally accurate because we use the official
              U.S. government API for poverty levels, ensuring income thresholds
              are based on the latest federal data.
            </p>
          </details>

          <details className="group border border-[var(--color-border)] rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-[var(--color-muted-text)]">
              What information do I need?
            </summary>
            <p className="mt-2 text-[var(--color-muted-text)]">
              Household size, ZIP code, a monthly income range, and a few
              situational questions (e.g., children, disability, veteran
              status).
            </p>
          </details>

          <details className="group border border-[var(--color-border)] rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-[var(--color-muted-text)]">
              Is it free and private?
            </summary>
            <p className="mt-2 text-[var(--color-muted-text)]">
              Yes. It’s free. We don’t sell your information. If you opt in, we
              may email resources to help with next steps.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
