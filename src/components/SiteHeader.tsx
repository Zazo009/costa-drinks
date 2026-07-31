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
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-cream/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-8 sm:py-5">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-7 w-auto sm:h-8" />
          <span className="font-display text-lg font-semibold italic tracking-tight text-ink sm:text-xl">
            Costa Drinks
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          <Link
            href="/products"
            className="text-sm font-medium text-ink/60 transition-colors hover:text-ink"
          >
            {t('shop')}
          </Link>
          <Link
            href={loggedIn ? '/account' : '/login'}
            className="flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
          >
            <User size={17} strokeWidth={1.75} />
            <span className="hidden sm:inline">{loggedIn ? t('account') : t('login')}</span>
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
          >
            <ShoppingCart size={17} strokeWidth={1.75} />
            <span className="hidden sm:inline">{t('cart')}</span>
            {mounted && count > 0 && (
              <span className="absolute -right-2.5 -top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-white">
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
