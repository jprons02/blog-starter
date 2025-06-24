"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ModalType = "contact" | "benefit" | null;

type ModalContextValue = {
  modalType: ModalType;
  openModal: (type: Exclude<ModalType, null>) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: Exclude<ModalType, null>) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
