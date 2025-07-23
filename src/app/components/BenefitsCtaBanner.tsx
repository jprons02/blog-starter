'use client';

import { useModal } from '@/app/hooks/useModal';
import { event as gaEvent } from '@/lib/utils/gtag';

export default function BenefitsCtaBanner() {
  const { openModal } = useModal();

  const handleClick = () => {
    gaEvent({
      action: 'check_benefits_click',
      category: 'engagement',
      label: 'Benefits CTA Banner',
    });
    openModal('benefit');
  };

  return (
    <div className="mt-12">
      <blockquote
        className="border-l-4 pl-4 italic text-[var(--color-muted-text)] text-base"
        style={{ borderColor: 'var(--color-primary) !important' }}
      >
        Curious what government help you might qualify for? <br />
        <span
          className="underline cursor-pointer text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
          onClick={handleClick}
        >
          Take our free 2-minute benefits check.
        </span>
      </blockquote>
    </div>
  );
}
