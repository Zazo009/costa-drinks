import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import AdminStatusSelect from '@/components/AdminStatusSelect';
import { createUserClient } from '@/lib/supabase-server-user';
import { createServiceClient } from '@/lib/supabase-server';
import { isAdminEmail } from '@/lib/admin';
import { products, formatPrice } from '@/data/products';

type OrderRow = {
  id: string;
  status: string;
  payment_method: string;
  cod_payment_type: string | null;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postcode: string;
  delivery_slot_label: string;
  amount_total_cents: number;
  items: { productId: string; quantity: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  paid: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-ink/5 text-ink/50',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const userClient = await createUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    redirect('/');
  }

  const admin = createServiceClient();
  let query = admin
    .from('orders')
    .select(
      'id, status, payment_method, cod_payment_type, created_at, customer_name, customer_email, customer_phone, delivery_address, delivery_city, delivery_postcode, delivery_slot_label, amount_total_cents, items'
    )
    .order('created_at', { ascending: false })
    .limit(100);

  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  const { data: orders } = await query.returns<OrderRow[]>();

  const filters = ['all', 'pending', 'paid', 'delivered', 'cancelled'];

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-cream/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/admin" className="font-display text-lg italic text-ink">
            Costa Drinks Admin
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-ink/60">
            <span className="text-ink">Orders</span>
            <Link href="/admin/products" className="hover:text-ink">
              Products
            </Link>
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 font-display text-2xl font-medium italic text-ink">Orders</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <a
              key={f}
              href={f === 'all' ? '/admin' : `/admin?status=${f}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                (searchParams.status ?? 'all') === f
                  ? 'bg-ink text-white'
                  : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
              }`}
            >
              {f}
            </a>
          ))}
        </div>

        {!orders || orders.length === 0 ? (
          <p className="text-ink/50">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderProducts = order.items
                .map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return product ? { product, quantity: item.quantity } : null;
                })
                .filter((r): r is { product: (typeof products)[number]; quantity: number } => r !== null);

              const date = new Date(order.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={order.id} className="rounded-2xl border border-ink/[0.06] bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{order.customer_name}</p>
                      <p className="text-xs text-ink/40">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-ink/5 text-ink/50'}`}
                      >
                        {order.status}
                      </span>
                      <AdminStatusSelect orderId={order.id} status={order.status} />
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-1.5 text-sm text-ink/70 sm:grid-cols-2">
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} className="text-ink/30" /> {order.customer_email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} className="text-ink/30" /> {order.customer_phone}
                    </span>
                    <span className="flex items-center gap-1.5 sm:col-span-2">
                      <MapPin size={13} className="text-ink/30" />
                      {order.delivery_address}, {order.delivery_city} {order.delivery_postcode}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-ink/30" /> {order.delivery_slot_label}
                    </span>
                    <span className="text-ink/50">
                      {order.payment_method === 'cod'
                        ? `Cash on delivery (${order.cod_payment_type ?? '?'})`
                        : 'Paid online'}
                    </span>
                  </div>

                  <div className="divide-y divide-ink/[0.06] border-y border-ink/[0.06]">
                    {orderProducts.map((r) => (
                      <div key={r.product.id} className="flex justify-between py-1.5 text-sm">
                        <span>
                          {r.product.name.en} × {r.quantity}
                        </span>
                        <span>{formatPrice(r.product.priceCents * r.quantity, 'en')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 text-right font-semibold text-ink">
                    {formatPrice(order.amount_total_cents, 'en')}
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
