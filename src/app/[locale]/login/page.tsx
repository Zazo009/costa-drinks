'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import SiteHeader from '@/components/SiteHeader';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(t('errorInvalid'));
      return;
    }
    const next = searchParams.get('next') || `/${locale}/account`;
    router.push(next.replace(/^\/(en|es)/, ''));
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('loginTitle')}</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
          />
          <input
            type="password"
            required
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-900"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 disabled:bg-gray-300"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {t('loginCta')}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          {t('noAccount')}{' '}
          <Link href="/signup" className="font-medium text-gray-900 underline">
            {t('signupCta')}
          </Link>
        </p>
      </section>
    </main>
  );
}
