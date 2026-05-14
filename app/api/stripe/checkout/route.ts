import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

const PRICE_IDS: Record<string, string> = {
  standard:     'price_1TUZ11FPyDxwG3POShBnmqB0',
  student:      'price_1TUZ1rFPyDxwG3POwi0qzpJb',
  advanced_pro: 'price_1TUZ2GFPyDxwG3PORJBla5oC',
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { planId } = await req.json();
    const priceId = PRICE_IDS[planId];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://tutoria-eight.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/planos?success=true&plan=${planId}`,
      cancel_url:  `${origin}/dashboard/planos?canceled=true`,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id || '',
        plan: planId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
