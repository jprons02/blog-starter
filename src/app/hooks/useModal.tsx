'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type ModalType = 'contact' | 'benefit' | null;

// If you want to be more specific, you can define a union type here for known props.
type ModalProps = Record<string, unknown>;

type ModalContextValue = {
  modalType: ModalType;
  modalProps?: ModalProps;
  openModal: (type: Exclude<ModalType, null>, props?: ModalProps) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps | undefined>();

  const openModal = (type: Exclude<ModalType, null>, props?: ModalProps) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps(undefined);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
