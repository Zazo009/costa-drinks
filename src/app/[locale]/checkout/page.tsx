'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, ShieldCheck, MapPin } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { useCartStore } from '@/lib/cart-store';
import { products, formatPrice } from '@/data/products';
import { createClient } from '@/lib/supabase-browser';
import { DELIVERY_TOWNS, distanceFromDepot } from '@/lib/delivery-zone';
import { computeDeliveryFeeCents } from '@/lib/delivery-fee';
import type { DeliverySlot } from '@/lib/delivery-slots';

type SavedAddress = {
  id: string;
  label: string;
  address: string;
  city: string;
  postcode: string;
  zone_id: string | null;
  is_default: boolean;
};

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
  const [zoneId, setZoneId] = useState('');
  const [postcode, setPostcode] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  useEffect(() => {
    fetch('/api/delivery-slots')
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots);
        if (data.slots.length > 0) setSlotId(data.slots[0].id);
      });

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setName((data.user.user_metadata?.full_name as string) ?? '');
      setPhone((data.user.user_metadata?.phone as string) ?? '');
      setEmail(data.user.email ?? '');
    });

    fetch('/api/addresses')
      .then((r) => r.json())
      .then((data) => {
        const addresses: SavedAddress[] = data.addresses ?? [];
        setSavedAddresses(addresses);
        const def = addresses.find((a) => a.is_default) ?? addresses[0];
        if (def) {
          setSelectedAddressId(def.id);
          setAddress(def.address);
          setZoneId(def.zone_id ?? '');
          setPostcode(def.postcode);
        }
      });
  }, []);

  function applyAddress(a: SavedAddress) {
    setSelectedAddressId(a.id);
    setAddress(a.address);
    setZoneId(a.zone_id ?? '');
    setPostcode(a.postcode);
  }

  const rows = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((r): r is { product: (typeof products)[number]; quantity: number } => r !== null);

  const subtotalCents = rows.reduce((sum, r) => sum + r.product.priceCents * r.quantity, 0);
  const deliveryFeeCents = zoneId ? computeDeliveryFeeCents(zoneId, subtotalCents) : null;
  const totalCents = subtotalCents + (deliveryFeeCents ?? 0);

  const canSubmit =
    rows.length > 0 &&
    slots.length > 0 &&
    slotId &&
    name &&
    email &&
    phone &&
    address &&
    zoneId &&
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
            zoneId,
            postcode,
            slotId,
            slotLabel: slot?.label ?? '',
          },
          ageConfirmed: true,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === 'sale_window_closed'
            ? t('errorClosed')
            : data.error === 'out_of_zone'
              ? t('errorOutOfZone')
              : t('errorGeneric')
        );
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
              {savedAddresses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => applyAddress(a)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        selectedAddressId === a.id
                          ? 'bg-ink text-white'
                          : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                      }`}
                    >
                      <MapPin size={12} />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
              <input
                placeholder={t('address')}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setSelectedAddressId(null);
                }}
                className={inputClass}
              />
              <div className="flex gap-3">
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className={`${inputClass} ${zoneId ? 'text-ink' : 'text-ink/40'}`}
                >
                  <option value="" disabled>
                    {t('city')}
                  </option>
                  {DELIVERY_TOWNS.map((town) => (
                    <option key={town.id} value={town.id}>
                      {locale === 'es' ? town.name.es : town.name.en}
                    </option>
                  ))}
                </select>
                <input
                  placeholder={t('postcode')}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className={inputClass}
                />
              </div>
              {zoneId && (
                <p className="flex items-center gap-1.5 text-xs text-ink/45">
                  <MapPin size={12} />
                  {t('distanceFromDepot', { km: distanceFromDepot(zoneId) ?? 0 })}
                </p>
              )}

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
              <div className="flex justify-between px-3 py-2 text-sm text-ink/60">
                <span>{t('subtotal')}</span>
                <span>{formatPrice(subtotalCents, locale)}</span>
              </div>
              <div className="flex justify-between px-3 py-2 text-sm text-ink/60">
                <span>{t('deliveryFee')}</span>
                <span>
                  {deliveryFeeCents === null
                    ? t('selectCityFirst')
                    : deliveryFeeCents === 0
                      ? t('free')
                      : formatPrice(deliveryFeeCents, locale)}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2 text-sm font-semibold">
                <span>{t('total')}</span>
                <span>{formatPrice(totalCents, locale)}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm text-ink/70">{t('paymentMethod')}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    paymentMethod === 'online'
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink/10 text-ink/70 hover:bg-ink/[0.03]'
                  }`}
                >
                  {t('payOnline')}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink/10 text-ink/70 hover:bg-ink/[0.03]'
                  }`}
                >
                  {t('payOnDelivery')}
                </button>
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
              {submitting ? t('processing') : paymentMethod === 'cod' ? t('confirmOrder') : t('pay')}
            </button>
          </Section>
        </div>
      </section>
    </main>
  );
}
