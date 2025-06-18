export default function PrivacyPolicyPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "YourSiteName";
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 privacy-policy">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Privacy Policy
      </h1>

      <p className="text-sm text-muted mb-8">Last updated: June 17, 2025</p>

      <section className="space-y-6 text-base leading-relaxed text-[var(--color-muted-text)]">
        <p>
          {siteName} operates this blog to share helpful content. This page
          outlines how we handle data and what your rights are.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We do <strong>not</strong> collect personal information unless
            explicitly provided by you (e.g., via forms or email).
          </p>
          <p>We may use third-party services such as:</p>
          <ul className="list-disc list-inside mt-2">
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
            We use any information to improve the website experience and respond
            to user submissions. No personal data is sold or shared.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Third-Party Services
          </h2>
          <p>
            We may link to or use tools from third-party providers. See their
            privacy policies for more info:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>
              <a
                href="https://www.pexels.com/about/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--color-primary-dark)]"
              >
                Pexels Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://openai.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--color-primary-dark)]"
              >
                OpenAI Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
          <p>
            We do not set cookies directly. However, analytics providers may use
            anonymous cookies to understand usage patterns.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <p>
            You may contact us to request deletion of any submitted data or for
            privacy-related questions.
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
          Questions? Email us at{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            {contactEmail}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
