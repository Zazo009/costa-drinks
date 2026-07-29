const TIMEZONE = 'Europe/Madrid';
const SALES_CLOSE_HOUR = 22;
const SALES_OPEN_HOUR = 8;

/**
 * Andalucía Ley 4/1997, Art. 26.1.d): distance/delivery alcohol sales are
 * prohibited between 22:00 and 08:00. This must be evaluated server-side —
 * never trust the client's clock or timezone for this check.
 */
export function isAlcoholSaleWindowOpen(now: Date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      hour12: false,
    }).format(now)
  );

  return hour >= SALES_OPEN_HOUR && hour < SALES_CLOSE_HOUR;
}

export function getMadridHour(now: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      hour12: false,
    }).format(now)
  );
}

export { TIMEZONE, SALES_CLOSE_HOUR, SALES_OPEN_HOUR };
