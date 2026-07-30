import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { getLiveProducts } from '@/lib/products-live';
import { isAlcoholSaleWindowOpen } from '@/lib/sale-window';
import { isSlotStillValid } from '@/lib/delivery-slots';
import { getTown } from '@/lib/delivery-zone';
import { computeDeliveryFeeCents } from '@/lib/delivery-fee';
import { COD_MAX_AMOUNT_CENTS } from '@/lib/order-limits';
import { ivaFromGrossCents } from '@/lib/vat';
import { createServiceClient } from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-server-user';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

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
    zoneId: z.string().min(1),
    postcode: z.string().min(1),
    slotId: z.string(),
    slotLabel: z.string(),
  }),
  ageConfirmed: z.literal(true),
  paymentMethod: z.enum(['online', 'cod']),
  codPaymentType: z.enum(['cash', 'card']).optional(),
})
  .refine((data) => data.paymentMethod !== 'cod' || !!data.codPaymentType, {
    message: 'cod_payment_type_required',
    path: ['codPaymentType'],
  });

export async function POST(req: NextRequest) {
  if (isRateLimited(`checkout:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

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

  const { locale, items, customer, delivery, ageConfirmed, paymentMethod, codPaymentType } = parsed.data;

  if (!isSlotStillValid(delivery.slotId)) {
    return NextResponse.json({ error: 'slot_no_longer_available' }, { status: 409 });
  }

  const town = getTown(delivery.zoneId);
  if (!town) {
    return NextResponse.json({ error: 'out_of_zone' }, { status: 400 });
  }
  const cityName = town.name[locale];
  const distanceKm = Math.abs(town.offsetKm);

  const products = await getLiveProducts();

  let subtotalCents = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: 'invalid_product' }, { status: 400 });
    }
    subtotalCents += product.priceCents * item.quantity;
  }

  const deliveryFeeCents = computeDeliveryFeeCents(delivery.zoneId, subtotalCents);
  if (deliveryFeeCents === null) {
    return NextResponse.json({ error: 'out_of_zone' }, { status: 400 });
  }
  const amountTotalCents = subtotalCents + deliveryFeeCents;
  const ivaAmountCents = ivaFromGrossCents(amountTotalCents);

  if (paymentMethod === 'cod' && amountTotalCents > COD_MAX_AMOUNT_CENTS) {
    return NextResponse.json({ error: 'cod_limit_exceeded' }, { status: 400 });
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL!;

  const userClient = await createUserClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  const supabase = createServiceClient();

  if (paymentMethod === 'cod') {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id ?? null,
        stripe_session_id: null,
        payment_method: 'cod',
        cod_payment_type: codPaymentType,
        status: 'pending',
        locale,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        delivery_address: delivery.address,
        delivery_city: cityName,
        delivery_postcode: delivery.postcode,
        delivery_zone_id: delivery.zoneId,
        delivery_distance_km: distanceKm,
        delivery_fee_cents: deliveryFeeCents,
        iva_amount_cents: ivaAmountCents,
        delivery_slot_id: delivery.slotId,
        delivery_slot_label: delivery.slotLabel,
        age_confirmed: ageConfirmed,
        items,
        amount_total_cents: amountTotalCents,
      })
      .select('id')
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'order_failed' }, { status: 500 });
    }

    return NextResponse.json({
      url: `${origin}/${locale}/checkout/success?order_id=${order.id}`,
    });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: product.priceCents,
        product_data: {
          name: locale === 'es' ? product.name.es : product.name.en,
        },
      },
    };
  });

  if (deliveryFeeCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: deliveryFeeCents,
        product_data: {
          name: locale === 'es' ? 'Gastos de envío' : 'Delivery fee',
        },
      },
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      deliveryCity: cityName,
      deliveryPostcode: delivery.postcode,
      deliverySlotId: delivery.slotId,
      deliverySlotLabel: delivery.slotLabel,
      ageConfirmed: String(ageConfirmed),
      items: JSON.stringify(items),
    },
  });

  await supabase.from('orders').insert({
    user_id: user?.id ?? null,
    stripe_session_id: session.id,
    payment_method: 'online',
    status: 'pending',
    locale,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    delivery_address: delivery.address,
    delivery_city: cityName,
    delivery_postcode: delivery.postcode,
    delivery_zone_id: delivery.zoneId,
    delivery_distance_km: distanceKm,
    delivery_fee_cents: deliveryFeeCents,
    iva_amount_cents: ivaAmountCents,
    delivery_slot_id: delivery.slotId,
    delivery_slot_label: delivery.slotLabel,
    age_confirmed: ageConfirmed,
    items,
    amount_total_cents: amountTotalCents,
  });

  return NextResponse.json({ url: session.url });
}
