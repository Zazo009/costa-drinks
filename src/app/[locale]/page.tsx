import { getTranslations } from 'next-intl/server';
import { Truck, ShieldCheck, GlassWater } from 'lucide-react';
import AgeGate from '@/components/AgeGate';
import SaleWindowBanner from '@/components/SaleWindowBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Link } from '@/i18n/navigation';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';

export default async function Home() {
  const t = await getTranslations();
  const open = isAlcoholSaleWindowOpen();

  const badges = [
    { icon: Truck, label: t('hero.badgeDelivery') },
    { icon: ShieldCheck, label: t('hero.badgeLegal') },
    { icon: GlassWater, label: t('hero.badgeSelection') },
  ];

  return (
    <main className="min-h-screen bg-white">
      <AgeGate />
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white"
        />
        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-16 text-center sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="text-gray-500">{t('hero.subtitle')}</p>

          <div className="w-full max-w-sm">
            <SaleWindowBanner />
          </div>

          {open ? (
            <Link
              href="/products"
              className="w-full max-w-sm rounded-lg bg-gray-900 px-6 py-3.5 text-center text-base font-semibold text-white shadow-sm transition-transform hover:bg-gray-700 active:scale-[0.98]"
            >
              {t('hero.cta')}
            </Link>
          ) : (
            <button
              disabled
              className="w-full max-w-sm cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3.5 text-base font-semibold text-white"
            >
              {t('hero.ctaDisabled')}
            </button>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Icon size={15} className="text-gray-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
