import { NextRequest, NextResponse } from 'next/server';
import { getAvailableDeliverySlots, getDeliveryDates } from '@/lib/delivery-slots';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';

// Slots depend on the current Madrid time — never prerender this at build.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // While the sale window is closed (22:00-08:00, Ley 4/1997) no orders may
  // be placed at all — not even scheduled ones, since the sale itself is the
  // regulated act. Match what /api/checkout enforces.
  if (!isAlcoholSaleWindowOpen()) {
    return NextResponse.json({ dates: [], slots: [] });
  }

  const dates = getDeliveryDates();
  const requested = req.nextUrl.searchParams.get('date');
  const dateKey = requested && dates.includes(requested) ? requested : dates[0];

  return NextResponse.json({
    dates,
    slots: dateKey ? getAvailableDeliverySlots(new Date(), dateKey) : [],
  });
}
