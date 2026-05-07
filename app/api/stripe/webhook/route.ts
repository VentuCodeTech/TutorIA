import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const planMap: Record<string, string> = {
    standard: 'basico',
    student: 'intermediario',
    advanced: 'premium',
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan || 'standard'
      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        await supabase.from('subscriptions').update({
          stripe_subscription_id: session.subscription as string,
          plan: planMap[plan] || 'basico',
          status: 'active',
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('user_id', userId)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id
      if (userId) {
        await supabase.from('subscriptions').update({
          status: sub.status as any,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('user_id', userId)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id
      if (userId) {
        await supabase.from('subscriptions').update({
          plan: 'gratuito',
          status: 'canceled',
          stripe_subscription_id: null,
        }).eq('user_id', userId)
      }
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription) {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
        const userId = sub.metadata?.user_id
        if (userId) {
          await supabase.from('subscriptions').update({ status: 'past_due' }).eq('user_id', userId)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
