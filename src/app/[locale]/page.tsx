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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(169,126,63,0.18),_transparent_60%)]"
        />
        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-7 px-6 py-20 text-center sm:py-28">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-light">
            Marbella · Estepona · Benahavís
          </span>
          <h1 className="font-display text-4xl font-medium italic leading-[1.1] tracking-tight text-white sm:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="text-white/50">{t('hero.subtitle')}</p>

          <div className="w-full max-w-sm">
            <SaleWindowBanner />
          </div>

          {open ? (
            <Link
              href="/products"
              className="w-full max-w-sm rounded-full bg-gold px-6 py-4 text-center text-base font-semibold text-ink shadow-[0_8px_24px_rgba(169,126,63,0.35)] transition-all hover:bg-gold-light active:scale-[0.98]"
            >
              {t('hero.cta')}
            </Link>
          ) : (
            <button
              disabled
              className="w-full max-w-sm cursor-not-allowed rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white/40"
            >
              {t('hero.ctaDisabled')}
            </button>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-white/45">
                <Icon size={14} strokeWidth={1.75} className="text-gold-light" />
                {label}
              </div>
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
