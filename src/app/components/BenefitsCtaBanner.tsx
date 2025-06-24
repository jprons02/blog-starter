"use client";

import { useModal } from "@/app/hooks/useModal";

export default function BenefitsCtaBanner() {
  const { openModal } = useModal();

  return (
    <div className="mt-12">
      <blockquote
        className="border-l-4 pl-4 italic text-[var(--color-muted-text)] text-base"
        style={{ borderColor: "var(--color-primary) !important" }}
      >
        Need help applying? Use our{" "}
        <span
          className="cursor-pointer text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
          onClick={() => openModal("benefit")}
        >
          free checklist
        </span>{" "}
        to find out what you qualify for.
      </blockquote>
    </div>
  );
}
