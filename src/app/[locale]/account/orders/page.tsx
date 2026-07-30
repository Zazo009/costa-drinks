import { getTranslations, getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import ReorderButton from '@/components/ReorderButton';
import { createUserClient } from '@/lib/supabase-server-user';
import { products, formatPrice } from '@/data/products';

type OrderRow = {
  id: string;
  status: string;
  created_at: string;
  delivery_slot_label: string;
  delivery_address: string;
  delivery_city: string;
  amount_total_cents: number;
  iva_amount_cents: number;
  payment_method: string;
  cod_payment_type: string | null;
  items: { productId: string; quantity: number }[];
};

export default async function OrdersPage() {
  const t = await getTranslations('account');
  const tc = await getTranslations('checkout');
  const locale = await getLocale();
  const supabase = await createUserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'id, status, created_at, delivery_slot_label, delivery_address, delivery_city, amount_total_cents, iva_amount_cents, payment_method, cod_payment_type, items'
    )
    .order('created_at', { ascending: false })
    .returns<OrderRow[]>();

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold text-ink">{t('ordersTitle')}</h1>

        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink/10 py-16 text-center">
            <Package className="text-ink/35" size={24} />
            <p className="text-ink/50">{t('noOrders')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderProducts = order.items
                .map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return product ? { product, quantity: item.quantity } : null;
                })
                .filter((r): r is { product: (typeof products)[number]; quantity: number } => r !== null);

              const date = new Date(order.created_at).toLocaleDateString(
                locale === 'es' ? 'es-ES' : 'en-GB',
                { year: 'numeric', month: 'short', day: 'numeric' }
              );

              return (
                <div key={order.id} className="rounded-xl border border-ink/[0.06] p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-ink/50">{date}</p>
                      <p className="text-xs text-ink/35">
                        {order.delivery_address}, {order.delivery_city}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-50 text-green-700'
                          : order.status === 'paid'
                            ? 'bg-blue-50 text-blue-700'
                            : order.status === 'cancelled'
                              ? 'bg-ink/5 text-ink/50'
                              : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {t(`status_${order.status}`)}
                    </span>
                  </div>

                  <div className="divide-y divide-ink/[0.06] border-y border-ink/[0.06]">
                    {orderProducts.map((r) => (
                      <div key={r.product.id} className="flex justify-between py-2 text-sm">
                        <span>
                          {(locale === 'es' ? r.product.name.es : r.product.name.en)} × {r.quantity}
                        </span>
                        <span>{formatPrice(r.product.priceCents * r.quantity, locale)}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-ink/40">
                    {order.payment_method === 'cod'
                      ? t(order.cod_payment_type === 'card' ? 'paidCardOnDelivery' : 'paidCashOnDelivery')
                      : t('paidOnline')}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-ink">
                        {formatPrice(order.amount_total_cents, locale)}
                      </span>
                      <p className="text-xs text-ink/35">
                        {tc('ivaIncluded', { rate: 21 })}: {formatPrice(order.iva_amount_cents, locale)}
                      </p>
                    </div>
                    <ReorderButton
                      items={order.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
