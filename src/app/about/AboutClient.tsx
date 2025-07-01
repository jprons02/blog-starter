"use client";
import { siteTitle } from "@/lib/utils/constants";
import { useModal } from "@/app/hooks/useModal";

export default function AboutPage() {
  const { openModal } = useModal();
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 about-page">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        About Us
      </h1>
      <p className="text-sm text-[var(--color-muted-text)] mb-8">
        Last updated: June 2025
      </p>

      <section className="space-y-6 text-base leading-relaxed text-[var(--color-muted-text)]">
        <p>
          At <strong>{siteTitle}</strong>, we believe access to help
          shouldn&apos;t come with confusion, paperwork headaches, or dead ends.
        </p>

        <p>
          Navigating government support programs can feel overwhelming. Whether
          it&apos;s food stamps, housing assistance, low-cost internet, or help
          with medical expenses, the options are there — but the process
          isn&apos;t always clear.
        </p>

        <blockquote className="border-l-4 border-[var(--color-primary)] pl-4 italic text-[var(--color-muted-text)] bg-[var(--color-muted-bg)] rounded">
          “We’re here to make government help human again — plain, practical,
          and possible.”
        </blockquote>

        <p>
          That&apos;s where we come in. We created this site to make government
          assistance easier to understand and more approachable. Our goal is to
          guide individuals and families through <em>what programs exist</em>,{" "}
          <em>who qualifies</em>, and <em>how to apply</em> — without jargon or
          red tape.
        </p>

        <ul className="list-disc pl-5 sm:pl-10 text-[var(--color-muted-text)]">
          <li>Food & nutrition programs (SNAP, school lunches)</li>
          <li>Internet assistance (Affordable Connectivity Program)</li>
          <li>Utility relief & rent support</li>
          <li>Medical & child care help</li>
          <li>Phone programs like Lifeline</li>
          <li>Education and job training resources</li>
        </ul>

        <p>
          We&apos;re not a government agency — just a small team dedicated to
          helping people find the right programs with confidence and clarity.
        </p>

        <p>
          If you&apos;re struggling or just want to explore your options,
          we&apos;re here to help point you in the right direction.
        </p>

        <div className="mt-8 p-4 rounded-xl bg-[var(--color-muted-bg)] border border-[var(--color-border)] shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
            💬 Need Help?
          </h3>
          <p className="text-sm text-[var(--color-muted-text)]">
            If you have questions or suggestions,{" "}
            <span
              onClick={() => openModal("contact")}
              className="cursor-pointer underline"
              style={{ color: "var(--color-primary)" }}
            >
              reach out to us
            </span>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
