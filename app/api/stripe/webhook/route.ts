import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10',
})

// Use service role key to bypass RLS - webhook runs server-side without user session
function createAdminClient() {
      return createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
            )
}

// Build PRICE_TO_PLAN from environment variables to stay in sync with checkout route
// Falls back to hardcoded IDs only as a safety net
const PRICE_TO_PLAN: Record<string, string> = {}

function buildPriceToPlan() {
      const standardId = process.env.STRIPE_PRICE_STANDARD_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD
      const studentId = process.env.STRIPE_PRICE_STUDENT_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDENT
      const advancedId = process.env.STRIPE_PRICE_ADVANCED_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED_PRO

  if (standardId) PRICE_TO_PLAN[standardId] = 'standard'
      if (studentId) PRICE_TO_PLAN[studentId] = 'student'
      if (advancedId) PRICE_TO_PLAN[advancedId] = 'advanced_pro'
}

buildPriceToPlan()

export async function POST(request: NextRequest) {
      const body = await request.text()
      const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
      try {
              event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
      } catch (err) {
              console.error('Stripe webhook signature error:', err)
              return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }

  const supabase = createAdminClient()

  switch (event.type) {
      case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const userId = session.metadata?.user_id || session.metadata?.userId
                const planName = session.metadata?.plan || session.metadata?.planId || ''

                if (userId && session.subscription) {
                            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
                            const priceId = subscription.items.data[0]?.price.id
                            const resolvedPlan = planName || PRICE_TO_PLAN[priceId] || 'standard'

                  const { error } = await supabase.from('subscriptions').upsert({
                                user_id: userId,
                                stripe_customer_id: session.customer as string,
                                stripe_subscription_id: session.subscription as string,
                                stripe_price_id: priceId,
                                plan: resolvedPlan,
                                status: subscription.status,
                                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                                updated_at: new Date().toISOString(),
                  }, { onConflict: 'user_id' })

                  if (error) {
                                console.error('Error upserting subscription (checkout.session.completed):', error)
                  }

                  // Also update the profiles table with the plan and customer ID
                  const { error: profileError } = await supabase.from('profiles').update({
                                plan: resolvedPlan,
                                stripe_customer_id: session.customer as string,
                  }).eq('id', userId)

                  if (profileError) {
                                console.error('Error updating profile (checkout.session.completed):', profileError)
                  }
                }
                break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                const priceId = subscription.items.data[0]?.price.id
                const plan = PRICE_TO_PLAN[priceId] || undefined

                const updateData: Record<string, string | undefined> = {
                            status: subscription.status,
                            stripe_price_id: priceId,
                            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                            updated_at: new Date().toISOString(),
                }

                if (event.type === 'customer.subscription.deleted') {
                            updateData.plan = 'gratuito'
                            updateData.stripe_subscription_id = undefined
                            updateData.stripe_customer_id = undefined
                } else if (plan) {
                            updateData.plan = plan
                }

                const { error } = await supabase.from('subscriptions').update(updateData).eq('stripe_subscription_id', subscription.id)
                if (error) {
                            console.error('Error updating subscription:', error)
                }
                break
      }

      case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                if (invoice.subscription) {
                            const { error } = await supabase.from('subscriptions').update({
                                          status: 'past_due',
                                          updated_at: new Date().toISOString(),
                            }).eq('stripe_subscription_id', invoice.subscription as string)

                  if (error) {
                                console.error('Error updating subscription to past_due:', error)
                  }
                }
                break
      }
  }

  return NextResponse.json({ received: true })
}
