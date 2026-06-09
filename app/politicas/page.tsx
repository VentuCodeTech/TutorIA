import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Políticas da Comunidade | Tirei10',
  description: 'Conheça as políticas de uso, privacidade e conduta da comunidade Tirei10. Utilizamos seus dados com segurança para personalizar sua experiência de estudos.',
  alternates: {
    canonical: 'https://www.tirei10.com.br/politicas',
  },
  openGraph: {
    title: 'Políticas da Comunidade | Tirei10',
    description: 'Conheça as políticas de uso e privacidade da plataforma Tirei10.',
    url: 'https://www.tirei10.com.br/politicas',
  },
};

export default function PoliticasPage() {
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
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1e1b4b' }}>Políticas da Comunidade</h1>
          <p className="mb-10" style={{ color: '#6b7280' }}>Última atualização: maio de 2026</p>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-8 shadow-md" style={{ border: '1px solid #ede9fe' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>🤝 1. Princípios da Comunidade</h2>
              <p className="leading-relaxed" style={{ color: '#6b7280' }}>
                A comunidade Tirei10 é um espaço de aprendizado colaborativo e respeitoso. Todos os membros devem tratar uns aos outros com cordialidade, respeito e empatia. Não toleramos nenhuma forma de discriminação, assédio, bullying ou comportamento abusivo.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md" style={{ border: '1px solid #ede9fe' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>📚 2. Uso da Plataforma</h2>
              <p className="leading-relaxed mb-4" style={{ color: '#6b7280' }}>A plataforma Tirei10 destina-se exclusivamente a fins educacionais. São proibidas:</p>
              <ul className="list-disc list-inside space-y-2" style={{ color: '#6b7280' }}>
                <li>Publicação de conteúdo ofensivo, discriminatório ou ilegal</li>
                <li>Compartilhamento de informações pessoais de terceiros sem consentimento</li>
                <li>Spam ou publicidade não autorizada</li>
                <li>Uso de scripts automatizados ou bots</li>
                <li>Tentativas de violação da segurança da plataforma</li>
                <li>Compartilhamento de conteúdo protegido por direitos autorais sem permissão</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md" style={{ border: '1px solid #ede9fe' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>💬 3. Fórum e Interações</h2>
              <p className="leading-relaxed" style={{ color: '#6b7280' }}>
                Nas publicações do fórum e nos comentários, os usuários devem manter linguagem adequada e construtiva.
                As discordâncias devem ser tratadas com respeito. Encorajamos o compartilhamento de dicas de estudo,
                materiais e experiências que possam beneficiar a comunidade.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md" style={{ border: '1px solid #ede9fe' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>🔒 4. Privacidade e Dados</h2>
              <p className="leading-relaxed" style={{ color: '#6b7280' }}>
                O Tirei10 coleta e processa dados pessoais para personalizar a experiência de estudos.
                Utilizamos cookies e tecnologias similares para melhorar nossos serviços.
                Seus dados nunca serão compartilhados com terceiros sem sua autorização explícita,
                exceto quando exigido por lei. Para mais informações, consulte nossa Política de Privacidade completa.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md" style={{ border: '1px solid #ede9fe' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>⚖️ 5. Consequências por Violações</h2>
              <p className="leading-relaxed" style={{ color: '#6b7280' }}>
                Violações destas políticas podem resultar em: advertência ao usuário, remoção de conteúdo,
                suspensão temporária da conta ou encerramento permanente da conta, dependendo da gravidade da infração.
                Reservamo-nos o direito de adotar as medidas necessárias para manter a integridade da comunidade.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md" style={{ border: '1px solid #ede9fe' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e1b4b' }}>📞 6. Contato</h2>
              <p className="leading-relaxed" style={{ color: '#6b7280' }}>
                Para reportar violações ou tirar dúvidas sobre estas políticas, entre em contato com nossa equipe de suporte
                através da página <Link href="/suporte" style={{ color: '#6d28d9' }} className="hover:underline">Suporte</Link> ou
                pelo e-mail: <a href="mailto:suporte@tirei10.com.br" style={{ color: '#6d28d9' }} className="hover:underline">suporte@tirei10.com.br</a>
              </p>
            </section>
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
