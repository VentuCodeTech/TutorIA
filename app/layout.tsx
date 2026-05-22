import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tirei10 - Plataforma de Estudos com IA',
  description: 'Prepare-se para ENEM, OAB, Concursos Públicos e CPA-20 com IA Adaptativa powered by Claude AI',
  keywords: 'ENEM, OAB, Concursos, CPA-20, Estudo, IA, Inteligência Artificial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
