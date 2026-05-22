import Link from 'next/link';

export default function SuportePage() {
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
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Central de Suporte</h1>
            <p className="text-xl text-gray-600">Como podemos te ajudar hoje?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-3">Resposta em até 24 horas</p>
              <a href="mailto:suporte@Tirei10.app" className="text-indigo-600 hover:underline text-sm font-medium">suporte@Tirei10.app</a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-gray-800 mb-2">Chat ao Vivo</h3>
              <p className="text-gray-600 text-sm mb-3">Disponível para planos Student e Advanced Pro</p>
              <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm font-medium">Acessar Chat →</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-800 mb-2">Base de Conhecimento</h3>
              <p className="text-gray-600 text-sm mb-3">Artigos e Tirei10is detalhados</p>
              <span className="text-gray-400 text-sm">Em breve</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perguntas Frequentes</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Como criar uma conta no Tirei10?',
                  a: 'Acesse nossa página inicial e clique em "Começar Gratuitamente". Você pode cadastrar com email/senha ou usar sua conta Google. O processo leva menos de 2 minutos.'
                },
                {
                  q: 'Como funciona o plano Gratuito?',
                  a: 'O plano Gratuito oferece 20 questões por dia, acesso às matérias básicas, dashboard simples e participação na comunidade. Sem necessidade de cartão de crédito.'
                },
                {
                  q: 'Como faço upgrade do meu plano?',
                  a: 'Acesse "Planos" no menu lateral do dashboard. Escolha o plano desejado e complete o pagamento de forma segura via Stripe. O upgrade é imediato.'
                },
                {
                  q: 'Posso cancelar minha assinatura a qualquer momento?',
                  a: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas. O acesso premium permanece ativo até o final do período pago.'
                },
                {
                  q: 'O assistente de IA funciona 24 horas?',
                  a: 'Sim! O Assistente IA (disponível nos planos pagos) está disponível 24/7. No plano Standard, há um limite de 50 mensagens diárias. Nos planos Student e Advanced Pro, o limite é ilimitado.'
                },
                {
                  q: 'Meus dados de estudo são salvos?',
                  a: 'Sim! Todo o seu progresso, questões respondidas, simulados e anotações são salvos automaticamente na nuvem e ficam disponíveis em qualquer dispositivo.'
                },
                {
                  q: 'Como funciona a Integração com o Google Calendar?',
                  a: 'Disponível nos planos Student e Advanced Pro. Após vincular sua conta Google, seus planos de estudo e metas são sincronizados automaticamente com o Google Calendar.'
                },
                {
                  q: 'Esqueci minha senha. O que fazer?',
                  a: 'Na página de login, clique em "Esqueci minha senha" e informe seu email. Você receberá um link para redefinir sua senha em até 5 minutos.'
                }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">❓ {item.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Não encontrou o que procurava?</h2>
            <p className="text-indigo-200 mb-6">Nossa equipe está pronta para te ajudar. Entre em contato!</p>
            <a href="mailto:suporte@Tirei10.app" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors inline-block">
              Enviar Email →
            </a>
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
