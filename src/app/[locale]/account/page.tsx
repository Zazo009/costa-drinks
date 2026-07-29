import { getTranslations } from 'next-intl/server';
import { User, Package, Heart } from 'lucide-react';
import { redirect } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import LogoutButton from '@/components/LogoutButton';
import { Link } from '@/i18n/navigation';
import { createUserClient } from '@/lib/supabase-server-user';

export default async function AccountPage() {
  const t = await getTranslations('account');
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const name = (user.user_metadata?.full_name as string) || user.email;

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5">
              <User className="text-ink/50" size={20} />
            </div>
            <div>
              <p className="font-semibold text-ink">{name}</p>
              <p className="text-sm text-ink/50">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="flex items-center gap-3 rounded-xl border border-ink/[0.06] p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <Package className="text-ink/35" size={22} />
            <div>
              <p className="font-semibold text-ink">{t('ordersTitle')}</p>
              <p className="text-sm text-ink/50">{t('ordersSubtitle')}</p>
            </div>
          </Link>
          <Link
            href="/account/favorites"
            className="flex items-center gap-3 rounded-xl border border-ink/[0.06] p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <Heart className="text-ink/35" size={22} />
            <div>
              <p className="font-semibold text-ink">{t('favoritesTitle')}</p>
              <p className="text-sm text-ink/50">{t('favoritesSubtitle')}</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
