'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['pending', 'paid', 'delivered', 'cancelled'] as const;

export default function AdminStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  async function handleChange(next: string) {
    setValue(next);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-ink/10 bg-white px-2 py-1 text-xs font-medium capitalize outline-none focus:border-gold"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
