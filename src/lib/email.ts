import { Resend } from 'resend';
import { products } from '@/data/products';
import { formatPrice } from '@/data/products';

const FROM_ADDRESS = 'Costa Drinks <orders@costa-drinks.com>';
const OPS_EMAIL = 'order@costa-drinks.com';

type OrderEmailData = {
  id: string;
  locale: 'en' | 'es' | 'fr' | 'de' | 'ar';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostcode: string;
  deliverySlotLabel: string;
  paymentMethod: string;
  codPaymentType?: string | null;
  items: { productId: string; quantity: number }[];
  amountTotalCents: number;
};

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function renderItemRows(items: OrderEmailData['items'], locale: string) {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return '';
      const name = locale === 'es' ? product.name.es : product.name.en;
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${name} × ${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice(product.priceCents * item.quantity, locale)}</td>
      </tr>`;
    })
    .join('');
}

const CUSTOMER_COPY: Record<string, { subject: string; title: string; body: string; total: string; footer: string }> = {
  es: {
    subject: 'Tu pedido en Costa Drinks está confirmado',
    title: 'Pedido confirmado',
    body: 'Gracias por tu pedido. Aquí tienes el resumen:',
    total: 'Total',
    footer: 'Ten a mano tu identificación válida para la entrega.',
  },
  en: {
    subject: 'Your Costa Drinks order is confirmed',
    title: 'Order confirmed',
    body: "Thanks for your order. Here's your summary:",
    total: 'Total',
    footer: 'Please have valid photo ID ready for delivery.',
  },
};

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const resend = resendClient();
  if (!resend) return;

  const copy = CUSTOMER_COPY[order.locale] ?? CUSTOMER_COPY.en;
  const rows = renderItemRows(order.items, order.locale);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: order.customerEmail,
    subject: copy.subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#14100d;">
        <h1 style="font-size:20px;">${copy.title}</h1>
        <p>${copy.body}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows}
          <tr>
            <td style="padding:12px 0 0;font-weight:bold;">${copy.total}</td>
            <td style="padding:12px 0 0;font-weight:bold;text-align:right;">${formatPrice(order.amountTotalCents, order.locale)}</td>
          </tr>
        </table>
        <p style="margin-top:20px;font-size:13px;color:#666;">
          ${order.deliveryAddress}, ${order.deliveryCity} ${order.deliveryPostcode}<br/>
          ${order.deliverySlotLabel}
        </p>
        <p style="margin-top:16px;font-size:13px;color:#666;">${copy.footer}</p>
      </div>
    `,
  });
}

export async function sendOrderNotificationEmail(order: OrderEmailData) {
  const resend = resendClient();
  if (!resend) return;

  const rows = renderItemRows(order.items, 'en');
  const paymentLabel =
    order.paymentMethod === 'cod'
      ? `Cash on delivery (${order.codPaymentType ?? 'unknown'})`
      : 'Paid online';

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: OPS_EMAIL,
    subject: `New order — ${order.customerName} — ${order.deliveryCity}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#14100d;">
        <h1 style="font-size:20px;">New order</h1>
        <p style="font-size:14px;">
          <strong>${order.customerName}</strong><br/>
          ${order.customerPhone} · ${order.customerEmail}<br/>
          ${order.deliveryAddress}, ${order.deliveryCity} ${order.deliveryPostcode}<br/>
          <strong>${order.deliverySlotLabel}</strong><br/>
          Payment: ${paymentLabel}
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows}
          <tr>
            <td style="padding:12px 0 0;font-weight:bold;">Total</td>
            <td style="padding:12px 0 0;font-weight:bold;text-align:right;">${formatPrice(order.amountTotalCents, 'en')}</td>
          </tr>
        </table>
        <p style="margin-top:16px;font-size:12px;color:#999;">Order ID: ${order.id}</p>
      </div>
    `,
  });
}

export async function sendOrderEmails(order: OrderEmailData) {
  await Promise.allSettled([sendOrderConfirmationEmail(order), sendOrderNotificationEmail(order)]);
}
