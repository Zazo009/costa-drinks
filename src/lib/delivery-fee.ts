import { distanceFromDepot } from './delivery-zone';

const FREE_DELIVERY_THRESHOLD_CENTS = 5000; // 50 €

const FEE_BANDS = [
  { maxKm: 5, feeCents: 295 },
  { maxKm: 15, feeCents: 495 },
  { maxKm: Infinity, feeCents: 695 },
];

/**
 * Distance-tiered delivery fee, in cents. Free above the order-value
 * threshold. Returns null if the zone isn't recognised (caller should
 * treat that as an invalid/out-of-zone order).
 */
export function computeDeliveryFeeCents(zoneId: string, subtotalCents: number): number | null {
  const km = distanceFromDepot(zoneId);
  if (km === null) return null;

  if (subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS) return 0;

  const band = FEE_BANDS.find((b) => km <= b.maxKm);
  return band ? band.feeCents : FEE_BANDS[FEE_BANDS.length - 1].feeCents;
}

export { FREE_DELIVERY_THRESHOLD_CENTS };
