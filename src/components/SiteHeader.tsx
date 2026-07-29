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
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
      <Link href="/" className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
        Costa Drinks
      </Link>
      <nav className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/products"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {t('shop')}
        </Link>
        <Link
          href={loggedIn ? '/account' : '/login'}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <User size={17} />
          <span className="hidden sm:inline">{loggedIn ? t('account') : t('login')}</span>
        </Link>
        <Link
          href="/cart"
          className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ShoppingCart size={17} />
          <span className="hidden sm:inline">{t('cart')}</span>
          {mounted && count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
              {count}
            </span>
          )}
        </Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
