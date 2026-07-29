'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SiteHeader from '@/components/SiteHeader';
import { useCartStore } from '@/lib/cart-store';

export default function CheckoutSuccessPage() {
  const t = useTranslations('orderStatus');
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">{t('successTitle')}</h1>
        <p className="mb-6 text-gray-600">{t('successBody')}</p>
        <Link href="/products" className="text-sm font-medium underline">
          {t('backToShop')}
        </Link>
      </section>
    </main>
  );
}
