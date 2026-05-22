import Link from 'next/link';

export default function PoliticasPage() {
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Políticas da Comunidade</h1>
          <p className="text-gray-500 mb-10">Última atualização: maio de 2026</p>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🤝 1. Princípios da Comunidade</h2>
              <p className="text-gray-600 leading-relaxed">
                A comunidade Tirei10 é um espaço de aprendizado colaborativo e respeitoso. Todos os membros devem tratar uns aos outros com cordialidade, respeito e empatia. Não toleramos qualquer forma de discriminação, assédio, bullying ou comportamento abusivo.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 2. Uso da Plataforma</h2>
              <p className="text-gray-600 leading-relaxed mb-4">A plataforma Tirei10 destina-se exclusivamente para fins educacionais. São proibidas:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Publicação de conteúdo ofensivo, discriminatório ou ilegal</li>
                <li>Compartilhamento de informações pessoais de terceiros sem consentimento</li>
                <li>Spam ou publicidade não autorizada</li>
                <li>Uso de scripts automatizados ou bots</li>
                <li>Tentativas de violação da segurança da plataforma</li>
                <li>Compartilhamento de conteúdo com direitos autorais sem permissão</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 3. Fórum e Interações</h2>
              <p className="text-gray-600 leading-relaxed">
                Nas publicações do fórum e comentários, os usuários devem manter linguagem adequada e construtiva. 
                Discordâncias devem ser tratadas com respeito. Encoraja-se o compartilhamento de dicas de estudo, 
                materiais e experiências que possam beneficiar a comunidade.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 4. Privacidade e Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                O Tirei10 coleta e processa dados pessoais para personalizar a experiência de estudos. 
                Utilizamos cookies e tecnologias similares para melhorar nossos serviços. 
                Seus dados nunca serão compartilhados com terceiros sem sua autorização explícita, 
                exceto quando exigido por lei. Para mais informações, consulte nossa Política de Privacidade completa.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⚖️ 5. Consequências por Violações</h2>
              <p className="text-gray-600 leading-relaxed">
                Violações destas políticas podem resultar em: advertência ao usuário, remoção de conteúdo, 
                suspensão temporária da conta ou encerramento permanente da conta, dependendo da gravidade da infração. 
                Reservamo-nos o direito de tomar as medidas necessárias para manter a integridade da comunidade.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 6. Contato</h2>
              <p className="text-gray-600 leading-relaxed">
                Para reportar violações ou dúvidas sobre estas políticas, entre em contato com nossa equipe de suporte 
                através da página <Link href="/suporte" className="text-indigo-600 hover:underline">Suporte</Link> ou 
                pelo email: suporte@Tirei10.app
              </p>
            </section>
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
