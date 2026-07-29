import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { products } from '@/data/products';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';
import { isSlotStillValid } from '@/lib/delivery-slots';
import { createServiceClient } from '@/lib/supabase-server';

const checkoutSchema = z.object({
  locale: z.enum(['en', 'es']),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().max(24),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
  }),
  delivery: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    postcode: z.string().min(1),
    slotId: z.string(),
    slotLabel: z.string(),
  }),
  ageConfirmed: z.literal(true),
});

export async function POST(req: NextRequest) {
  // Server-side legal gate — the same check the UI uses, but this is the
  // one that actually matters since the client can't be trusted.
  // Andalucía Ley 4/1997, Art. 26.1.d): no distance alcohol sales 22:00-08:00.
  if (!isAlcoholSaleWindowOpen()) {
    return NextResponse.json(
      { error: 'sale_window_closed' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { locale, items, customer, delivery, ageConfirmed } = parsed.data;

  if (!isSlotStillValid(delivery.slotId)) {
    return NextResponse.json({ error: 'slot_no_longer_available' }, { status: 409 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let amountTotalCents = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: 'invalid_product' }, { status: 400 });
    }
    amountTotalCents += product.priceCents * item.quantity;
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: product.priceCents,
        product_data: {
          name: locale === 'es' ? product.name.es : product.name.en,
        },
      },
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    customer_email: customer.email,
    success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/checkout/cancel`,
    metadata: {
      locale,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: delivery.address,
      deliveryCity: delivery.city,
      deliveryPostcode: delivery.postcode,
      deliverySlotId: delivery.slotId,
      deliverySlotLabel: delivery.slotLabel,
      ageConfirmed: String(ageConfirmed),
      items: JSON.stringify(items),
    },
  });

  const supabase = createServiceClient();
  await supabase.from('orders').insert({
    stripe_session_id: session.id,
    status: 'pending',
    locale,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    delivery_address: delivery.address,
    delivery_city: delivery.city,
    delivery_postcode: delivery.postcode,
    delivery_slot_id: delivery.slotId,
    delivery_slot_label: delivery.slotLabel,
    age_confirmed: ageConfirmed,
    items,
    amount_total_cents: amountTotalCents,
  });

  return NextResponse.json({ url: session.url });
}
