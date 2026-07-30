'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Search, X } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductThumbnail from '@/components/ProductThumbnail';
import FavoriteButton from '@/components/FavoriteButton';
import { formatPrice, type Product } from '@/data/products';

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
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as Product['category'] | null) ?? 'all';
  const [category, setCategory] = useState<Product['category'] | 'all'>(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'all'
  );
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => setVisible(PAGE_SIZE), [category, query]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []));
  }, []);

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
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-full border border-ink/10 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-colors focus:border-gold"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label={t('clearSearch')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink"
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
                ? 'bg-ink text-white'
                : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            {t(c)}
          </button>
        ))}
      </div>

      <p className="mb-5 text-xs uppercase tracking-wider text-ink/35">
        {t('resultsCount', { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink/15 py-16 text-center">
          <p className="text-ink/50">{t('noResults')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {visibleProducts.map((product) => {
              const name = locale === 'es' ? product.name.es : product.name.en;
              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-ink/[0.06] bg-white shadow-[0_1px_2px_rgba(20,17,13,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(20,17,13,0.08)]"
                >
                  <div className="relative">
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
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                      {t(product.category)} · {product.abv}%
                    </p>
                    <h2 className="mb-2 line-clamp-2 flex-1 text-sm font-medium leading-snug text-ink sm:text-[15px]">
                      {name}
                    </h2>
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="font-display text-lg font-semibold text-ink">
                        {formatPrice(product.priceCents, locale)}
                      </span>
                    </div>
                    <AddToCartButton productId={product.id} productLabel={name} />
                  </div>
                </div>
              );
            })}
          </div>

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full border border-ink/15 px-7 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-ink/[0.03]"
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
