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

      <section className="grid grid-cols-1 overflow-hidden bg-[#0e3a3c] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-center gap-6 px-6 py-16 sm:gap-7 sm:px-10 sm:py-20 lg:py-24">
          <span className="w-fit rounded-full bg-[#d7e05a] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0e3a3c]">
            {t('hero.subtitle')}
          </span>
          <h1 className="max-w-xl text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-[#f4efe1] sm:text-6xl lg:text-6xl xl:text-7xl">
            {t('hero.title')}
          </h1>

          <div className="max-w-sm">
            <SaleWindowBanner />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {open ? (
              <Link
                href="/products"
                className="rounded-full bg-[#d7e05a] px-7 py-4 text-center text-base font-bold text-[#0e3a3c] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all hover:brightness-105 active:scale-[0.98]"
              >
                {t('hero.cta')}
              </Link>
            ) : (
              <button
                disabled
                className="cursor-not-allowed rounded-full bg-[#f4efe1]/10 px-7 py-4 text-base font-bold text-[#f4efe1]/40"
              >
                {t('hero.ctaDisabled')}
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#f4efe1]/[0.14] pt-6 sm:mt-6">
            {badges.map(({ label }) => (
              <span
                key={label}
                className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#f4efe1]/45"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden lg:min-h-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(58% 58% at 70% 32%, rgba(215,224,90,0.24) 0%, rgba(215,224,90,0) 70%), linear-gradient(200deg, #0a2c2e 0%, #0e3a3c 60%, #123f42 100%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage: 'radial-gradient(rgba(244,239,225,0.06) 1.5px, transparent 1.5px)',
              backgroundSize: '26px 26px',
            }}
          />
          <svg
            aria-hidden
            viewBox="0 0 200 260"
            className="absolute right-[10%] top-1/2 h-auto w-[190px] -translate-y-1/2 drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)] sm:w-[240px]"
          >
            <path
              d="M40 20 L160 20 L145 150 Q145 175 100 175 Q55 175 55 150 Z"
              fill="none"
              stroke="#f4efe1"
              strokeWidth="3"
              opacity="0.85"
            />
            <path
              d="M55 150 Q55 175 100 175 Q145 175 145 150 L142 118 L58 118 Z"
              fill="#d7e05a"
              opacity="0.55"
            />
            <line x1="100" y1="175" x2="100" y2="230" stroke="#f4efe1" strokeWidth="3" opacity="0.85" />
            <line x1="65" y1="230" x2="135" y2="230" stroke="#f4efe1" strokeWidth="3" opacity="0.85" />
            <circle cx="90" cy="70" r="9" fill="#f4efe1" opacity="0.9" />
            <circle cx="118" cy="95" r="7" fill="#f4efe1" opacity="0.75" />
            <circle cx="75" cy="100" r="6" fill="#f4efe1" opacity="0.6" />
            <line x1="150" y1="30" x2="150" y2="70" stroke="#d7e05a" strokeWidth="3" strokeLinecap="round" />
          </svg>
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
