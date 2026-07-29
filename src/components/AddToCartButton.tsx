'use client';

import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function AddToCartButton({
  productId,
  productLabel,
}: {
  productId: string;
  productLabel: string;
}) {
  const t = useTranslations('products');
  const add = useCartStore((s) => s.add);

  return (
    <button
      onClick={() => {
        add(productId);
        toast.success(t('added', { name: productLabel }));
      }}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 active:scale-[0.98]"
    >
      <ShoppingCart size={16} />
      {t('addToCart')}
    </button>
  );
}
