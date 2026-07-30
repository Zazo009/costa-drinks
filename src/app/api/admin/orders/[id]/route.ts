import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUserClient } from '@/lib/supabase-server-user';
import { createServiceClient } from '@/lib/supabase-server';
import { isAdminEmail } from '@/lib/admin';

const bodySchema = z.object({
  status: z.enum(['pending', 'paid', 'delivered', 'cancelled']),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userClient = await createUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const admin = createServiceClient();
  const { error } = await admin
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
