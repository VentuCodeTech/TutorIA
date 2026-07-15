import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Entrar ou Criar Conta',
    description: 'Acesse sua conta Tirei10 ou cadastre-se gratuitamente para estudar com IA para ENEM, OAB, Concursos Públicos e CPA-20. Login rápido com Google.',
    alternates: {
          canonical: 'https://www.tirei10.com.br/login',
    },
    openGraph: {
          title: 'Entrar ou Criar Conta',
          description: 'Acesse sua conta Tirei10 ou cadastre-se gratuitamente e comece a estudar com IA hoje mesmo.',
          url: 'https://www.tirei10.com.br/login',
          images: ['/tirei10-logo.png'],
    },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return children;
}
