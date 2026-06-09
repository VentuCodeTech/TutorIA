import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central de Suporte',
  description: 'Tire suas dúvidas, acesse o FAQ e entre em contato com a equipe Tirei10. Suporte via e-mail, chat ao vivo e base de conhecimento.',
  alternates: {
    canonical: 'https://www.tirei10.com.br/suporte',
  },
  openGraph: {
    title: 'Central de Suporte',
    description: 'Tire suas dúvidas sobre a plataforma Tirei10. Acesse o FAQ, chat ao vivo e suporte por e-mail.',
    url: 'https://www.tirei10.com.br/suporte',
  },
};

export default function SuportePage() {
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
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: '#1e1b4b' }}>Central de Suporte</h1>
            <p className="text-xl" style={{ color: '#6b7280' }}>Como podemos te ajudar hoje?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center" style={{ border: '1px solid #ede9fe' }}>
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-bold mb-2" style={{ color: '#1e1b4b' }}>E-mail</h3>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>Resposta em até 24 horas</p>
              <a href="mailto:suporte@tirei10.com.br" className="text-sm font-medium hover:underline" style={{ color: '#6d28d9' }}>suporte@tirei10.com.br</a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center" style={{ border: '1px solid #ede9fe' }}>
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold mb-2" style={{ color: '#1e1b4b' }}>Chat ao Vivo</h3>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>Disponível para os planos Student e Advanced Pro</p>
              <Link href="/dashboard" className="text-sm font-medium hover:underline" style={{ color: '#6d28d9' }}>Acessar Chat →</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center" style={{ border: '1px solid #ede9fe' }}>
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold mb-2" style={{ color: '#1e1b4b' }}>Base de Conhecimento</h3>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>Artigos e tutoriais detalhados</p>
              <span className="text-sm" style={{ color: '#9ca3af' }}>Em breve</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md mb-8" style={{ border: '1px solid #ede9fe' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e1b4b' }}>Perguntas Frequentes</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Como criar uma conta no Tirei10?',
                  a: 'Acesse nossa página inicial e clique em "Começar Gratuitamente". Você pode se cadastrar com e-mail e senha ou usar sua conta Google. O processo leva menos de 2 minutos.'
                },
                {
                  q: 'Como funciona o plano Gratuito?',
                  a: 'O plano Gratuito oferece 20 questões por dia, acesso às matérias básicas, dashboard simplificado e participação na comunidade. Não é necessário cadastrar cartão de crédito.'
                },
                {
                  q: 'Como faço para fazer upgrade do meu plano?',
                  a: 'Acesse "Planos" no menu lateral do dashboard. Escolha o plano desejado e conclua o pagamento de forma segura via Stripe. O upgrade é ativado imediatamente.'
                },
                {
                  q: 'Posso cancelar minha assinatura a qualquer momento?',
                  a: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas. O acesso premium permanece ativo até o final do período já pago.'
                },
                {
                  q: 'O assistente de IA funciona 24 horas por dia?',
                  a: 'Sim! O Assistente IA (disponível nos planos pagos) funciona 24 horas por dia, 7 dias por semana. No plano Standard, o limite é de 50 mensagens diárias. Nos planos Student e Advanced Pro, o uso é ilimitado.'
                },
                {
                  q: 'Meus dados de estudo ficam salvos?',
                  a: 'Sim! Todo o seu progresso, questões respondidas, simulados e anotações são salvos automaticamente na nuvem e ficam acessíveis em qualquer dispositivo.'
                },
                {
                  q: 'Como funciona a integração com o Google Calendar?',
                  a: 'Disponível nos planos Student e Advanced Pro. Após vincular sua conta Google, seus planos de estudo e metas são sincronizados automaticamente com o Google Calendar.'
                },
                {
                  q: 'Esqueci minha senha. O que devo fazer?',
                  a: 'Na página de login, clique em "Esqueci minha senha" e informe seu e-mail. Você receberá um link para redefinir sua senha em até 5 minutos.'
                }
              ].map((item, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: '#f3e8ff' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#1e1b4b' }}>❓ {item.q}</h3>
                  <p className="leading-relaxed" style={{ color: '#6b7280' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-8 text-center text-white" style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #9333ea)' }}>
            <h2 className="text-2xl font-bold mb-3">Não encontrou o que procurava?</h2>
            <p className="mb-6" style={{ color: '#ddd6fe' }}>Nossa equipe está pronta para te ajudar. Entre em contato!</p>
            <a href="mailto:suporte@tirei10.com.br" className="bg-white px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors inline-block" style={{ color: '#6d28d9' }}>
              Enviar E-mail →
            </a>
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
