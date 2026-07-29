import { getTranslations } from 'next-intl/server';
import AgeGate from '@/components/AgeGate';
import SiteHeader from '@/components/SiteHeader';
import SaleWindowBanner from '@/components/SaleWindowBanner';
import ProductGrid from '@/components/ProductGrid';
import SiteFooter from '@/components/SiteFooter';

export default async function ProductsPage() {
  const t = await getTranslations('products');

  return (
    <main className="min-h-screen bg-white">
      <AgeGate />
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>

        <div className="my-6 max-w-md">
          <SaleWindowBanner />
        </div>

        <ProductGrid />
      </section>
      <SiteFooter />
    </main>
  );
}
