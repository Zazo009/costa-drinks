'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import SiteHeader from '@/components/SiteHeader';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function ProfilePage() {
  const t = useTranslations('account');
  const ta = useTranslations('auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setName((data.user.user_metadata?.full_name as string) ?? '');
      setPhone((data.user.user_metadata?.phone as string) ?? '');
      setEmail(data.user.email ?? '');
    });
  }, [router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name, phone } });
    setSavingProfile(false);
    if (error) {
      toast.error(ta('errorGeneric'));
    } else {
      toast.success(t('profileSaved'));
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return;
    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast.error(ta('errorGeneric'));
    } else {
      toast.success(t('passwordSaved'));
      setPassword('');
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch('/api/account/delete', { method: 'POST' });
    if (res.ok) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } else {
      setDeleting(false);
      toast.error(ta('errorGeneric'));
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-6 font-display text-2xl font-medium italic text-ink">
          {t('profileTitle')}
        </h1>

        <form onSubmit={saveProfile} className="mb-8 space-y-3 rounded-2xl border border-ink/[0.06] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
            {t('profileTitle')}
          </p>
          <input
            value={email}
            disabled
            className="w-full rounded-lg border border-ink/10 bg-ink/[0.03] px-3 py-2.5 text-sm text-ink/40"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={ta('name')}
            className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phone')}
            className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-50"
          >
            {savingProfile && <Loader2 size={14} className="animate-spin" />}
            {t('save')}
          </button>
        </form>

        <form onSubmit={savePassword} className="mb-8 space-y-3 rounded-2xl border border-ink/[0.06] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
            {t('changePassword')}
          </p>
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={ta('password')}
            className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={savingPassword || password.length < 6}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-50"
          >
            {savingPassword && <Loader2 size={14} className="animate-spin" />}
            {t('save')}
          </button>
        </form>

        <div className="mb-4 rounded-2xl border border-ink/[0.06] bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">
            {t('yourData')}
          </p>
          <a
            href="/api/account/export"
            download
            className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-gold-dark"
          >
            <Download size={15} />
            {t('exportData')}
          </a>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700">
            <AlertTriangle size={13} />
            {t('dangerZone')}
          </p>
          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-sm font-medium text-red-700 hover:underline"
            >
              {t('deleteAccount')}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-800">{t('deleteAccountConfirm')}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                >
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  {t('deleteAccountConfirmCta')}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
