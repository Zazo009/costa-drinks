'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, X } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductThumbnail from '@/components/ProductThumbnail';
import FavoriteButton from '@/components/FavoriteButton';
import { products, formatPrice, type Product } from '@/data/products';

const CATEGORIES: Array<Product['category'] | 'all'> = [
  'all',
  'wine',
  'beer',
  'cava',
  'spirits',
  'aperitivo',
  'mixer',
];

const PAGE_SIZE = 24;

export default function ProductGrid() {
  const t = useTranslations('products');
  const locale = useLocale();
  const [category, setCategory] = useState<Product['category'] | 'all'>('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => setVisible(PAGE_SIZE), [category, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return p.name.es.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q);
    });
  }, [category, query]);

  const visibleProducts = filtered.slice(0, visible);

  return (
    <>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-gray-900"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label={t('clearSearch')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(c)}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs text-gray-400">{t('resultsCount', { count: filtered.length })}</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-500">{t('noResults')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => {
              const name = locale === 'es' ? product.name.es : product.name.en;
              return (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-xl border border-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative mb-3">
                    <ProductThumbnail
                      category={product.category}
                      image={product.image}
                      alt={name}
                      bgClass={product.bgClass}
                      artColor={product.artColor}
                      artLabel={product.artLabel}
                    />
                    <div className="absolute right-2 top-2">
                      <FavoriteButton productId={product.id} />
                    </div>
                  </div>
                  <h2 className="font-semibold text-gray-900">{name}</h2>
                  <p className="mb-2 text-sm text-gray-500">
                    {locale === 'es' ? product.description.es : product.description.en}
                  </p>
                  <p className="mb-3 text-xs text-gray-400">
                    {t('abv')}: {product.abv}%
                  </p>
                  <div className="mt-auto mb-3 flex items-center justify-between gap-3">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(product.priceCents, locale)}
                    </span>
                  </div>
                  <AddToCartButton productId={product.id} productLabel={name} />
                </div>
              );
            })}
          </div>

          {visible < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
