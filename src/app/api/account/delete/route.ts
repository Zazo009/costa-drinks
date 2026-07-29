import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/supabase-server-user';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST() {
  const userClient = await createUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const admin = createServiceClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: 'delete_failed' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
