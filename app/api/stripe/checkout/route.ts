import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

const PLAN_TO_PRICE: Record<string, string> = {
  standard:     'price_1TUZ11FPyDxwG3POShBnmqB0',
  student:      'price_1TUZ1rFPyDxwG3POwi0qzpJb',
  advanced_pro: 'price_1TUZ2GFPyDxwG3PORJBla5oC',
};

// Also accept direct price IDs sent by the pricing page
const VALID_PRICE_IDS = new Set(Object.values(PLAN_TO_PRICE));

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();

    // Support both { planId } (dashboard) and { priceId } (pricing page)
    let priceId: string | undefined;
    if (body.planId) {
      priceId = PLAN_TO_PRICE[body.planId as string];
    } else if (body.priceId) {
      // Validate it's one of our known price IDs
      priceId = VALID_PRICE_IDS.has(body.priceId) ? body.priceId : undefined;
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://Tirei10-eight.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/planos?success=true&plan=${body.planId || body.planName || ''}`,
      cancel_url:  `${origin}/pricing?canceled=true`,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id || '',
        plan: body.planId || body.planName || '',
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
