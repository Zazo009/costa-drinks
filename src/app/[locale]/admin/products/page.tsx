'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2, Search } from 'lucide-react';

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  basePriceCents: number;
  priceCents: number;
  enabled: boolean;
  hasOverride: boolean;
};

const CATEGORIES = ['all', 'wine', 'beer', 'cava', 'spirits', 'aperitivo', 'mixer'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'all' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  async function saveProduct(id: string, priceCents: number, enabled: boolean) {
    setSavingId(id);
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceCents, enabled }),
    });
    setSavingId(null);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  function updateLocal(id: string, patch: Partial<AdminProduct>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-cream/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/admin" className="font-display text-lg italic text-ink">
            Costa Drinks Admin
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-ink/60">
            <Link href="/admin" className="hover:text-ink">
              Orders
            </Link>
            <span className="text-ink">Products</span>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 font-display text-2xl font-medium italic text-ink">Products</h1>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-ink/10 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                  category === c ? 'bg-ink text-white' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader2 className="animate-spin text-ink/30" size={20} />
        ) : (
          <>
            <p className="mb-3 text-xs text-ink/40">{filtered.length} products</p>
            <div className="divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.06] bg-white">
              {filtered.slice(0, 200).map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs capitalize text-ink/40">{p.category}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-ink/40">€</span>
                    <input
                      type="number"
                      step="0.01"
                      value={(p.priceCents / 100).toFixed(2)}
                      onChange={(e) =>
                        updateLocal(p.id, {
                          priceCents: Math.round(parseFloat(e.target.value || '0') * 100),
                        })
                      }
                      onBlur={() => saveProduct(p.id, p.priceCents, p.enabled)}
                      className="w-20 rounded-lg border border-ink/10 px-2 py-1 text-sm outline-none focus:border-gold"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-ink/50">
                    <input
                      type="checkbox"
                      checked={p.enabled}
                      onChange={(e) => {
                        updateLocal(p.id, { enabled: e.target.checked });
                        saveProduct(p.id, p.priceCents, e.target.checked);
                      }}
                    />
                    Enabled
                  </label>

                  <div className="w-5">
                    {savingId === p.id && <Loader2 size={14} className="animate-spin text-ink/30" />}
                    {savedId === p.id && <Check size={14} className="text-green-600" />}
                  </div>
                </div>
              ))}
            </div>
            {filtered.length > 200 && (
              <p className="mt-3 text-xs text-ink/40">
                Showing first 200 of {filtered.length} — narrow your search to see more.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
