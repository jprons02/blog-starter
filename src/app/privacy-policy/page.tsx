import { siteTitle, siteUrl } from "@/lib/utils/constants";
import { ModalTrigger } from "@/app/components/modals/ModalTrigger";

export const metadata = {
  title: "Privacy Policy",
  robots: "noindex, nofollow",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 privacy-policy-page">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Privacy Policy
      </h1>

      <p className="text-sm text-muted mb-8">Last updated: June 24, 2025</p>

      <section className="space-y-6 text-base leading-relaxed text-[var(--color-muted-text)]">
        <p>
          {siteTitle} operates this blog to share helpful content. This page
          outlines how we handle data and what your rights are.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information only when you voluntarily provide
            it, such as by submitting a contact form or completing our benefit
            eligibility checklist. This may include your name, email address,
            phone number, and general eligibility details (like household size
            or income range).
          </p>
          <p>
            We do <strong>not</strong> collect sensitive documents or government
            ID numbers.
          </p>
          <p>We may also use third-party services such as:</p>
          <ul className="list-disc pl-5 sm:pl-10 mt-2">
            <li>
              Plausible or Vercel Analytics (privacy-focused traffic insights)
            </li>
            <li>Pexels (image source, no tracking)</li>
            <li>OpenAI&apos;s ChatGPT (to assist in content generation)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
          <p>
            Any information you submit is used to help match you with public
            assistance programs and to follow up if requested. We may use your
            email or phone to send helpful reminders, results, or updates if you
            opt-in.
          </p>
          <p>
            Leads may be stored securely through a third-party CRM or email
            marketing platform (e.g., Mailchimp or Airtable). We do{" "}
            <strong>not</strong> sell or rent your personal information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Third-Party Services
          </h2>
          <p>
            We may link to or use tools from third-party providers to improve
            functionality and track performance. These include:
          </p>
          <ul className="list-disc pl-5 sm:pl-10 mt-2">
            <li>
              <a
                href="https://marketingplatform.google.com/about/analytics/terms/us/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics – used to track traffic and usage patterns
              </a>
            </li>
            <li>
              <a
                href="https://www.pexels.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pexels – image provider, no personal data collected
              </a>
            </li>
            <li>
              <a
                href="https://openai.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI – assists with content generation
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
          <p>
            We do not set cookies directly. However, services like Google
            Analytics may use cookies to collect anonymized traffic data. This
            helps us understand how visitors use the site and improve the
            experience.
          </p>
          <p>
            You can disable cookies in your browser settings or use browser
            add-ons to opt out of tracking by Google Analytics.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <p>
            You may request to access, correct, or delete any data you&apos;ve
            submitted by contacting us directly.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Changes</h2>
          <p>
            We may update this policy. Please check this page periodically for
            changes.
          </p>
        </div>

        <p className="pt-6">
          Questions?{" "}
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
