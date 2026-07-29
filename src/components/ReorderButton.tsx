'use client';

import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/lib/cart-store';
import type { CartItem } from '@/lib/cart-store';

export default function ReorderButton({ items }: { items: CartItem[] }) {
  const t = useTranslations('account');
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const add = useCartStore((s) => s.add);

  return (
    <button
      onClick={() => {
        clear();
        items.forEach((item) => add(item.productId, item.quantity));
        router.push('/cart');
      }}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <RotateCcw size={14} />
      {t('reorder')}
    </button>
  );
}
