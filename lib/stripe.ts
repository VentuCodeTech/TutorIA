import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PLANS = {
  standard: {
    name: 'Standard',
    priceId: process.env.STRIPE_PRICE_STANDARD_MONTHLY!,
    price: 19.9,
    features: ['Questoes ilimitadas', 'Simulados', 'Historico de desempenho'],
  },
  student: {
    name: 'Student',
    priceId: process.env.STRIPE_PRICE_STUDENT_MONTHLY!,
    price: 49.9,
    features: ['Tudo do Standard', 'Planejamento de estudos', 'Comunidade', 'Suporte prioritario'],
  },
  advanced: {
    name: 'Advanced Pro',
    priceId: process.env.STRIPE_PRICE_ADVANCED_MONTHLY!,
    price: 99.9,
    features: ['Tudo do Student', 'Assistente IA 24/7', 'Explicacoes ilimitadas por IA', 'Acesso antecipado'],
  },
}
