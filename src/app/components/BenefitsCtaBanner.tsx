'use client';

import { useModal } from '@/app/hooks/useModal';
import { event as gaEvent } from '@/lib/utils/gtag';

type Props = {
  focus?: string;
  copy?: string;
};

export default function BenefitsCtaBanner({ focus, copy }: Props) {
  const { openModal } = useModal();

  const handleClick = () => {
    gaEvent({
      action: 'check_benefits_click',
      category: 'engagement',
      label: `Benefits CTA Banner${focus ? ` - ${focus}` : ''}`,
    });
    openModal('benefit', { focus });
  };

  return (
    <div className="mt-12">
      <blockquote
        className="border-l-4 pl-4 italic text-[var(--color-muted-text)] text-base"
        style={{ borderColor: 'var(--color-primary) !important' }}
      >
        {copy || <>Curious what government help you might qualify for?</>}
        <br />
        <span
          className="underline cursor-pointer text-[var(--color-link)] hover:text-[var(--color-link-hover)]"
          onClick={handleClick}
        >
          Get matched with programs that can help — quick, easy, and totally
          free.
        </span>
      </blockquote>
    </div>
  );
}
