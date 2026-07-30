export type DeliveryTown = {
  id: string;
  name: { en: string; es: string };
  /** Approx. driving distance in km from the Marbella depot. Negative = west (toward Estepona), positive = east (toward Calahonda). */
  offsetKm: number;
};

/**
 * Serviceable coastline, ordered west → east. The depot is in Marbella
 * (offsetKm 0). Coverage runs from Estepona in the west to Calahonda in the
 * east — anything outside this range is out of the delivery zone.
 */
export const DELIVERY_TOWNS: DeliveryTown[] = [
  { id: 'estepona', name: { en: 'Estepona', es: 'Estepona' }, offsetKm: -26 },
  { id: 'cancelada', name: { en: 'Cancelada', es: 'Cancelada' }, offsetKm: -19 },
  { id: 'san-pedro', name: { en: 'San Pedro de Alcántara', es: 'San Pedro de Alcántara' }, offsetKm: -10 },
  { id: 'nueva-andalucia', name: { en: 'Nueva Andalucía', es: 'Nueva Andalucía' }, offsetKm: -6 },
  { id: 'puerto-banus', name: { en: 'Puerto Banús', es: 'Puerto Banús' }, offsetKm: -5 },
  { id: 'marbella', name: { en: 'Marbella (centre)', es: 'Marbella (centro)' }, offsetKm: 0 },
  { id: 'golden-mile', name: { en: 'Golden Mile', es: 'Milla de Oro' }, offsetKm: 3 },
  { id: 'elviria', name: { en: 'Elviria', es: 'Elviria' }, offsetKm: 9 },
  { id: 'cabopino', name: { en: 'Cabopino', es: 'Cabopino' }, offsetKm: 13 },
  { id: 'calahonda', name: { en: 'Calahonda', es: 'Calahonda' }, offsetKm: 16 },
];

export const MIN_OFFSET_KM = Math.min(...DELIVERY_TOWNS.map((t) => t.offsetKm));
export const MAX_OFFSET_KM = Math.max(...DELIVERY_TOWNS.map((t) => t.offsetKm));

export function getTown(id: string): DeliveryTown | undefined {
  return DELIVERY_TOWNS.find((t) => t.id === id);
}

export function isInDeliveryZone(id: string): boolean {
  return getTown(id) !== undefined;
}

/** Distance from the Marbella depot, in km, always positive. */
export function distanceFromDepot(id: string): number | null {
  const town = getTown(id);
  return town ? Math.abs(town.offsetKm) : null;
}
