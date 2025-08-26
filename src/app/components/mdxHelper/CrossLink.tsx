// /lib/utils/mdxCrosslinks.tsx  (note: .tsx because it renders JSX)
"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";

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
  const target = normalizeToPostPath(href);

  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
