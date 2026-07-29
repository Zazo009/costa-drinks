'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useFavoritesStore } from '@/lib/favorites-store';

export default function FavoriteButton({ productId }: { productId: string }) {
  const t = useTranslations('products');
  const router = useRouter();
  const pathname = usePathname();
  const { ids, loaded, load, toggle } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loaded) load();
  }, [loaded, load]);

  const isFavorited = ids.has(productId);

  return (
    <button
      type="button"
      aria-label={t('favorite')}
      onClick={async () => {
        try {
          await toggle(productId);
        } catch {
          toast.error(t('loginToFavorite'));
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
        }
      }}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
    >
      <Heart
        size={16}
        className={mounted && isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}
      />
    </button>
  );
}
