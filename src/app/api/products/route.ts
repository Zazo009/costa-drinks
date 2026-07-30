import { NextResponse } from 'next/server';
import { getLiveProducts } from '@/lib/products-live';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getLiveProducts();
  return NextResponse.json({ products });
}
