'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LANGUAGE_NAMES: Record<string, { native: string; code: string }> = {
  es: { native: 'Español', code: 'ES' },
  en: { native: 'English', code: 'EN' },
  fr: { native: 'Français', code: 'FR' },
  de: { native: 'Deutsch', code: 'DE' },
  ar: { native: 'العربية', code: 'AR' },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:border-ink/20 hover:text-ink"
      >
        <Globe size={14} strokeWidth={1.75} />
        {LANGUAGE_NAMES[locale]?.code ?? locale.toUpperCase()}
        <ChevronDown size={13} strokeWidth={1.75} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-xl border border-ink/10 bg-white py-1 shadow-[0_12px_32px_rgba(20,17,13,0.14)]"
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              role="option"
              aria-selected={loc === locale}
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: loc });
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors ${
                loc === locale ? 'bg-ink/5 font-medium text-ink' : 'text-ink/70 hover:bg-ink/[0.03]'
              }`}
            >
              <span>{LANGUAGE_NAMES[loc]?.native ?? loc}</span>
              {loc === locale && <Check size={14} className="text-gold-dark" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
