import { TIMEZONE, SALES_CLOSE_HOUR, SALES_OPEN_HOUR } from './sale-window';

export type DeliverySlot = {
  id: string;
  startHour: number;
  endHour: number;
  label: string;
};

const MIN_LEAD_MINUTES = 45;

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

/**
 * Same-day delivery slots only, hourly, clamped to the legal 08:00-22:00
 * window (Ley 4/1997, Andalucía), with a minimum lead time before the
 * earliest bookable slot. Always evaluate against server time.
 */
export function getAvailableDeliverySlots(now: Date = new Date()): DeliverySlot[] {
  const { hour, minute } = madridParts(now);
  const earliestBookableMinutes = hour * 60 + minute + MIN_LEAD_MINUTES;

  const slots: DeliverySlot[] = [];
  for (let h = SALES_OPEN_HOUR; h < SALES_CLOSE_HOUR; h++) {
    const slotEndMinutes = (h + 1) * 60;
    if (slotEndMinutes <= earliestBookableMinutes) continue;
    slots.push({
      id: `${h}-${h + 1}`,
      startHour: h,
      endHour: h + 1,
      label: `${String(h).padStart(2, '0')}:00 – ${String(h + 1).padStart(2, '0')}:00`,
    });
  }
  return slots;
}

export function isSlotStillValid(slotId: string, now: Date = new Date()): boolean {
  const available = getAvailableDeliverySlots(now);
  return available.some((s) => s.id === slotId);
}
