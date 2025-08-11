"use client";

import { event as gaEvent } from "@/lib/utils/gtag";

type AffiliateInfo = {
  url: string;
  copy: string;
};

const AFFILIATES: Record<string, AffiliateInfo> = {
  boom: {
    url: "https://www.boompay.app/boomreport?source=MYGOVBLOG",
    copy: "Build your credit just by paying rent. See if Boompay is right for you.",
  },
  safelink: {
    url: "https://freesmartphone.net/promo?code=free",
    copy: "Get free cell phone service with Safelink Wireless. Check if you qualify.",
  },
};

type Props = {
  affiliate: keyof typeof AFFILIATES;
};

export default function AffiliateCtaBanner({ affiliate }: Props) {
  const info = AFFILIATES[affiliate];

  if (!info) return null;

  const { url, copy } = info;

  return (
    <div className="mt-12">
      <blockquote
        className="border-l-4 pl-4 italic text-[var(--color-muted-text)] text-base"
        style={{ borderColor: "var(--color-primary) !important" }}
      >
        {copy}
        <br />
        <a
          href={url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() =>
            gaEvent({
              action: "affiliate_click",
              category: "engagement",
              label: `Affiliate CTA - ${affiliate}`,
            })
          }
          className="underline cursor-pointer text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
        >
          Learn more.
        </a>
      </blockquote>
    </div>
  );
}
