import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function SiteFooter() {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
      <p className="mb-2">{t('legal')}</p>
      <p className="mb-1 text-gray-500">{t('company')}</p>
      <p className="mb-4">{t('address')}</p>
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-500">
        <Link href="/legal" className="hover:text-gray-900 hover:underline">
          {t('legalNotice')}
        </Link>
        <Link href="/privacy" className="hover:text-gray-900 hover:underline">
          {t('privacyPolicy')}
        </Link>
        <Link href="/cookies" className="hover:text-gray-900 hover:underline">
          {t('cookiePolicy')}
        </Link>
        <Link href="/terms" className="hover:text-gray-900 hover:underline">
          {t('terms')}
        </Link>
        <Link href="/returns" className="hover:text-gray-900 hover:underline">
          {t('returnsPolicy')}
        </Link>
        <Link href="/contact" className="hover:text-gray-900 hover:underline">
          {t('contact')}
        </Link>
      </nav>
    </footer>
  );
}
