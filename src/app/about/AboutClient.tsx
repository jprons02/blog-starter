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
        About {siteTitle}
      </h1>
      <p className="text-sm text-[var(--color-muted-text)] mb-8">
        Last updated: February 2026
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

        <div>
          <h2 className="text-xl font-semibold mb-3 text-[var(--color-foreground)]">
            What We Cover
          </h2>
          <ul className="list-disc pl-5 sm:pl-10 text-[var(--color-muted-text)]">
            <li>Food &amp; nutrition programs (SNAP, WIC, school lunches)</li>
            <li>Internet assistance (Affordable Connectivity Program)</li>
            <li>Utility relief &amp; rent support (LIHEAP, ERA)</li>
            <li>Medical &amp; child care help (Medicaid, CHIP)</li>
            <li>Phone programs like Lifeline</li>
            <li>Education and job training resources (WIOA, FAFSA)</li>
            <li>Housing assistance (Section 8, VA housing)</li>
            <li>Tax credits and financial aid (EITC, Child Tax Credit)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-[var(--color-foreground)]">
            Our Editorial Process
          </h2>
          <p>
            Every article on {siteTitle} is researched using official government
            sources including{" "}
            <a
              href="https://www.usa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--color-primary)" }}
            >
              USA.gov
            </a>
            ,{" "}
            <a
              href="https://www.benefits.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--color-primary)" }}
            >
              Benefits.gov
            </a>
            , the{" "}
            <a
              href="https://www.fns.usda.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--color-primary)" }}
            >
              USDA Food and Nutrition Service
            </a>
            , and program-specific agency websites. We cross-reference
            eligibility details, application procedures, and deadlines to ensure
            accuracy.
          </p>
          <p className="mt-2">
            We regularly review and update older articles when program rules
            change, funding cycles shift, or new information becomes available.
            Each article includes a publication date, and many include direct
            links to the official sources we referenced.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-[var(--color-foreground)]">
            Who We Are
          </h2>
          <p>
            We&apos;re not a government agency — just a small, independent team
            dedicated to helping people find the right programs with confidence
            and clarity. Our writers and researchers have experience navigating
            these systems and understand the real challenges people face when
            trying to access benefits.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-[var(--color-foreground)]">
            How We Sustain This Site
          </h2>
          <p>
            {siteTitle} is free to use. We may earn a small commission through
            affiliate links to trusted third-party services — at no additional
            cost to you. These partnerships help us keep the site running and
            the content free. We only recommend services that we believe are
            genuinely useful.
          </p>
        </div>

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
            </span>{" "}
            or visit our{" "}
            <a
              href="/contact"
              className="underline"
              style={{ color: "var(--color-primary)" }}
            >
              contact page
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
