import { getTranslations } from 'next-intl/server';
import { preload } from 'react-dom';
import AgeGate from '@/components/AgeGate';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import HeroStatus from '@/components/HeroStatus';
import HeroMedia from '@/components/HeroMedia';
import HeroCta from '@/components/HeroCta';
import { Link } from '@/i18n/navigation';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';
import { RTL_LOCALES } from '@/i18n/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // The hero poster is the LCP element — start fetching it from the <head>,
  // before the parser reaches the <img> deep in the body.
  preload('/hero-poster.jpg', {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: '/hero-poster-mobile.jpg 828w, /hero-poster.jpg 1600w',
    imageSizes: '100vw',
  });

  const { locale } = await params;
  const isRtl = RTL_LOCALES.includes(locale);
  const t = await getTranslations();
  const open = isAlcoholSaleWindowOpen();

  const claims = [
    t('hero.badgeDelivery'),
    t('hero.badgeLegal'),
    t('hero.badgeSelection'),
    t('hero.claimWeekly'),
  ];

  const categories: Array<{ key: 'wine' | 'spirits' | 'beer' | 'cava'; emoji: string }> = [
    { key: 'wine', emoji: '🍷' },
    { key: 'spirits', emoji: '🥃' },
    { key: 'beer', emoji: '🍺' },
    { key: 'cava', emoji: '🥂' },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <AgeGate />
      <SiteHeader />

      <section
        className="relative flex-1 overflow-hidden bg-[#0b1a17]"
        style={{ minHeight: 'clamp(540px, 74vh, 880px)' }}
      >
        <HeroMedia />

        {/* scrims — carry text legibility, tuned to this footage. The
            horizontal scrim is heaviest where the copy column sits, so it
            mirrors for RTL locales (copy reads from the right there). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(100deg, rgba(11,26,23,.95) 0%, rgba(11,26,23,.91) 10%, rgba(11,26,23,.84) 20%, rgba(11,26,23,.74) 30%, rgba(11,26,23,.6) 40%, rgba(11,26,23,.46) 50%, rgba(11,26,23,.33) 60%, rgba(11,26,23,.22) 70%, rgba(11,26,23,.12) 80%, rgba(11,26,23,.05) 90%, rgba(11,26,23,0) 100%)',
            transform: isRtl ? 'scaleX(-1)' : undefined,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(to top, rgba(11,26,23,.72) 0%, rgba(11,26,23,.6) 12%, rgba(11,26,23,.46) 24%, rgba(11,26,23,.32) 36%, rgba(11,26,23,.2) 48%, rgba(11,26,23,.11) 60%, rgba(11,26,23,.04) 72%, rgba(11,26,23,0) 84%)',
          }}
        />

        {/* content column (z-2) */}
        <div
          className="font-cd-body relative z-[2] flex w-full flex-col justify-center"
          style={{
            maxWidth: 'min(100%, 980px)',
            padding: 'clamp(28px,4vw,72px) clamp(20px,4vw,64px) clamp(24px,3vw,48px)',
            gap: 'clamp(20px, 2.4vw, 32px)',
          }}
        >
          <div className="flex flex-col" style={{ gap: 'clamp(20px, 2.4vw, 30px)' }}>
            <span
              className="animate-cd-widen text-[13px] uppercase tracking-[0.22em] text-[#e9a86a]"
              style={{ animationDelay: '0ms' }}
            >
              {t('hero.subtitle')}
            </span>

            <h1
              className="font-cd-display text-balance italic"
              style={{ fontSize: 'clamp(44px, 6.4vw, 86px)', lineHeight: 1.02, letterSpacing: '-.02em' }}
            >
              <span
                className="animate-cd-rise block text-[#f7f3ea]"
                style={{ animationDelay: '100ms' }}
              >
                {t('hero.titleLine1')}
              </span>
              <span
                className="animate-cd-rise block text-[#e9a86a]"
                style={{ animationDelay: '240ms' }}
              >
                {t('hero.titleLine2')}
              </span>
            </h1>

            <div
              className="animate-cd-wipe h-[2px] w-full bg-[#e9a86a]"
              style={{ transformOrigin: 'left', animationDelay: '420ms' }}
            />

            <div className="animate-cd-rise" style={{ animationDelay: '500ms' }}>
              <HeroStatus />
            </div>

            <div
              className="animate-cd-rise flex flex-wrap items-center gap-5"
              style={{ animationDelay: '600ms' }}
            >
              <HeroCta initialOpen={open} />
              <Link
                href="/products"
                className="cd-focus-ring border-b-2 pb-[3px] text-[15px] text-[#e9a86a] transition-colors hover:text-[#f0dcb4]"
                style={{ borderColor: 'rgba(233,168,106,.45)' }}
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          <div
            className="animate-cd-rise grid gap-[18px] border-t-2 pt-5"
            style={{
              borderColor: '#1c3630',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              animationDelay: '720ms',
            }}
          >
            {claims.map((label, i) => (
              <span
                key={label}
                className="text-[12px] uppercase tracking-[.14em]"
                style={{ color: i === claims.length - 1 ? '#e9a86a' : '#7d918a' }}
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
