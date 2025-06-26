import { siteUrl } from "@/lib/utils/constants";
import {
  PhoneCall,
  Hospital,
  FileText,
  AppWindow,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Resources",
  robots: "noindex, nofollow",
  alternates: {
    canonical: `${siteUrl}/resources`,
  },
};

export default function ResourcesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 resources-page">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Resources
      </h1>
      <p className="text-sm text-[var(--color-muted-text)] mb-8">
        Last updated: June 2025
      </p>

      <section className="space-y-6 text-base leading-relaxed text-[var(--color-muted-text)]">
        <p>
          These tools and programs help people access government assistance
          faster and with less confusion. Some links below are affiliate
          partners—meaning we may earn a small commission if you apply through
          them, at no extra cost to you.
        </p>

        {/* Free Phones & Internet */}
        <h2 className="flex items-center gap-2 text-xl font-semibold mt-10 text-[var(--color-text)]">
          <PhoneCall className="w-5 h-5 text-[var(--color-foreground)]" />
          Free Phones & Internet
        </h2>
        <ul className="list-disc pl-5 sm:pl-10 space-y-2">
          <li>
            <a
              href="https://your-affiliate-link.com/easywireless"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Easy Wireless
            </a>{" "}
            – Free phone, tablet, and unlimited data through ACP and Lifeline.
          </li>
          <li>
            <a
              href="https://your-affiliate-link.com/qlink"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Q Link Wireless
            </a>{" "}
            – Apply in minutes for free talk, text, and data with no monthly
            bills.
          </li>
        </ul>

        {/* Health & Insurance */}
        <h2 className="flex items-center gap-2 text-xl font-semibold mt-10 text-[var(--color-text)]">
          <Hospital className="w-5 h-5 text-[var(--color-foreground)]" />
          Health & Insurance Help
        </h2>
        <ul className="list-disc pl-5 sm:pl-10 space-y-2">
          <li>
            <a
              href="https://partners.healthsherpa.com/signup?agent_id=your-id"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              HealthSherpa
            </a>{" "}
            – Enroll in low-cost ACA health plans, including $0 options.
          </li>
          <li>
            <a
              href="https://your-affiliate-link.com/assurance"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Assurance
            </a>{" "}
            – See if you qualify for Medicare, Medicaid Advantage, or subsidies.
          </li>
        </ul>

        {/* Taxes */}
        <h2 className="flex items-center gap-2 text-xl font-semibold mt-10 text-[var(--color-text)]">
          <FileText className="w-5 h-5 text-[var(--color-foreground)]" />
          Tax Filing & Refund Help
        </h2>
        <ul className="list-disc pl-5 sm:pl-10 space-y-2">
          <li>
            <a
              href="https://your-affiliate-link.com/freetaxusa"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              FreeTaxUSA
            </a>{" "}
            – File federal taxes for free and get your Earned Income Tax Credit.
          </li>
        </ul>

        {/* App Tools */}
        <h2 className="flex items-center gap-2 text-xl font-semibold mt-10 text-[var(--color-text)]">
          <AppWindow className="w-5 h-5 text-[var(--color-foreground)]" />
          App Tools to Manage Benefits
        </h2>
        <ul className="list-disc pl-5 sm:pl-10 space-y-2">
          <li>
            <a
              href="https://www.joinproviders.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Providers App (Fresh EBT)
            </a>{" "}
            – Check SNAP balance, track deposits, and explore local savings.
          </li>
        </ul>

        {/* Disclaimer */}
        <div className="mt-12 p-4 border border-[var(--color-border)] bg-[var(--color-muted-bg)] rounded text-sm flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 mt-1 text-[var(--color-warning)] flex-shrink-0" />
          <p>
            <strong>Note:</strong> This site is independent and not affiliated
            with any U.S. government agency. We only promote services we’ve
            reviewed and that help people find or apply for real benefits.
          </p>
        </div>
      </section>
    </main>
  );
}
