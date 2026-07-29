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
      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:bg-gold-dark active:scale-[0.98] sm:text-sm sm:normal-case sm:tracking-normal"
    >
      <ShoppingCart size={15} />
      {t('addToCart')}
    </button>
  );
}
