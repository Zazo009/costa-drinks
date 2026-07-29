import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUserClient } from '@/lib/supabase-server-user';
import { getTown } from '@/lib/delivery-zone';

const addressSchema = z.object({
  label: z.string().min(1).max(40),
  address: z.string().min(1),
  zoneId: z.string().min(1),
  postcode: z.string().min(1),
  isDefault: z.boolean().optional(),
  locale: z.enum(['en', 'es']).default('es'),
});

export async function GET() {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ addresses: [] });

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  return NextResponse.json({ addresses: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const parsed = addressSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  const { label, address, zoneId, postcode, isDefault, locale } = parsed.data;

  const town = getTown(zoneId);
  if (!town) return NextResponse.json({ error: 'out_of_zone' }, { status: 400 });

  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      label,
      address,
      city: town.name[locale],
      zone_id: zoneId,
      postcode,
      is_default: !!isDefault,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
  return NextResponse.json({ address: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });

  await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
  return NextResponse.json({ ok: true });
}
