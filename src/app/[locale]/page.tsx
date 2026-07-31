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

  const categories: Array<{ key: 'wine' | 'spirits' | 'beer' | 'cava'; emoji: string }> = [
    { key: 'wine', emoji: '🍷' },
    { key: 'spirits', emoji: '🥃' },
    { key: 'beer', emoji: '🍺' },
    { key: 'cava', emoji: '🥂' },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <AgeGate />
      <SiteHeader />

      <section className="relative overflow-hidden bg-ink">
        {/* sun disc, dusk glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full sm:-right-16 sm:-top-32 sm:h-[520px] sm:w-[520px]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(224,180,106,0.55) 0%, rgba(169,126,63,0.32) 42%, rgba(169,126,63,0) 72%)',
          }}
        />
        {/* horizon line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-20 sm:gap-8 sm:px-10 sm:pb-24 sm:pt-28">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-gold-light">
            Marbella · Estepona · Benahavís
          </span>
          <h1 className="max-w-2xl text-balance font-display text-4xl font-medium italic leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="max-w-md text-white/50">{t('hero.subtitle')}</p>

          <div className="max-w-sm">
            <SaleWindowBanner />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {open ? (
              <Link
                href="/products"
                className="rounded-sm bg-[#f3ead9] px-7 py-4 text-center text-base font-semibold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all hover:bg-white active:scale-[0.98]"
              >
                {t('hero.cta')}
              </Link>
            ) : (
              <button
                disabled
                className="cursor-not-allowed rounded-sm bg-white/10 px-7 py-4 text-base font-semibold text-white/40"
              >
                {t('hero.ctaDisabled')}
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/[0.14] pt-6 sm:mt-6">
            {badges.map(({ label }) => (
              <span
                key={label}
                className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink/35">
          {t('hero.badgeSelection')}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map(({ key, emoji }) => (
            <Link
              key={key}
              href={`/products?category=${key}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink/[0.06] bg-white px-4 py-8 text-center transition-all hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_12px_24px_rgba(20,17,13,0.06)]"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{emoji}</span>
              <span className="text-sm font-medium text-ink">{t(`products.${key}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
