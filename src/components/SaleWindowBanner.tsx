'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, CheckCircle2 } from 'lucide-react';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';

/**
 * Client component: the pages that render this are SSG, so a server-side
 * check would bake the open/closed state in at build time and go stale.
 * `initialOpen` is the build-time value (keeps hydration consistent);
 * the effect corrects it immediately and keeps it fresh while open.
 */
export default function SaleWindowBanner({ initialOpen = false }: { initialOpen?: boolean }) {
  const t = useTranslations('saleWindow');
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    const sync = () => setOpen(isAlcoholSaleWindowOpen());
    sync();
    const id = setInterval(sync, 30_000);
    return () => clearInterval(id);
  }, []);

  const Icon = open ? CheckCircle2 : Clock;

  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border p-4 text-left text-sm ${
        open
          ? 'border-green-200 bg-green-50 text-green-900'
          : 'border-red-200 bg-red-50 text-red-900'
      }`}
    >
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold">{open ? t('openTitle') : t('closedTitle')}</p>
        <p className="mt-1">{open ? t('openBody') : t('closedBody')}</p>
      </div>
    </div>
  );
}
