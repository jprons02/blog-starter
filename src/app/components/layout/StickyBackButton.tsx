// /app/components/ui/StickyBackButton.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  /** Optional explicit fallback (e.g., a city hub or /tags) */
  backHref?: string;
};

export default function StickyBackButton({ backHref }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      // Try browser back; if it fails, go home.
      if (window.history.length > 1) router.back();
      else router.push("/");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer fixed right-4 bottom-[14%] sm:right-6 sm:bottom-[5%] z-50 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg hover:bg-background/50 transition backdrop-blur"
      style={{
        backgroundColor: "var(--color-muted-bg)",
        color: "var(--color-foreground)",
        border: "1px solid var(--color-border)",
      }}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}
