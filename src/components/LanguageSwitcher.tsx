'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            loc === locale ? 'bg-ink text-white' : 'text-ink/50 hover:bg-ink/5'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
