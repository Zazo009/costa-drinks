/**
 * Spanish IVA (VAT) on alcoholic beverages and sugary soft drinks is the
 * general 21% rate (Ley 37/1992, Art. 90 — alcohol is excluded from the
 * reduced-rate food categories in Art. 91; Ley 11/2020 moved sweetened
 * drinks to the general rate too).
 *
 * Spanish consumer law requires prices shown to consumers to already
 * include VAT (no "+IVA" surcharge at checkout like US sales tax) — so
 * this only computes the IVA portion already baked into a gross price,
 * for the legally required breakdown on the receipt.
 */
export const IVA_RATE = 0.21;

/** Given a VAT-inclusive amount, returns the IVA portion in cents. */
export function ivaFromGrossCents(grossCents: number): number {
  return Math.round(grossCents - grossCents / (1 + IVA_RATE));
}

/** Given a VAT-inclusive amount, returns the pre-tax base in cents. */
export function baseFromGrossCents(grossCents: number): number {
  return grossCents - ivaFromGrossCents(grossCents);
}
