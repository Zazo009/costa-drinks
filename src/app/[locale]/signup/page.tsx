'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import SiteHeader from '@/components/SiteHeader';
import { createClient } from '@/lib/supabase-browser';

export default function SignupPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message === 'User already registered' ? t('errorExists') : t('errorGeneric'));
      return;
    }
    if (data.session) {
      router.push('/account');
      router.refresh();
      return;
    }
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-6 text-2xl font-bold text-ink">{t('signupTitle')}</h1>

        {done ? (
          <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            {t('confirmEmail')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              placeholder={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              type="email"
              required
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gold-dark disabled:bg-ink/15"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {t('signupCta')}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-ink/50">
          {t('haveAccount')}{' '}
          <Link href="/login" className="font-medium text-ink underline">
            {t('loginCta')}
          </Link>
        </p>
      </section>
    </main>
  );
}
