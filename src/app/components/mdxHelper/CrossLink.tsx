// /lib/utils/mdxCrosslinks.ts
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

type CrossLinkProps = {
  href: string; // relative path like "./some-article" or "/posts/some-article"
  className?: string;
  prefetch?: boolean;
};

/**
 * CrossLink component
 * Renders an internal link that automatically appends ?city=&state=
 * if the current URL already has those params.
 *
 * Example usage in MDX:
 *
 * <CrossLink href="./single-parent-these-government-programs-can-help-with-food-rent-and-more">
 *   Help for Single Parents
 * </CrossLink>
 */
export default function CrossLink({
  href,
  children,
  ...rest
}: PropsWithChildren<CrossLinkProps>) {
  const params = useSearchParams();
  const city = params.get("city");
  const state = params.get("state");

  let target = href;
  if (city && state) {
    const sep = href.includes("?") ? "&" : "?";
    target = `${href}${sep}city=${encodeURIComponent(
      city
    )}&state=${encodeURIComponent(state)}`;
  }

  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
