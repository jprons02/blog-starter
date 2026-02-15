import { siteTitle, siteUrl } from "@/lib/utils/constants";
import { ModalTrigger } from "@/app/components/modals/ModalTrigger";

export const metadata = {
  title: "Terms of Service",
  description: `Read ${siteTitle}'s Terms of Service to understand the rules and guidelines for using our website.`,
  alternates: {
    canonical: `${siteUrl}/terms-of-service`,
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 terms-of-service-page">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Terms of Service
      </h1>

      <p className="text-sm text-muted mb-8">Last updated: February 14, 2026</p>

      <section className="space-y-6 text-base leading-relaxed text-[var(--color-muted-text)]">
        <p>
          Welcome to <strong>{siteTitle}</strong>. By accessing or using our
          website at{" "}
          <a href={siteUrl} className="underline text-[var(--color-link)]">
            {siteUrl}
          </a>
          , you agree to be bound by these Terms of Service. If you do not agree
          with any part of these terms, please discontinue use of the website
          immediately.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            1. Purpose of This Website
          </h2>
          <p>
            {siteTitle} is an informational resource designed to help
            individuals and families navigate U.S. government assistance
            programs, including but not limited to SNAP, WIC, Medicaid, LIHEAP,
            Section 8, and other public benefit programs.
          </p>
          <p className="mt-2">
            We are <strong>not</strong> a government agency, law firm, or
            licensed benefits counselor. The content on this site is for
            educational and informational purposes only and should not be
            construed as legal, financial, or professional advice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Content Accuracy</h2>
          <p>
            We strive to keep all information up to date and accurate. However,
            government programs, eligibility rules, deadlines, and application
            procedures change frequently. We cannot guarantee that all
            information is current at the time you read it.
          </p>
          <p className="mt-2">
            Always verify program details directly with the relevant government
            agency or official program website before making decisions based on
            our content.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. User Conduct</h2>
          <p>When using this website, you agree to:</p>
          <ul className="list-disc pl-5 sm:pl-10 mt-2 space-y-1">
            <li>Use the site only for lawful purposes</li>
            <li>
              Not attempt to gain unauthorized access to any part of the
              website, its servers, or any connected systems
            </li>
            <li>
              Not reproduce, duplicate, copy, sell, or exploit any portion of
              the site without express written permission
            </li>
            <li>
              Not submit false or misleading information through any forms or
              tools on the site
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. Intellectual Property
          </h2>
          <p>
            All content on this website — including text, graphics, logos,
            images, and software — is the property of {siteTitle} or its content
            suppliers and is protected by U.S. and international copyright laws.
          </p>
          <p className="mt-2">
            You may share links to our articles and reference short excerpts
            with proper attribution. Reproducing full articles without
            permission is prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Third-Party Links & Affiliates
          </h2>
          <p>
            This website may contain links to third-party websites, tools, or
            services. Some of these links may be affiliate links, meaning we may
            earn a small commission if you take action through them — at no
            additional cost to you.
          </p>
          <p className="mt-2">
            We are not responsible for the content, accuracy, or practices of
            third-party websites. Visiting external links is at your own risk.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            6. Tools & Interactive Features
          </h2>
          <p>
            Our website may include interactive tools such as benefit
            eligibility checkers, search features, or contact forms. These tools
            are provided as a convenience and for informational purposes only.
          </p>
          <p className="mt-2">
            Results from any tool on this site do not constitute an official
            determination of benefits eligibility. Always confirm eligibility
            through official government channels.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Disclaimer of Warranties
          </h2>
          <p>
            This website is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. {siteTitle} makes no warranties, expressed or
            implied, regarding the operation of the website, the accuracy of
            information, or the results obtained from use of the site.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            8. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, {siteTitle} shall not be
            liable for any damages arising from the use of, or inability to use,
            this website or any content provided on it. This includes, but is
            not limited to, direct, indirect, incidental, punitive, and
            consequential damages.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            9. Changes to These Terms
          </h2>
          <p>
            We reserve the right to update or modify these Terms of Service at
            any time. Changes will be posted on this page with an updated
            revision date. Your continued use of the site after changes are
            posted constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws of the United States. Any disputes arising from these
            terms shall be resolved in accordance with applicable federal and
            state laws.
          </p>
        </div>

        <p className="pt-6">
          Questions about these terms?{" "}
          <ModalTrigger
            modalId="contact"
            className="cursor-pointer underline text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
          >
            Contact us.
          </ModalTrigger>
        </p>
      </section>
    </main>
  );
}
