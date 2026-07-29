'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Star, Trash2, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import SiteHeader from '@/components/SiteHeader';
import { DELIVERY_TOWNS, distanceFromDepot } from '@/lib/delivery-zone';

type Address = {
  id: string;
  label: string;
  address: string;
  city: string;
  postcode: string;
  zone_id: string | null;
  is_default: boolean;
};

export default function AddressesPage() {
  const t = useTranslations('account');
  const tc = useTranslations('checkout');
  const locale = useLocale();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: '', address: '', zoneId: '', postcode: '' });

  const load = async () => {
    const res = await fetch('/api/addresses');
    const data = await res.json();
    setAddresses(data.addresses ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, locale, isDefault: addresses.length === 0 }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ label: '', address: '', zoneId: '', postcode: '' });
      setShowForm(false);
      load();
    } else {
      toast.error(tc('errorGeneric'));
    }
  }

  async function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    await fetch('/api/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-6 font-display text-2xl font-medium italic text-ink">
          {t('addressesTitle')}
        </h1>

        {loading ? (
          <Loader2 className="animate-spin text-ink/30" size={20} />
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-2xl border border-ink/[0.06] bg-white p-4"
              >
                <MapPin className="mt-0.5 flex-shrink-0 text-ink/30" size={18} />
                <div className="flex-1">
                  <p className="flex items-center gap-1.5 font-medium text-ink">
                    {a.label}
                    {a.is_default && <Star size={13} className="fill-gold text-gold" />}
                  </p>
                  <p className="text-sm text-ink/50">
                    {a.address}, {a.city} {a.postcode}
                  </p>
                  {a.zone_id && (
                    <p className="mt-0.5 text-xs text-ink/35">
                      {tc('distanceFromDepot', { km: distanceFromDepot(a.zone_id) ?? 0 })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  aria-label={t('deleteAddress')}
                  className="text-ink/30 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {addresses.length === 0 && !showForm && (
              <p className="text-sm text-ink/50">{t('noAddresses')}</p>
            )}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3 rounded-2xl border border-ink/[0.06] bg-white p-5">
            <input
              required
              placeholder={t('addressLabel')}
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <input
              required
              placeholder={tc('address')}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            <div className="flex gap-3">
              <select
                required
                value={form.zoneId}
                onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
                className={`w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold ${form.zoneId ? 'text-ink' : 'text-ink/40'}`}
              >
                <option value="" disabled>
                  {tc('city')}
                </option>
                {DELIVERY_TOWNS.map((town) => (
                  <option key={town.id} value={town.id}>
                    {locale === 'es' ? town.name.es : town.name.en}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder={tc('postcode')}
                value={form.postcode}
                onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {t('saveAddress')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/70"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-1.5 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink/[0.03]"
          >
            <Plus size={15} />
            {t('addAddress')}
          </button>
        )}
      </section>
    </main>
  );
}
