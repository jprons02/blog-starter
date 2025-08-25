// app/components/GoogleAnalytics.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GA_TRACKING_ID } from "@/lib/utils/gtag";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID || typeof window === "undefined") return;
    const q = searchParams.toString();
    const page_path = q ? `${pathname}?${q}` : pathname;
    window.gtag?.("config", GA_TRACKING_ID, {
      page_path,
      anonymize_ip: true,
    });
  }, [pathname, searchParams]);

  return null;
}
