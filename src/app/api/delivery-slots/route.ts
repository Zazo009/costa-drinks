import { NextResponse } from 'next/server';
import { getAvailableDeliverySlots } from '@/lib/delivery-slots';

export async function GET() {
  return NextResponse.json({ slots: getAvailableDeliverySlots() });
}
