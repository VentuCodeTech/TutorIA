import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tirei10 - Plataforma de Estudos com IA',
  description: 'Prepare-se para ENEM, OAB, Concursos Públicos e CPA-20 com IA Adaptativa powered by Gemini AI',
  keywords: 'ENEM, OAB, Concursos, CPA-20, Estudo, IA, Inteligência Artificial, Tirei10',
  icons: {
    icon: [
      { url: '/tirei10-icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/tirei10-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/tirei10-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/tirei10-icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/tirei10-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6B21A8" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
