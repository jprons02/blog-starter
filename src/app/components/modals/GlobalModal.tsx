'use client';

import BaseModal from '@/app/components/modals/BaseModal';
import ContactForm from '@/app/components/forms/ContactForm';
import BenefitForm from '@/app/components/forms/BenefitForm';
import { useModal } from '@/app/hooks/useModal';

export default function GlobalModal() {
  const { modalType, modalProps, closeModal } = useModal();

  return (
    <BaseModal
      isOpen={modalType !== null}
      onClose={closeModal}
      title={
        modalType === 'contact'
          ? 'Contact Us'
          : modalType === 'benefit'
          ? 'Free Benefits Checklist'
          : ''
      }
    >
      {modalType === 'contact' && <ContactForm />}
      {modalType === 'benefit' && (
        <BenefitForm focus={(modalProps as { focus?: string })?.focus} />
      )}
    </BaseModal>
  );
}
