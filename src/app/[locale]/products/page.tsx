import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import AgeGate from '@/components/AgeGate';
import SiteHeader from '@/components/SiteHeader';
import SaleWindowBanner from '@/components/SaleWindowBanner';
import ProductGrid from '@/components/ProductGrid';
import SiteFooter from '@/components/SiteFooter';

export default async function ProductsPage() {
  const t = await getTranslations('products');

  return (
    <main className="min-h-screen bg-cream">
      <AgeGate />
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl font-medium italic text-ink sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-ink/50">{t('subtitle')}</p>

        <div className="my-6 max-w-md">
          <SaleWindowBanner />
        </div>

        <Suspense>
          <ProductGrid />
        </Suspense>
      </section>
      <SiteFooter />
    </main>
  );
}
