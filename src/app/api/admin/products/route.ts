import { NextResponse } from 'next/server';
import { products as staticProducts } from '@/data/products';
import { createServiceClient } from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-server-user';
import { isAdminEmail } from '@/lib/admin';
import { DEFAULT_STOCK } from '@/lib/products-live';

export async function GET() {
  const userClient = await createUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const admin = createServiceClient();
  const { data } = await admin
    .from('product_overrides')
    .select('product_id, price_cents, stock, enabled');

  const overrides = new Map((data ?? []).map((o) => [o.product_id, o]));

  const products = staticProducts.map((p) => {
    const override = overrides.get(p.id);
    return {
      id: p.id,
      name: p.name.en,
      category: p.category,
      basePriceCents: p.priceCents,
      priceCents: override?.price_cents ?? p.priceCents,
      stock: override?.stock ?? DEFAULT_STOCK,
      enabled: override?.enabled ?? true,
      hasOverride: !!override,
    };
  });

  return NextResponse.json({ products });
}
