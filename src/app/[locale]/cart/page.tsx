'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import SiteHeader from '@/components/SiteHeader';
import QuantityStepper from '@/components/QuantityStepper';
import { useCartStore } from '@/lib/cart-store';
import { products, formatPrice } from '@/data/products';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const rows = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((r): r is { product: (typeof products)[number]; quantity: number } => r !== null);

  const subtotalCents = rows.reduce(
    (sum, r) => sum + r.product.priceCents * r.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>

        {!mounted ? null : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="text-gray-400" size={24} />
            </div>
            <p className="font-medium text-gray-900">{t('empty')}</p>
            <p className="text-sm text-gray-500">{t('emptyBody')}</p>
            <Link
              href="/products"
              className="mt-2 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {rows.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-4 py-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {locale === 'es' ? product.name.es : product.name.en}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(product.priceCents, locale)}
                    </p>
                  </div>
                  <QuantityStepper
                    quantity={quantity}
                    onChange={(next) => setQuantity(product.id, next)}
                  />
                  <button
                    onClick={() => remove(product.id)}
                    aria-label={t('remove')}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{t('subtotal')}</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(subtotalCents, locale)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{t('subtotalNote')}</p>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 active:scale-[0.98]"
            >
              {t('checkout')}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
