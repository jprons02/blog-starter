// components/ads/AdSlot.tsx
// Disabled until AdSense is approved — returns nothing so no empty space is rendered.
// Uncomment the full implementation below once ads are live.

export default function AdSlot({ slot: _slot }: { slot: string }) {
  return null;
}

/*
"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ slot }: { slot: string }) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isInitialized.current) return;

    try {
      if (typeof window !== "undefined" && adRef.current) {
        if (adRef.current.innerHTML.trim() !== "") {
          return;
        }

        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isInitialized.current = true;
      }
    } catch (e) {
      if (
        e instanceof Error &&
        !e.message.includes("already have ads in them")
      ) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  useEffect(() => {
    const el = adRef.current;
    if (!el) return;

    const check = () => {
      const status = el.getAttribute("data-ad-status");
      if (status === "unfilled") setHidden(true);
    };

    check();

    const observer = new MutationObserver(check);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    return () => observer.disconnect();
  }, []);

  if (hidden) return null;

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
*/
