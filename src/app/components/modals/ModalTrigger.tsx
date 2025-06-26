"use client";

import { useModal } from "@/app/hooks/useModal";

// Match your defined modal types exactly
type ModalId = "contact" | "benefit";

type ModalTriggerProps = {
  modalId: ModalId;
  children: React.ReactNode;
  className?: string;
};

export function ModalTrigger({
  modalId,
  children,
  className,
}: ModalTriggerProps) {
  const { openModal } = useModal();

  return (
    <span
      className={
        className || "cursor-pointer underline text-blue-600 dark:text-blue-400"
      }
      onClick={() => openModal(modalId)}
    >
      {children}
    </span>
  );
}
