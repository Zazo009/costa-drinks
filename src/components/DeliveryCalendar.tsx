'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  /** Bookable Madrid-calendar dates, YYYY-MM-DD, ascending. */
  dates: string[];
  value: string;
  onChange: (dateKey: string) => void;
  locale: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * Compact month calendar for picking a delivery day. Only the dates the
 * server offers (today..+7 days) are clickable; everything else is muted.
 * Weeks start on Monday, as customary in Spain.
 */
export default function DeliveryCalendar({ dates, value, onChange, locale }: Props) {
  const available = new Set(dates);
  const months = Array.from(new Set(dates.map((d) => d.slice(0, 7)))).sort();
  const [monthKey, setMonthKey] = useState(
    () => (value ? value.slice(0, 7) : months[0]) ?? months[0]
  );
  const monthIndex = Math.max(0, months.indexOf(monthKey));

  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // getUTCDay: 0=Sun..6=Sat → Monday-start column 0..6
  const firstColumn = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  // 2024-01-01 was a Monday; noon UTC keeps the weekday stable everywhere.
  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
      .format(new Date(Date.UTC(2024, 0, 1 + i, 12)))
      .slice(0, 2)
  );

  const cells: Array<string | null> = [
    ...Array.from({ length: firstColumn }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${monthKey}-${pad(i + 1)}`),
  ];

  return (
    <div className="max-w-xs rounded-xl border border-ink/10 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthIndexSafe(monthIndex - 1)}
          disabled={monthIndex === 0}
          aria-label="previous month"
          className="rounded-md p-1 text-ink/60 transition-colors enabled:hover:bg-ink/5 enabled:hover:text-ink disabled:opacity-25"
        >
          <ChevronLeft size={16} className="rtl:rotate-180" />
        </button>
        <span className="text-sm font-medium capitalize text-ink">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setMonthIndexSafe(monthIndex + 1)}
          disabled={monthIndex >= months.length - 1}
          aria-label="next month"
          className="rounded-md p-1 text-ink/60 transition-colors enabled:hover:bg-ink/5 enabled:hover:text-ink disabled:opacity-25"
        >
          <ChevronRight size={16} className="rtl:rotate-180" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayNames.map((w, i) => (
          <span key={i} className="py-1 text-[11px] font-medium uppercase text-ink/35">
            {w}
          </span>
        ))}
        {cells.map((dateKey, i) =>
          dateKey === null ? (
            <span key={`pad-${i}`} />
          ) : available.has(dateKey) ? (
            <button
              key={dateKey}
              type="button"
              onClick={() => onChange(dateKey)}
              className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                value === dateKey
                  ? 'bg-ink text-white'
                  : 'bg-gold/10 text-ink hover:bg-gold/25'
              }`}
            >
              {Number(dateKey.slice(8, 10))}
            </button>
          ) : (
            <span
              key={dateKey}
              className="flex aspect-square items-center justify-center text-sm text-ink/20"
            >
              {Number(dateKey.slice(8, 10))}
            </span>
          )
        )}
      </div>
    </div>
  );

  function setMonthIndexSafe(i: number) {
    if (i >= 0 && i < months.length) setMonthKey(months[i]);
  }
}
