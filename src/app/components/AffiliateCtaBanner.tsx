// components/AffiliateCtaBanner.tsx
"use client";
import { programClick, withUtm } from "@/lib/utils/gtag";

type AffiliateInfo = { url: string; copy: string; name: string };
const AFFILIATES: Record<string, AffiliateInfo> = {
  boom: {
    url: "https://www.boompay.app/boomreport?source=MYGOVBLOG",
    name: "Boompay",
    copy: "Build your credit just by paying rent. See if Boompay is right for you.",
  },
  safelink: {
    url: "https://freesmartphone.net/promo?code=free",
    name: "SafeLink",
    copy: "Get a free phone with free service with Safelink Wireless. Check if you qualify.",
  },
};

export default function AffiliateCtaBanner({
  affiliate,
}: {
  affiliate: keyof typeof AFFILIATES;
}) {
  const info = AFFILIATES[affiliate];
  if (!info) return null;
  const trackedUrl = withUtm(info.url, {
    utm_source: "mygovblog",
    utm_medium: "affiliate",
    utm_campaign: "affiliate_cta",
    utm_content: info.name,
  });

  return (
    <div className="mt-12">
      <blockquote
        className="border-l-4 pl-4 italic text-[var(--color-muted-text)] text-base"
        style={{ borderColor: "var(--color-primary) !important" }}
      >
        {info.copy}
        <br />
        <a
          href={trackedUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() =>
            programClick({
              program: "affiliate", // logical bucket
              affiliate: info.name, // <-- GA4 dimension
              link_url: trackedUrl,
              position: "banner",
              context: "affiliate_cta",
              is_outbound: true,
              is_affiliate: true,
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
