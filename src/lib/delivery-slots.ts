import { TIMEZONE, SALES_CLOSE_HOUR, SALES_OPEN_HOUR } from './sale-window';

export type DeliverySlot = {
  id: string;
  startHour: number;
  endHour: number;
  label: string;
};

const MIN_LEAD_MINUTES = 45;

/** How many days ahead an order can be scheduled (0 = same-day only). */
export const MAX_ADVANCE_DAYS = 30;

function madridParts(now: Date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value])
  );
  return {
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

function madridDateKey(now: Date, offsetDays: number): string {
  // Adding whole days then reading the Madrid calendar date is DST-safe for
  // our purposes: Madrid's clock changes happen at 02:00-03:00, far from the
  // 08:00-22:00 window, so the date component never lands on the wrong day.
  const d = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return madridParts(d).dateKey;
}

/**
 * Dates that currently accept orders: today (if it still has bookable
 * slots) plus up to MAX_ADVANCE_DAYS ahead. Keys are Madrid-calendar
 * YYYY-MM-DD strings.
 */
export function getDeliveryDates(now: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let offset = 0; offset <= MAX_ADVANCE_DAYS; offset++) {
    const dateKey = madridDateKey(now, offset);
    if (getAvailableDeliverySlots(now, dateKey).length > 0) {
      dates.push(dateKey);
    }
  }
  return dates;
}

/**
 * Hourly delivery slots for the given Madrid-calendar date, clamped to the
 * legal 08:00-22:00 window (Ley 4/1997, Andalucía). Same-day slots respect
 * a minimum lead time; future dates (up to MAX_ADVANCE_DAYS) offer the full
 * window. Always evaluate against server time.
 */
export function getAvailableDeliverySlots(
  now: Date = new Date(),
  dateKey: string = madridParts(now).dateKey
): DeliverySlot[] {
  const { hour, minute, dateKey: todayKey } = madridParts(now);

  let earliestBookableMinutes = 0;
  if (dateKey === todayKey) {
    earliestBookableMinutes = hour * 60 + minute + MIN_LEAD_MINUTES;
  } else {
    // Future date: must be a real offered date, not arbitrary or past.
    let valid = false;
    for (let offset = 1; offset <= MAX_ADVANCE_DAYS; offset++) {
      if (madridDateKey(now, offset) === dateKey) {
        valid = true;
        break;
      }
    }
    if (!valid) return [];
  }

  const slots: DeliverySlot[] = [];
  for (let h = SALES_OPEN_HOUR; h < SALES_CLOSE_HOUR; h++) {
    const slotEndMinutes = (h + 1) * 60;
    if (slotEndMinutes <= earliestBookableMinutes) continue;
    slots.push({
      id: `${dateKey}|${h}-${h + 1}`,
      startHour: h,
      endHour: h + 1,
      label: `${String(h).padStart(2, '0')}:00 – ${String(h + 1).padStart(2, '0')}:00`,
    });
  }
  return slots;
}

export function isSlotStillValid(slotId: string, now: Date = new Date()): boolean {
  // Date-qualified ids ("YYYY-MM-DD|h-h"); bare ids from before scheduling
  // existed mean same-day.
  const [dateKey, timePart] = slotId.includes('|')
    ? slotId.split('|')
    : [madridParts(now).dateKey, slotId];
  const available = getAvailableDeliverySlots(now, dateKey);
  return available.some((s) => s.id === `${dateKey}|${timePart}`);
}
