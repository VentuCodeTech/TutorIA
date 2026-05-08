import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, planName } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://tutoria-eight.vercel.app'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true&plan=${planName}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id || '',
        plan: planName,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}