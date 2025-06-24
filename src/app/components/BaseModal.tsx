// BaseModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
}: BaseModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={backdropRef}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[var(--color-card-bg)] text-[var(--color-card-text)] rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 text-[var(--color-muted-text)] hover:text-[var(--color-foreground)] text-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
          {title && (
            <h2 className="text-xl font-bold mb-4 font-heading text-[var(--color-text)]">
              {title}
            </h2>
          )}
          <div>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
