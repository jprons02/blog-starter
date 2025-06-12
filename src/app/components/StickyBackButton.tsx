"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function StickyBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        cursor-pointer
        fixed bottom-4 right-4 z-50
        px-4 py-2
        rounded-full
        flex items-center gap-2
        text-sm font-medium
        shadow-md hover:shadow-lg
        hover:bg-background/50
        transition
        backdrop-blur
        sm:bottom-6 sm:right-6
      "
      style={{
        backgroundColor: "var(--color-muted-bg)",
        color: "var(--color-foreground)",
        border: "1px solid var(--color-border)",
      }}
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}
