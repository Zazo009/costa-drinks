'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Wine } from 'lucide-react';

const STORAGE_KEY = 'costa-drinks-age-verified';

export default function AgeGate() {
  const t = useTranslations('ageGate');
  const [status, setStatus] = useState<'checking' | 'blocked' | 'declined' | 'clear'>('checking');

  useEffect(() => {
    const verified = window.sessionStorage.getItem(STORAGE_KEY);
    setStatus(verified === 'true' ? 'clear' : 'blocked');
  }, []);

  if (status === 'checking' || status === 'clear') {
    return null;
  }

  const confirm = () => {
    window.sessionStorage.setItem(STORAGE_KEY, 'true');
    setStatus('clear');
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-[fadeIn_0.15s_ease-out] items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-[popIn_0.2s_ease-out] rounded-3xl bg-white p-7 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark">
          <Wine className="text-white" size={24} strokeWidth={1.5} />
        </div>
        <h2 className="mb-2 font-display text-xl font-medium text-ink">{t('heading')}</h2>
        <p className="mb-6 text-sm text-ink/60">
          {status === 'declined' ? t('declineMessage') : t('body')}
        </p>
        {status !== 'declined' && (
          <div className="flex flex-col gap-2">
            <button
              onClick={confirm}
              className="w-full rounded-full bg-ink px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gold-dark active:scale-[0.98]"
            >
              {t('confirm')}
            </button>
            <button
              onClick={() => setStatus('declined')}
              className="w-full rounded-full border border-ink/15 px-4 py-3 text-sm font-medium text-ink/70 hover:bg-ink/[0.03]"
            >
              {t('decline')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
