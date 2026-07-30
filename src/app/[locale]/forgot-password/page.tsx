'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import SiteHeader from '@/components/SiteHeader';
import { createClient } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/reset-password`,
    });
    setLoading(false);
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-6 text-2xl font-bold text-ink">{t('forgotPasswordTitle')}</h1>

        {done ? (
          <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            {t('resetEmailSent')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-ink/60">{t('forgotPasswordBody')}</p>
            <input
              type="email"
              required
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gold-dark disabled:bg-ink/15"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {t('sendResetLink')}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-ink/50">
          <Link href="/login" className="font-medium text-ink underline">
            {t('backToLogin')}
          </Link>
        </p>
      </section>
    </main>
  );
}
