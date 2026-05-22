import Link from 'next/link';

export default function PagamentosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">Tirei10</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">Login</Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200">Começar Grátis</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Meios de Pagamento</h1>
            <p className="text-xl text-gray-600">Pagamentos seguros e práticos para sua assinatura Tirei10</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔒 Segurança em Primeiro Lugar</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Todos os pagamentos no Tirei10 são processados pela <strong>Stripe</strong>, uma das plataformas de pagamento 
              mais seguras e confiáveis do mundo, utilizada por empresas como Amazon, Google e Shopify.
            </p>
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-800">Seus dados estão protegidos</p>
                <p className="text-sm text-green-700">Criptografia SSL de 256 bits em todas as transações. Somos certificados PCI DSS nível 1.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 Formas de Pagamento Aceitas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💳</span>
                  <h3 className="text-lg font-bold text-gray-800">Cartão de Crédito</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">Aceitamos as principais bandeiras:</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'American Express', 'Elo', 'Hipercard'].map((brand) => (
                    <span key={brand} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{brand}</span>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-3">Parcelamento disponível conforme o plano escolhido</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💳</span>
                  <h3 className="text-lg font-bold text-gray-800">Cartão de Débito</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">Pagamento à vista com débito em conta:</p>
                <div className="flex flex-wrap gap-2">
                  {['Visa Débito', 'Mastercard Débito'].map((brand) => (
                    <span key={brand} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Informações sobre Assinaturas</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-indigo-600 font-bold text-lg">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Cobrança Mensal Automática</h3>
                  <p className="text-gray-600 text-sm">As assinaturas são cobradas mensalmente no mesmo dia em que você se cadastrou. Você receberá um email de confirmação a cada renovação.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-indigo-600 font-bold text-lg">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Cancelamento a Qualquer Momento</h3>
                  <p className="text-gray-600 text-sm">Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas. O acesso premium permanece ativo até o final do período pago.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-indigo-600 font-bold text-lg">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Notas Fiscais</h3>
                  <p className="text-gray-600 text-sm">Para serviços digitais, você receberá automaticamente o comprovante de pagamento por email. Notas fiscais estão disponíveis sob demanda.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-indigo-600 font-bold text-lg">•</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Política de Reembolso</h3>
                  <p className="text-gray-600 text-sm">Oferecemos reembolso total nos primeiros 7 dias após a contratação, caso não esteja satisfeito com o serviço. Para solicitar, entre em contato com nosso suporte.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Nossos Planos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Gratuito', price: 'R$ 0/mês', color: 'bg-gray-100 text-gray-700' },
                { name: 'Standard', price: 'R$ 19,90/mês', color: 'bg-blue-100 text-blue-700' },
                { name: 'Student', price: 'R$ 49,90/mês', color: 'bg-purple-100 text-purple-700' },
                { name: 'Advanced Pro', price: 'R$ 99,90/mês', color: 'bg-yellow-100 text-yellow-700' },
              ].map((plan) => (
                <div key={plan.name} className={`${plan.color} rounded-xl p-4 text-center`}>
                  <h3 className="font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm font-semibold">{plan.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/pricing" className="text-indigo-600 hover:underline text-sm font-medium">Ver detalhes completos dos planos →</Link>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center">
            <p className="text-gray-700 mb-3">Dúvidas sobre pagamentos? Nossa equipe está pronta para ajudar!</p>
            <Link href="/suporte" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block">
              Contatar Suporte →
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">© 2026 Tirei10. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
            <Link href="/home" className="hover:text-white transition-colors">Home</Link>
            <Link href="/politicas" className="hover:text-white transition-colors">Políticas da Comunidade</Link>
            <Link href="/suporte" className="hover:text-white transition-colors">Suporte</Link>
            <Link href="/pagamentos" className="hover:text-white transition-colors">Meios de Pagamento</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
