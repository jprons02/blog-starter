import { siteTitle, siteUrl } from "@/lib/utils/constants";
import { ModalTrigger } from "@/app/components/modals/ModalTrigger";
import { Mail, MessageSquare, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteTitle}. We'd love to hear from you — whether you have a question, suggestion, or need help finding a benefit program.`,
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 contact-page">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Contact Us
      </h1>

      <section className="space-y-6 text-base leading-relaxed text-[var(--color-muted-text)]">
        <p>
          Have a question about a government program? Need help understanding
          eligibility? Want to suggest a topic or report an error? We&apos;d
          love to hear from you.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 mt-8">
          <div className="p-5 rounded-xl bg-[var(--color-muted-bg)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-[var(--color-foreground)]" />
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                Send a Message
              </h2>
            </div>
            <p className="text-sm mb-4">
              Use our contact form to reach us directly. We read every message.
            </p>
            <ModalTrigger
              modalId="contact"
              className="inline-block cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] transition"
            >
              Open Contact Form
            </ModalTrigger>
          </div>

          <div className="p-5 rounded-xl bg-[var(--color-muted-bg)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-[var(--color-foreground)]" />
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                Response Time
              </h2>
            </div>
            <p className="text-sm">
              We typically respond within 1–2 business days. For urgent benefit
              questions, check our{" "}
              <a
                href="/resources"
                className="underline text-[var(--color-link)]"
              >
                resources page
              </a>{" "}
              or call the relevant program hotline directly.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-foreground)]">
            <MessageSquare className="w-5 h-5 inline-block mr-2" />
            What We Can Help With
          </h2>
          <ul className="list-disc pl-5 sm:pl-10 space-y-2">
            <li>
              <strong>Program questions:</strong> SNAP, WIC, LIHEAP, Medicaid,
              Section 8, and other government assistance programs
            </li>
            <li>
              <strong>Content suggestions:</strong> Topics you&apos;d like us to
              cover or programs we haven&apos;t written about yet
            </li>
            <li>
              <strong>Error reports:</strong> Found incorrect information or a
              broken link? Let us know so we can fix it
            </li>
            <li>
              <strong>Partnership inquiries:</strong> Media, nonprofit
              organizations, or community partners interested in collaboration
            </li>
          </ul>
        </div>

        <div className="mt-10 p-5 rounded-xl bg-[var(--color-muted-bg)] border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold mb-3 text-[var(--color-foreground)]">
            Important Note
          </h2>
          <p className="text-sm">
            {siteTitle} is <strong>not</strong> a government agency. We cannot
            process applications, approve benefits, or access your case files.
            If you need immediate assistance, please contact your{" "}
            <a
              href="https://www.usa.gov/state-social-services"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[var(--color-link)]"
            >
              state&apos;s social services office
            </a>{" "}
            directly.
          </p>
        </div>
      </section>
    </main>
  );
}
