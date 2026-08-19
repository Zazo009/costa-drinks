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

      <section className="hero-lifestyle-bg relative overflow-hidden">
        {/* living Marbella-sunset backdrop: slow-drifting warm blobs */}
        <div
          aria-hidden
          className="hero-blob animate-drift-a -right-20 -top-32 h-[520px] w-[520px]"
          style={{ background: 'radial-gradient(circle, rgba(255,138,92,0.55) 0%, rgba(255,138,92,0) 70%)' }}
        />
        <div
          aria-hidden
          className="hero-blob animate-drift-b right-10 top-24 h-[420px] w-[420px]"
          style={{ background: 'radial-gradient(circle, rgba(224,83,138,0.42) 0%, rgba(224,83,138,0) 70%)' }}
        />
        <div
          aria-hidden
          className="hero-blob animate-drift-c right-1/3 bottom-0 h-[460px] w-[460px]"
          style={{ background: 'radial-gradient(circle, rgba(224,180,106,0.4) 0%, rgba(224,180,106,0) 70%)' }}
        />
        <div
          aria-hidden
          className="hero-blob animate-drift-b -left-10 bottom-[-10%] h-[380px] w-[380px]"
          style={{ background: 'radial-gradient(circle, rgba(31,111,120,0.4) 0%, rgba(31,111,120,0) 70%)' }}
        />
        {/* scrim so headline/CTA stay legible over the moving colour */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#14101f] via-[#14101f]/70 to-transparent"
        />
        {/* horizon line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
        />

        {/* animated drinks — signals "alcohol delivery" at a glance */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 bottom-0 hidden opacity-90 md:block lg:right-10"
        >
          <svg width="240" height="300" viewBox="0 0 240 300" fill="none">
            <defs>
              <clipPath id="coupeLiquid">
                <path d="M76 150 H164 L158 196 Q158 224 120 224 Q82 224 82 196 Z" />
              </clipPath>
            </defs>

            {/* wine glass, set back and slightly left */}
            <g opacity="0.55" transform="translate(0 18)">
              <path
                d="M18 40 H62 L57 108 Q57 128 40 128 Q23 128 23 108 Z"
                fill="none"
                stroke="#e0b46a"
                strokeWidth="2.5"
              />
              <path
                d="M23 100 L57 100 L57 108 Q57 128 40 128 Q23 128 23 108 Z"
                fill="#a97e3f"
                opacity="0.5"
              />
              <line x1="40" y1="128" x2="40" y2="168" stroke="#e0b46a" strokeWidth="2.5" />
              <line x1="26" y1="170" x2="54" y2="170" stroke="#e0b46a" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* coupe glass, foreground */}
            <g className="animate-liquid" style={{ transformOrigin: '120px 190px' }}>
              <path
                d="M76 150 H164 L158 196 Q158 224 120 224 Q82 224 82 196 Z"
                fill="none"
                stroke="#f3ead9"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M82 194 L158 194 L158 196 Q158 224 120 224 Q82 224 82 196 Z"
                fill="#c7a15e"
                opacity="0.85"
              />
              <line x1="120" y1="224" x2="120" y2="264" stroke="#f3ead9" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="98" y1="266" x2="142" y2="266" stroke="#f3ead9" strokeWidth="3.5" strokeLinecap="round" />

              <g clipPath="url(#coupeLiquid)">
                <circle className="animate-bubble" cx="102" cy="212" r="2.5" fill="#f3ead9" style={{ animationDelay: '0s' }} />
                <circle className="animate-bubble" cx="120" cy="216" r="2" fill="#f3ead9" style={{ animationDelay: '0.9s' }} />
                <circle className="animate-bubble" cx="136" cy="210" r="2.5" fill="#f3ead9" style={{ animationDelay: '1.7s' }} />
                <circle className="animate-bubble" cx="112" cy="206" r="1.6" fill="#f3ead9" style={{ animationDelay: '2.4s' }} />
              </g>
            </g>
          </svg>
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-20 sm:gap-8 sm:px-10 sm:pb-24 sm:pt-28">
          <span
            className="animate-rise-in text-xs font-medium uppercase tracking-[0.22em] text-gold-light"
            style={{ animationDelay: '0ms' }}
          >
            {t('hero.subtitle')}
          </span>
          <h1 className="max-w-2xl text-balance font-display text-4xl font-medium italic leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            <span
              className="animate-rise-in block text-white"
              style={{ animationDelay: '90ms' }}
            >
              {t('hero.titleLine1')}
            </span>
            <span
              className="animate-rise-in block text-gold-light"
              style={{ animationDelay: '220ms' }}
            >
              {t('hero.titleLine2')}
            </span>
          </h1>

          <div className="max-w-sm animate-rise-in" style={{ animationDelay: '340ms' }}>
            <SaleWindowBanner />
          </div>

          <div
            className="flex flex-wrap items-center gap-6 animate-rise-in"
            style={{ animationDelay: '420ms' }}
          >
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

          <div
            className="mt-4 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/[0.14] pt-6 sm:mt-6 animate-rise-in"
            style={{ animationDelay: '500ms' }}
          >
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
