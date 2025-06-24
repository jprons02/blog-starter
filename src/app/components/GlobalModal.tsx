"use client";

import BaseModal from "@/app/components/BaseModal";
import ContactForm from "@/app/components/ContactForm";
import BenefitForm from "@/app/components/BenefitForm";
import { useModal } from "@/app/hooks/useModal";

export default function GlobalModal() {
  const { modalType, closeModal } = useModal();

  return (
    <BaseModal
      isOpen={modalType !== null}
      onClose={closeModal}
      title={
        modalType === "contact"
          ? "Contact Us"
          : modalType === "benefit"
          ? "Free Benefits Checklist"
          : ""
      }
    >
      {modalType === "contact" && <ContactForm />}
      {modalType === "benefit" && <BenefitForm />}
    </BaseModal>
  );
}
