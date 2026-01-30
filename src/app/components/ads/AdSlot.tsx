// components/ads/AdSlot.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ slot }: { slot: string }) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development (React StrictMode)
    if (isInitialized.current) return;

    try {
      if (typeof window !== "undefined" && adRef.current) {
        // Check if this specific ad slot already has content
        if (adRef.current.innerHTML.trim() !== "") {
          return;
        }

        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isInitialized.current = true;
      }
    } catch (e) {
      // Suppress duplicate ad errors in development
      if (
        e instanceof Error &&
        !e.message.includes("already have ads in them")
      ) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle block my-8"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6322184553331913"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
