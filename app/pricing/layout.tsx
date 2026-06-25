import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Compare os planos Tirei10: Gratuito, Standard (R$19,90), Student (R$49,90) e Advanced Pro (R$99,90). Estude para ENEM, OAB, Concursos e CPA-20 com IA adaptativa.',
  alternates: {
    canonical: 'https://www.tirei10.com.br/pricing',
  },
  openGraph: {
    title: 'Planos e Preços',
    description: 'Escolha o plano ideal para sua preparação. Plano gratuito disponível. ENEM, OAB, Concursos Públicos e CPA-20.',
    url: 'https://www.tirei10.com.br/pricing',
  },
};

export default function PricingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
