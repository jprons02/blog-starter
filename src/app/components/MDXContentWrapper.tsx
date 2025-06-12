"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";

export default function MDXContentWrapper({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component />;
}
