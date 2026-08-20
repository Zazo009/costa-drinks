'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';

/**
 * Client component: the homepage is SSG, so deciding open/closed on the
 * server would bake the CTA state in at build time and go stale.
 * `initialOpen` is the build-time value (keeps hydration consistent);
 * the effect corrects it immediately and keeps it fresh while open.
 */
export default function HeroCta({ initialOpen }: { initialOpen: boolean }) {
  const t = useTranslations('hero');
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    const sync = () => setOpen(isAlcoholSaleWindowOpen());
    sync();
    const id = setInterval(sync, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!open) {
    return (
      <button
        disabled
        className="inline-flex cursor-not-allowed items-center gap-3.5 bg-[#f7f3ea]/20 px-[26px] py-[18px] text-[16px] font-semibold tracking-[.01em] text-[#f7f3ea]/50"
      >
        {t('ctaDisabled')}
      </button>
    );
  }

  return (
    <Link
      href="/products"
      className="cd-focus-ring inline-flex items-center gap-3.5 bg-[#f7f3ea] px-[26px] py-[18px] text-[16px] font-semibold tracking-[.01em] text-[#0b1a17] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e9a86a]"
    >
      {t('cta')}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="rtl:rotate-180">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      </svg>
    </Link>
  );
}
