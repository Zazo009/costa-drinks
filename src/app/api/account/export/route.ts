import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/supabase-server-user';

export async function GET() {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const [{ data: orders }, { data: favorites }, { data: addresses }] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, status, locale, delivery_address, delivery_city, delivery_postcode, delivery_slot_label, items, amount_total_cents, created_at'
      ),
    supabase.from('favorites').select('product_id, created_at'),
    supabase.from('addresses').select('label, address, city, postcode, is_default'),
  ]);

  const exportData = {
    profile: {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      phone: user.user_metadata?.phone ?? null,
      created_at: user.created_at,
    },
    orders: orders ?? [],
    favorites: favorites ?? [],
    addresses: addresses ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="costa-drinks-my-data.json"',
    },
  });
}
