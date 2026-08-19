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
        className="cd-focus-ring flex items-center gap-1.5 border-2 border-[#0b1a17] px-3 py-1.5 text-[13px] tracking-[0.08em] text-[#0b1a17] transition-colors hover:bg-[#0b1a17] hover:text-[#f6f3ea]"
      >
        <Globe size={14} strokeWidth={1.75} />
        {LANGUAGE_NAMES[locale]?.code ?? locale.toUpperCase()}
        <ChevronDown size={13} strokeWidth={1.75} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden border-2 border-[#0b1a17] bg-[#f6f3ea] py-1 shadow-[0_12px_32px_rgba(11,26,23,0.18)]"
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
                loc === locale ? 'bg-[#0b1a17]/5 font-medium text-[#0b1a17]' : 'text-[#0b1a17]/70 hover:bg-[#0b1a17]/[0.05]'
              }`}
            >
              <span>{LANGUAGE_NAMES[loc]?.native ?? loc}</span>
              {loc === locale && <Check size={14} className="text-[#e9a86a]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
