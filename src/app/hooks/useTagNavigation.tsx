"use client";

import { useRouter } from "next/navigation";

export function useTagNavigation() {
  const router = useRouter();

  const goToTagPage = (tag: string) => {
    const slug = tag.toLowerCase().replace(/\s+/g, "-");
    router.push(`/tags/${slug}`);
  };

  return goToTagPage;
}
