import { NextResponse } from 'next/server';
import { getAvailableDeliverySlots } from '@/lib/delivery-slots';

// Slots depend on the current Madrid time — never prerender this at build.
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ slots: getAvailableDeliverySlots() });
}
