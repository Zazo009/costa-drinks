'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingCart, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/cart-store';
import { createClient } from '@/lib/supabase-browser';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const t = useTranslations('nav');
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#0b1a17] bg-[#f6f3ea]">
      <div className="flex flex-wrap items-center justify-between gap-6 px-5 py-[18px] sm:px-8 lg:px-16">
        <Link href="/" className="flex flex-none items-center gap-3.5">
          <svg width="26" height="34" viewBox="0 0 26 34" fill="none" aria-hidden="true">
            <path d="M5 3h16v9a8 8 0 0 1-16 0z" stroke="#0b1a17" strokeWidth="1.6" />
            <path d="M8 9h10v3a5 5 0 0 1-10 0z" fill="#e9a86a" />
            <path d="M13 20v10M8 31h10" stroke="#0b1a17" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="font-cd-display whitespace-nowrap text-[29px] italic tracking-[-0.01em] text-[#0b1a17]">
            Costa Drinks
          </span>
        </Link>
        <nav className="font-cd-body flex flex-wrap items-center gap-4 text-[15px] sm:gap-[clamp(16px,2.5vw,38px)]">
          <Link
            href="/products"
            className="cd-focus-ring text-[#0b1a17] transition-colors hover:text-[#e0503a]"
          >
            {t('shop')}
          </Link>
          <Link
            href={loggedIn ? '/account' : '/login'}
            className="cd-focus-ring flex items-center gap-1.5 text-[#0b1a17] transition-colors hover:text-[#e0503a]"
          >
            <User size={17} strokeWidth={1.75} />
            <span className="hidden sm:inline">{loggedIn ? t('account') : t('login')}</span>
          </Link>
          <Link
            href="/cart"
            className="cd-focus-ring relative flex items-center gap-1.5 text-[#0b1a17] transition-colors hover:text-[#e0503a]"
          >
            <ShoppingCart size={17} strokeWidth={1.75} />
            <span className="hidden sm:inline">{t('cart')}</span>
            {mounted && count > 0 && (
              <span className="absolute -right-2.5 -top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e0503a] text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
