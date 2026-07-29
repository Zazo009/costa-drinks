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
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-ink">{t('title')}</h1>

        {!mounted ? null : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink/10 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5">
              <ShoppingBag className="text-ink/35" size={24} />
            </div>
            <p className="font-medium text-ink">{t('empty')}</p>
            <p className="text-sm text-ink/50">{t('emptyBody')}</p>
            <Link
              href="/products"
              className="mt-2 rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-gold-dark"
            >
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-ink/[0.06]">
              {rows.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-4 py-4">
                  <div className="flex-1">
                    <p className="font-medium text-ink">
                      {locale === 'es' ? product.name.es : product.name.en}
                    </p>
                    <p className="text-sm text-ink/50">
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
                    className="text-ink/35 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-ink/[0.06] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{t('subtotal')}</span>
                <span className="text-lg font-semibold text-ink">
                  {formatPrice(subtotalCents, locale)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/35">{t('subtotalNote')}</p>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="mt-6 w-full rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gold-dark active:scale-[0.98]"
            >
              {t('checkout')}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
