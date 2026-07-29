import { NextRequest, NextResponse } from 'next/server';
import { createUserClient } from '@/lib/supabase-server-user';

export async function GET() {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ favorites: [] });

  const { data } = await supabase.from('favorites').select('product_id').eq('user_id', user.id);
  return NextResponse.json({ favorites: (data ?? []).map((f) => f.product_id) });
}

export async function POST(req: NextRequest) {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });

  await supabase.from('favorites').insert({ user_id: user.id, product_id: productId });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });

  await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
  return NextResponse.json({ ok: true });
}
