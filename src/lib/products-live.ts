import { products as staticProducts, type Product } from '@/data/products';
import { createServiceClient } from './supabase-server';

export const DEFAULT_STOCK = 10;

export type LiveProduct = Product & { stock: number };

type Override = {
  product_id: string;
  price_cents: number | null;
  stock: number | null;
  enabled: boolean;
};

/**
 * Merges admin edits (price/stock/enabled) from the DB on top of the static
 * catalog. Disabled products are dropped entirely. Stock defaults to
 * DEFAULT_STOCK until an order or an admin edit creates a row.
 */
export async function getLiveProducts(): Promise<LiveProduct[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('product_overrides')
    .select('product_id, price_cents, stock, enabled')
    .returns<Override[]>();

  const overrides = new Map((data ?? []).map((o) => [o.product_id, o]));

  return staticProducts
    .filter((p) => overrides.get(p.id)?.enabled !== false)
    .map((p) => {
      const override = overrides.get(p.id);
      return {
        ...p,
        priceCents: override?.price_cents ?? p.priceCents,
        stock: override?.stock ?? DEFAULT_STOCK,
      };
    });
}

export async function getLiveProduct(id: string): Promise<LiveProduct | undefined> {
  const products = await getLiveProducts();
  return products.find((p) => p.id === id);
}

export async function decrementStock(productId: string, quantity: number): Promise<void> {
  const supabase = createServiceClient();
  await supabase.rpc('decrement_product_stock', {
    p_product_id: productId,
    p_qty: quantity,
    p_default: DEFAULT_STOCK,
  });
}
