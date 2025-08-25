// /lib/utils/mdxCrosslinks.tsx  (note: .tsx because it renders JSX)
"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { useLocation } from "@/app/locations/_locationsCtx";

type CrossLinkProps = {
  href: string; // e.g. "./slug" or "/posts/slug" or "/tags/phones"
  className?: string;
  prefetch?: boolean;
};

function normalizeToPostPath(href: string) {
  if (href.startsWith("./")) return `/posts/${href.slice(2)}`;
  return href;
}

export default function CrossLink({
  href,
  children,
  ...rest
}: PropsWithChildren<CrossLinkProps>) {
  const loc = useLocation();
  let target = normalizeToPostPath(href);

  // If we have location context and the link is internal, rewrite to localized
  if (loc && !/^https?:\/\//i.test(target)) {
    if (target.startsWith("/posts/")) {
      target = `/locations/${loc.state.toLowerCase()}/${loc.city.toLowerCase()}${target}`;
    } else if (target.startsWith("/tags/")) {
      target = `/locations/${loc.state.toLowerCase()}/${loc.city.toLowerCase()}${target}`;
    }
    // else: leave other internal routes alone
  }

  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
