"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function StickyBackButton() {
  const router = useRouter();
  const handleClick = () => {
    if (
      document.referrer &&
      !document.referrer.includes(window.location.href)
    ) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        cursor-pointer
        fixed right-4 bottom-[14%] sm:right-6 z-50
        sm:bottom-[5%] sm:right-6 z-50
        px-4 py-2
        rounded-full
        flex items-center gap-2
        text-sm font-medium
        shadow-md hover:shadow-lg
        hover:bg-background/50
        transition
        backdrop-blur
        
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
