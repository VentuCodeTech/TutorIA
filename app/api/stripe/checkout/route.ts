import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

// Use environment variables for Price IDs (avoids hardcoded mismatches)
const PLAN_TO_PRICE: Record<string, string> = {
  standard: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || process.env.STRIPE_PRICE_STANDARD_MONTHLY || '',
  student: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDENT || process.env.STRIPE_PRICE_STUDENT_MONTHLY || '',
  advanced_pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED_PRO || process.env.STRIPE_PRICE_ADVANCED_MONTHLY || '',
};

// Also accept direct price IDs sent by the pricing page
const VALID_PRICE_IDS = new Set(Object.values(PLAN_TO_PRICE).filter(Boolean));

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
      console.error('Invalid plan or missing price ID:', { planId: body.planId, priceId: body.priceId });
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://www.tirei10.com.br';
    const planLabel = (body.planId || body.planName || '') as string;
    const successPath = '/dashboard/planos?success=true&plan=' + planLabel;
    const successUrl = origin + '/auth/callback?next=' + encodeURIComponent(successPath);
    const cancelUrl = origin + '/pricing?canceled=true';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id ?? '',
        plan: planLabel,
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
