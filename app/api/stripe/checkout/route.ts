import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { priceId, planName } = await request.json()
    if (!priceId) return NextResponse.json({ error: 'Price ID required' }, { status: 400 })

    const { data: sub } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).single()
    let customerId = sub?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } })
      customerId = customer.id
      await supabase.from('subscriptions').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tutoria.vercel.app'
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: appUrl + '/dashboard?success=true',
      cancel_url: appUrl + '/pricing?canceled=true',
      metadata: { user_id: user.id, plan: planName },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
