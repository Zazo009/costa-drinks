import { getTranslations } from 'next-intl/server';
import { Clock, CheckCircle2 } from 'lucide-react';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';

export default async function SaleWindowBanner() {
  const t = await getTranslations('saleWindow');
  const open = isAlcoholSaleWindowOpen();
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
