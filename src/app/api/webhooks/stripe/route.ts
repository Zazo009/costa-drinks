import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase-server';
import { sendOrderEmails } from '@/lib/email';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const signature = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createServiceClient();
    const { data: order } = await supabase
      .from('orders')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id)
      .select(
        'id, locale, customer_name, customer_email, customer_phone, delivery_address, delivery_city, delivery_postcode, delivery_slot_label, payment_method, items, amount_total_cents'
      )
      .single();

    if (order) {
      await sendOrderEmails({
        id: order.id,
        locale: order.locale,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        deliveryAddress: order.delivery_address,
        deliveryCity: order.delivery_city,
        deliveryPostcode: order.delivery_postcode,
        deliverySlotLabel: order.delivery_slot_label,
        paymentMethod: order.payment_method,
        items: order.items,
        amountTotalCents: order.amount_total_cents,
      });
    }
  }

  return NextResponse.json({ received: true });
}
