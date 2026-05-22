# Tirei10 🎓

**Plataforma de estudo com IA adaptativa para ENEM, OAB, concursos públicos e CPA-20**

Desenvolvido com Next.js 14, Supabase, Claude AI e Stripe.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Next.js API Routes |
| Banco de dados | Supabase (PostgreSQL + RLS) |
| Autenticação | Supabase Auth (Google, Email, Telefone) |
| IA | Anthropic Claude (Sonnet) |
| Pagamentos | Stripe |
| Deploy | Vercel + Supabase Cloud |

---

## Funcionalidades

- ✅ Questões adaptativas com dificuldade progressiva
- - ✅ Explicações geradas por IA no nível do aluno
  - - ✅ Simulados cronometrados com análise pós-prova
    - - ✅ Planejamento de estudos com calendário integrado
      - - ✅ Comunidade (fórum) por nicho de prova
        - - ✅ Assistente IA 24/7 (Premium)
          - - ✅ Login com Google, e-mail/senha e telefone/senha
            - - ✅ 4 planos: Gratuito, Básico, Intermediário e Premium
             
              - ---

              ## Configuração local

              ### 1. Clonar o repositório

              ```bash
              git clone https://github.com/VentuCodeTech/Tirei10.git
              cd Tirei10
              npm install
              ```

              ### 2. Criar o projeto no Supabase

              1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
              2. 2. No SQL Editor, execute o arquivo `supabase/migrations/001_initial.sql`
                 3. 3. Em Authentication > Providers, habilite:
                    4.    - Email (ativo por padrão)
                          -    - Google OAuth (precisa de Client ID e Secret)
                               -    - Phone (precisa de provedor SMS — ex: Twilio)
                                    - 4. Em Authentication > URL Configuration, adicione:
                                      5.    - Site URL: `http://localhost:3000`
                                            -    - Redirect URLs: `http://localhost:3000/api/auth/callback`
                                             
                                                 - ### 3. Criar produtos no Stripe
                                             
                                                 - 1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
                                                   2. 2. Crie 3 produtos com os planos mensais e anuais:
                                                      3.    - **Básico**: R$19,90/mês | R$190,80/ano (20% off)
                                                            -    - **Intermediário**: R$49,90/mês | R$479,04/ano
                                                                 -    - **Premium**: R$99,90/mês | R$958,08/ano
                                                                      - 3. Copie os Price IDs de cada produto
                                                                       
                                                                        4. ### 4. Configurar variáveis de ambiente
                                                                       
                                                                        5. ```bash
                                                                           cp .env.example .env.local
                                                                           ```

                                                                           Preencha `.env.local` com suas chaves:

                                                                           ```env
                                                                           NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
                                                                           NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
                                                                           SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
                                                                           ANTHROPIC_API_KEY=sk-ant-...
                                                                           NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
                                                                           STRIPE_SECRET_KEY=sk_test_...
                                                                           STRIPE_WEBHOOK_SECRET=whsec_...
                                                                           STRIPE_PRICE_BASICO_MONTHLY=price_...
                                                                           STRIPE_PRICE_INTERMEDIARIO_MONTHLY=price_...
                                                                           STRIPE_PRICE_PREMIUM_MONTHLY=price_...
                                                                           NEXT_PUBLIC_APP_URL=http://localhost:3000
                                                                           ```

                                                                           ### 5. Configurar webhook do Stripe (local)

                                                                           ```bash
                                                                           # Instale o Stripe CLI
                                                                           stripe listen --forward-to localhost:3000/api/stripe/webhook
                                                                           ```

                                                                           Copie o webhook signing secret para `STRIPE_WEBHOOK_SECRET`.

                                                                           ### 6. Rodar o projeto

                                                                           ```bash
                                                                           npm run dev
                                                                           ```

                                                                           Acesse [http://localhost:3000](http://localhost:3000)

                                                                           ---

                                                                           ## Deploy em Produção

                                                                           ### Deploy no Vercel

                                                                           ```bash
                                                                           npm install -g vercel
                                                                           vercel login
                                                                           vercel --prod
                                                                           ```

                                                                           Ou conecte o repositório GitHub diretamente no [vercel.com](https://vercel.com).

                                                                           Configure as variáveis de ambiente no painel do Vercel (Settings > Environment Variables).

                                                                           ### Configurar webhook Stripe em produção

                                                                           1. No Stripe Dashboard > Webhooks, adicione:
                                                                           2.    - URL: `https://seu-dominio.com/api/stripe/webhook`
                                                                                 -    - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
                                                                                      - 2. Copie o signing secret para a variável `STRIPE_WEBHOOK_SECRET` no Vercel
                                                                                       
                                                                                        3. ### Configurar OAuth do Google para produção
                                                                                       
                                                                                        4. 1. No Google Cloud Console, adicione o domínio de produção como redirect URI:
                                                                                           2.    `https://SEU-PROJETO.supabase.co/auth/v1/callback`
                                                                                           3.2. No Supabase Authentication > URL Configuration, adicione:
                                                                                                - Site URL: `https://seu-dominio.com`
                                                                                                - Redirect URLs: `https://seu-dominio.com/api/auth/callback`

                                                                                             ---

                                                                                           ## Planos e limites

                                                                                           | Feature | Gratuito | Básico R$19,90 | Intermediário R$49,90 | Premium R$99,90 |
                                                                                           |---------|----------|-----------------|----------------------|-----------------|
                                                                                           | Questões/dia | 20 | Ilimitadas | Ilimitadas | Ilimitadas |
                                                                                           | Explicações IA/dia | 10 | Ilimitadas | Ilimitadas | Ilimitadas |
                                                                                           | Simulados | ❌ | ✅ | ✅ | ✅ |
                                                                                           | Planejamento | ❌ | ❌ | ✅ | ✅ |
                                                                                           | Comunidade | ❌ | ❌ | ✅ | ✅ |
                                                                                           | Assistente IA | ❌ | ❌ | ❌ | ✅ |

                                                                                           ---

                                                                                           ## Licença

                                                                                           MIT — Desenvolvido por VentuCodeTech
