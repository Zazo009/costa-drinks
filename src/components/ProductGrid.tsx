'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AddToCartButton from '@/components/AddToCartButton';
import ProductThumbnail from '@/components/ProductThumbnail';
import { products, formatPrice, type Product } from '@/data/products';

const CATEGORIES: Array<Product['category'] | 'all'> = ['all', 'wine', 'beer', 'cava', 'spirits', 'aperitivo'];

export default function ProductGrid() {
  const t = useTranslations('products');
  const locale = useLocale();
  const [category, setCategory] = useState<Product['category'] | 'all'>('all');

  const filtered = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.category === category)),
    [category]
  );

  return (
    <>
      <div className="mb-8 flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(c)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => {
          const name = locale === 'es' ? product.name.es : product.name.en;
          return (
            <div
              key={product.id}
              className="group flex flex-col rounded-xl border border-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3">
                <ProductThumbnail
                  category={product.category}
                  image={product.image}
                  alt={name}
                  bgClass={product.bgClass}
                  artColor={product.artColor}
                  artLabel={product.artLabel}
                />
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
    </>
  );
}
