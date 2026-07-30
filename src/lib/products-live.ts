import { products as staticProducts, type Product } from '@/data/products';
import { createServiceClient } from './supabase-server';

type Override = {
  product_id: string;
  price_cents: number | null;
  enabled: boolean;
};

/**
 * Merges admin edits (price/enabled) from the DB on top of the static
 * catalog. Disabled products are dropped entirely.
 */
export async function getLiveProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('product_overrides')
    .select('product_id, price_cents, enabled')
    .returns<Override[]>();

  const overrides = new Map((data ?? []).map((o) => [o.product_id, o]));

  return staticProducts
    .filter((p) => overrides.get(p.id)?.enabled !== false)
    .map((p) => {
      const override = overrides.get(p.id);
      return override?.price_cents != null ? { ...p, priceCents: override.price_cents } : p;
    });
}

export async function getLiveProduct(id: string): Promise<Product | undefined> {
  const products = await getLiveProducts();
  return products.find((p) => p.id === id);
}
