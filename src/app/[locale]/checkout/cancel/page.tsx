import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SiteHeader from '@/components/SiteHeader';

export default async function CheckoutCancelPage() {
  const t = await getTranslations('orderStatus');

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold text-ink">{t('cancelTitle')}</h1>
        <p className="mb-6 text-ink/60">{t('cancelBody')}</p>
        <Link href="/products" className="text-sm font-medium underline">
          {t('backToShop')}
        </Link>
      </section>
    </main>
  );
}
