'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/lib/cart-store';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const t = useTranslations('nav');
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur">
      <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
        Costa Drinks
      </Link>
      <nav className="flex items-center gap-5">
        <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          {t('shop')}
        </Link>
        <Link
          href="/cart"
          className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ShoppingCart size={17} />
          {t('cart')}
          {mounted && count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
              {count}
            </span>
          )}
        </Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
