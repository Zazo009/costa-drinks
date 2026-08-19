'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { isAlcoholSaleWindowOpen, TIMEZONE } from '@/lib/sale-window';

function madridClock(now: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  );
  return `${parts.hour}:${parts.minute}:${parts.second}`;
}

/**
 * Isolated leaf: the 1Hz tick only re-renders this component, not the
 * rest of the hero. Interval pauses while the tab is hidden.
 */
export default function HeroStatus() {
  const t = useTranslations('hero');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      id = setInterval(() => setNow(new Date()), 1000);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };
    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        setNow(new Date());
        start();
      }
    };
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const open = isAlcoholSaleWindowOpen(now);

  return (
    <div className="font-cd-body flex flex-wrap items-center gap-2.5 text-[15px] text-[#c2cfc9]">
      <span
        aria-hidden="true"
        className="animate-cd-pulse h-2 w-2 shrink-0"
        style={{ background: open ? '#a8d0a8' : '#e0503a' }}
      />
      <span aria-live="polite" suppressHydrationWarning>
        <span className="font-semibold text-[#f7f3ea]">
          {open ? t('statusOpenLabel') : t('statusClosedLabel')}
        </span>
        {' — '}
        {open ? t('statusOpenDetail') : t('statusClosedDetail')}
      </span>
      <span aria-hidden="true" className="text-[#7d918a] [font-variant-numeric:tabular-nums]" suppressHydrationWarning>
        {madridClock(now)}
      </span>
    </div>
  );
}
