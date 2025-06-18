import { siteTitle } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] py-6 text-center text-[var(--color-muted-text)]">
      <p className="mb-2">
        © {new Date().getFullYear()} {siteTitle} All rights reserved.
      </p>
      <p>
        Photos via{" "}
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Pexels
        </a>
        . Content assisted by{" "}
        <a
          href="https://openai.com/chatgpt"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          ChatGPT
        </a>
        .
      </p>
      <p className="mt-2">
        <a href="/privacy-policy" className="underline">
          Privacy Policy
        </a>
      </p>
    </footer>
  );
}
