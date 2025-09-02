// /lib/utils/mdxCrosslinks.tsx
"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { useLocation } from "@/app/locations/_locationsCtx";

type CrossLinkProps = { href: string; className?: string; prefetch?: boolean };

function normalizeToPostPath(href: string) {
  return href.startsWith("./") ? `/posts/${href.slice(2)}` : href;
}

export default function CrossLink({
  href,
  children,
  ...rest
}: PropsWithChildren<CrossLinkProps>) {
  const loc = useLocation();
  let target = normalizeToPostPath(href);

  const isExternal = /^https?:\/\//i.test(target);
  const isAlreadyLocalized = /^\/locations\//.test(target);

  if (loc && !isExternal && !isAlreadyLocalized) {
    const state = encodeURIComponent(loc.stateSlug);
    const city = encodeURIComponent(loc.citySlug);
    if (target.startsWith("/posts/") || target.startsWith("/tags/")) {
      target = `/locations/${state}/${city}${target}`;
    }
  }

  return (
    <div className="mt-12">
      <blockquote
        className="border-l-4 pl-4 italic text-[var(--color-muted-text)] text-base"
        style={{ borderColor: "var(--color-primary) !important" }}
      >
        <Link href={target} {...rest}>
          {children}
        </Link>
      </blockquote>
    </div>
  );
}
