'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, ShieldCheck } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useCartStore } from '@/lib/cart-store';
import { products, formatPrice } from '@/data/products';
import type { DeliverySlot } from '@/lib/delivery-slots';

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
          {step}
        </span>
        <h2 className="font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const items = useCartStore((s) => s.items);

  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/delivery-slots')
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots);
        if (data.slots.length > 0) setSlotId(data.slots[0].id);
      });
  }, []);

  const rows = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((r): r is { product: (typeof products)[number]; quantity: number } => r !== null);

  const totalCents = rows.reduce((sum, r) => sum + r.product.priceCents * r.quantity, 0);

  const canSubmit =
    rows.length > 0 &&
    slots.length > 0 &&
    slotId &&
    name &&
    email &&
    phone &&
    address &&
    city &&
    postcode &&
    ageConfirmed &&
    !submitting;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const slot = slots.find((s) => s.id === slotId);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          items: rows.map((r) => ({ productId: r.product.id, quantity: r.quantity })),
          customer: { name, email, phone },
          delivery: {
            address,
            city,
            postcode,
            slotId,
            slotLabel: slot?.label ?? '',
          },
          ageConfirmed: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === 'sale_window_closed' ? t('errorClosed') : t('errorGeneric'));
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError(t('errorGeneric'));
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-ink">{t('title')}</h1>

        <div className="space-y-10">
          <Section step={1} title={t('contact')}>
            <div className="space-y-3">
              <input
                placeholder={t('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
              <input
                placeholder={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <input
                placeholder={t('phone')}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </Section>

          <Section step={2} title={t('delivery')}>
            <div className="space-y-3">
              <input
                placeholder={t('address')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
              />
              <div className="flex gap-3">
                <input
                  placeholder={t('city')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder={t('postcode')}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="pt-2">
                <p className="mb-2 text-sm text-ink/70">{t('slot')}</p>
                <p className="mb-3 text-xs text-ink/50">{t('slotHelp')}</p>
                {slots.length === 0 ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                    {t('noSlots')}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSlotId(s.id)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                          slotId === s.id
                            ? 'bg-ink text-white'
                            : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section step={3} title={t('step3')}>
            <div className="divide-y divide-ink/[0.06] rounded-lg border border-ink/[0.06]">
              {rows.map((r) => (
                <div key={r.product.id} className="flex justify-between px-3 py-2 text-sm">
                  <span>
                    {(locale === 'es' ? r.product.name.es : r.product.name.en)} × {r.quantity}
                  </span>
                  <span>{formatPrice(r.product.priceCents * r.quantity, locale)}</span>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2 text-sm font-semibold">
                <span>{t('total')}</span>
                <span>{formatPrice(totalCents, locale)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
              <span>{t('idNotice')}</span>
            </div>

            <label className="mt-4 flex items-start gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1"
              />
              {t('ageConfirm')}
            </label>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:bg-ink/15"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {submitting ? t('processing') : t('pay')}
            </button>
          </Section>
        </div>
      </section>
    </main>
  );
}
