'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(t('errorGeneric'));
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push('/account');
      router.refresh();
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-6 text-2xl font-bold text-ink">{t('resetPasswordTitle')}</h1>

        {done ? (
          <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            {t('passwordSaved')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              required
              minLength={6}
              placeholder={t('newPassword')}
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
              {t('savePassword')}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
