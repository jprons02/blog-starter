"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// 👇 Give the type a unique name
type ContactModalContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

// 👇 Create the context using the correct TYPE
const ContactModalContext = createContext<ContactModalContextValue | null>(
  null
);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error(
      "useContactModal must be used within a ContactModalProvider"
    );
  }
  return context;
}
