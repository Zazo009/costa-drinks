import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function SiteFooter() {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-14 text-white/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <img src="/logo-on-dark.svg" alt="" className="h-7 w-auto" />
          <p className="font-display text-lg italic text-white/80">Costa Drinks</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          <Link href="/legal" className="transition-colors hover:text-gold-light">
            {t('legalNotice')}
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-gold-light">
            {t('privacyPolicy')}
          </Link>
          <Link href="/cookies" className="transition-colors hover:text-gold-light">
            {t('cookiePolicy')}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-gold-light">
            {t('terms')}
          </Link>
          <Link href="/returns" className="transition-colors hover:text-gold-light">
            {t('returnsPolicy')}
          </Link>
          <Link href="/contact" className="transition-colors hover:text-gold-light">
            {t('contact')}
          </Link>
        </nav>

        <div className="h-px w-12 bg-white/10" />

        <div className="space-y-1 text-xs leading-relaxed">
          <p className="max-w-md text-white/35">{t('legal')}</p>
          <p className="text-white/50">{t('company')}</p>
          <p className="text-white/35">{t('address')}</p>
        </div>
      </div>
    </footer>
  );
}
