'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function LogoutButton() {
  const t = useTranslations('auth');
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
      }}
      className="text-sm font-medium text-ink/60 hover:text-ink"
    >
      {t('logout')}
    </button>
  );
}
