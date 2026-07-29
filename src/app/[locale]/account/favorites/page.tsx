import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import ProductThumbnail from '@/components/ProductThumbnail';
import FavoriteButton from '@/components/FavoriteButton';
import AddToCartButton from '@/components/AddToCartButton';
import { createUserClient } from '@/lib/supabase-server-user';
import { products, formatPrice } from '@/data/products';
import { getLocale } from 'next-intl/server';

export default async function FavoritesPage() {
  const t = await getTranslations('account');
  const locale = await getLocale();
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data } = await supabase.from('favorites').select('product_id').eq('user_id', user.id);
  const favoriteIds = new Set((data ?? []).map((f) => f.product_id));
  const favoriteProducts = products.filter((p) => favoriteIds.has(p.id));

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('favoritesTitle')}</h1>

        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
            <Heart className="text-gray-400" size={24} />
            <p className="text-gray-500">{t('noFavorites')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProducts.map((product) => {
              const name = locale === 'es' ? product.name.es : product.name.en;
              return (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-xl border border-gray-100 p-4 shadow-sm"
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
                  <p className="mb-3 mt-1 font-semibold text-gray-900">
                    {formatPrice(product.priceCents, locale)}
                  </p>
                  <AddToCartButton productId={product.id} productLabel={name} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
