import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meios de Pagamento',
  description: 'Pagamentos seguros via Stripe. Aceitamos cartão de crédito e débito. Assine um plano Tirei10 e prepare-se para ENEM, OAB e Concursos Públicos.',
  alternates: {
    canonical: 'https://www.tirei10.com.br/pagamentos',
  },
  openGraph: {
    title: 'Meios de Pagamento',
    description: 'Saiba como funciona o pagamento no Tirei10. Stripe, cartões aceitos, política de reembolso e garantia de 7 dias.',
    url: 'https://www.tirei10.com.br/pagamentos',
  },
};

export default function PagamentosPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #faf5ff 50%, #f3e8ff 100%)' }}>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b" style={{ borderColor: '#e9d5ff', boxShadow: '0 1px 12px rgba(109,40,217,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/tirei10-header-logo.png" alt="Tirei10" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-medium transition-colors text-sm" style={{ color: '#6b7280' }}>Login</Link>
            <Link href="/login" className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}>Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#1e1b4b' }}>Meios de Pagamento</h1>
            <p className="text-xl" style={{ color: '#6b7280' }}>Pagamentos seguros e práticos para a sua assinatura Tirei10</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md mb-8" style={{ border: '1px solid #ede9fe' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e1b4b' }}>🔒 Segurança em Primeiro Lugar</h2>
            <p className="leading-relaxed mb-4" style={{ color: '#6b7280' }}>
              Todos os pagamentos no Tirei10 são processados pela <strong>Stripe</strong>, uma das plataformas de pagamento
              mais seguras e confiáveis do mundo, utilizada por empresas como Amazon, Google e Shopify.
            </p>
            <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold" style={{ color: '#166534' }}>Seus dados estão protegidos</p>
                <p className="text-sm" style={{ color: '#15803d' }}>Criptografia SSL de 256 bits em todas as transações. Somos certificados PCI DSS nível 1.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md mb-8" style={{ border: '1px solid #ede9fe' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e1b4b' }}>💳 Formas de Pagamento Aceitas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-xl p-5" style={{ borderColor: '#e9d5ff' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💳</span>
                  <h3 className="text-lg font-bold" style={{ color: '#1e1b4b' }}>Cartão de Crédito</h3>
                </div>
                <p className="text-sm mb-3" style={{ color: '#6b7280' }}>Aceitamos as principais bandeiras:</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'American Express', 'Elo', 'Hipercard'].map((brand) => (
                    <span key={brand} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: '#f5f3ff', color: '#6d28d9' }}>{brand}</span>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>Parcelamento disponível conforme o plano escolhido</p>
              </div>
              <div className="border rounded-xl p-5" style={{ borderColor: '#e9d5ff' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💳</span>
                  <h3 className="text-lg font-bold" style={{ color: '#1e1b4b' }}>Cartão de Débito</h3>
                </div>
                <p className="text-sm mb-3" style={{ color: '#6b7280' }}>Pagamento à vista com débito em conta:</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa Débito', 'Mastercard Débito'].map((brand) => (
                    <span key={brand} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: '#f5f3ff', color: '#6d28d9' }}>{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md mb-8" style={{ border: '1px solid #ede9fe' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e1b4b' }}>📋 Informações sobre Assinaturas</h2>
            <div className="space-y-4">
              {[
                { title: 'Cobrança Mensal Automática', desc: 'As assinaturas são cobradas mensalmente na mesma data em que você se cadastrou. Você receberá um e-mail de confirmação a cada renovação.' },
                { title: 'Cancelamento a Qualquer Momento', desc: 'Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas. O acesso premium permanece ativo até o final do período já pago.' },
                { title: 'Comprovantes de Pagamento', desc: 'Para serviços digitais, você receberá automaticamente o comprovante de pagamento por e-mail. Notas fiscais estão disponíveis mediante solicitação.' },
                { title: 'Política de Reembolso', desc: 'Oferecemos reembolso total nos primeiros 7 dias após a contratação, caso não esteja satisfeito com o serviço. Para solicitá-lo, entre em contato com nosso suporte.' },
              ].map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <span className="font-bold text-lg" style={{ color: '#6d28d9' }}>•</span>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#1e1b4b' }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md mb-8" style={{ border: '1px solid #ede9fe' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>💰 Nossos Planos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Gratuito', price: 'R$ 0/mês', features: ['20 questões/dia', 'Matérias básicas', 'Dashboard básico', 'Comunidade'], bg: '#f5f3ff', color: '#6d28d9' },
                { name: 'Standard', price: 'R$ 19,90/mês', features: ['Questões ilimitadas', 'Todas as matérias', 'Simulados', 'IA (50 msgs/dia)'], bg: '#eff6ff', color: '#1d4ed8' },
                { name: 'Student', price: 'R$ 49,90/mês', features: ['Tudo do Standard', 'IA ilimitada', 'Redação por IA', 'Google Calendar'], bg: '#faf5ff', color: '#7c3aed' },
                { name: 'Advanced Pro', price: 'R$ 99,90/mês', features: ['Tudo do Student', 'IA sem limites', 'Simulados por IA', 'Suporte prioritário'], bg: '#fffbeb', color: '#d97706' },
              ].map((plan) => (
                <div key={plan.name} className="rounded-xl p-4 text-center" style={{ background: plan.bg, border: `1px solid ${plan.color}30` }}>
                  <h3 className="font-bold mb-1 text-sm" style={{ color: plan.color }}>{plan.name}</h3>
                  <p className="text-xs font-semibold mb-3" style={{ color: plan.color }}>{plan.price}</p>
                  <ul className="text-xs space-y-1 text-left" style={{ color: '#6b7280' }}>
                    {plan.features.map(f => <li key={f}>• {f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/pricing" className="text-sm font-medium hover:underline" style={{ color: '#6d28d9' }}>Ver detalhes completos dos planos →</Link>
            </div>
          </div>

          <div className="rounded-2xl p-6 text-center" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
            <p className="mb-3" style={{ color: '#374151' }}>Dúvidas sobre pagamentos? Nossa equipe está pronta para ajudar!</p>
            <Link href="/suporte" className="text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-block" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}>
              Contatar Suporte →
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-12 mt-8" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <img src="/tirei10-logo-white.png" alt="Tirei10" className="h-8 w-auto mb-2" />
              <p className="text-sm" style={{ color: '#475569' }}>Plataforma de estudos com IA adaptativa</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#475569' }}>
              <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <Link href="/politicas" className="hover:text-purple-400 transition-colors">Políticas</Link>
              <Link href="/suporte" className="hover:text-purple-400 transition-colors">Suporte</Link>
              <Link href="/pagamentos" className="hover:text-purple-400 transition-colors">Pagamentos</Link>
              <Link href="/pricing" className="hover:text-purple-400 transition-colors">Planos</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(139,92,246,0.15)', color: '#334155' }}>
            <p>© 2026 Tirei10. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
      }
