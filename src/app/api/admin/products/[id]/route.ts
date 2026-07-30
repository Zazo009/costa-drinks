import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { products as staticProducts } from '@/data/products';
import { createServiceClient } from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-server-user';
import { isAdminEmail } from '@/lib/admin';

const bodySchema = z.object({
  priceCents: z.number().int().positive().nullable(),
  enabled: z.boolean(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userClient = await createUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  if (!staticProducts.some((p) => p.id === params.id)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const admin = createServiceClient();
  const { error } = await admin.from('product_overrides').upsert({
    product_id: params.id,
    price_cents: parsed.data.priceCents,
    enabled: parsed.data.enabled,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
