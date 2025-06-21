"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    window.gtag?.("config", process.env.NEXT_PUBLIC_GA_ID as string, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
