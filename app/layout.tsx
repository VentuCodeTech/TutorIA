import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const APP_URL = 'https://www.tirei10.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Tirei10 - Plataforma de Estudos com IA | ENEM, OAB, Concursos e CPA ANBIMA',
    template: '%s | Tirei10',
  },
  description: 'Prepare-se para ENEM, OAB, Concursos Públicos e CPA ANBIMA com IA Adaptativa. Questões personalizadas, simulados cronometrados, plano de estudos e assistente IA 24/7. Comece grátis!',
  keywords: [
    'ENEM', 'OAB', 'Concursos Públicos', 'CPA ANBIMA', 'Vestibular', 'FUVEST', 'UNICAMP',
    'Plataforma de Estudos', 'IA Educacional', 'Inteligência Artificial', 'Tirei10',
    'Preparatório ENEM', 'Questões ENEM', 'Simulado ENEM', 'Gabarito', 'Aprovação',
    'Estudo Online', 'Revisão', 'Plano de Estudos', 'Assistente de Estudos',
    'Gemini AI', 'Redação ENEM', 'Matemática', 'Português', 'Ciências',
    'Concurso Federal', 'Exame OAB', 'CPA20', 'Mercado Financeiro'
  ],
  authors: [{ name: 'Tirei10', url: APP_URL }],
  creator: 'Tirei10',
  publisher: 'Tirei10',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: APP_URL,
    siteName: 'Tirei10',
    title: 'Tirei10 - Plataforma de Estudos com IA | ENEM, OAB, Concursos e CPA ANBIMA',
    description: 'Prepare-se para ENEM, OAB, Concursos Públicos e CPA ANBIMA com IA Adaptativa. Questões personalizadas, simulados cronometrados e assistente IA 24/7.',
    images: [
      {
                url: '/tirei10-logo.png',
                width: 430,
                height: 180,
        alt: 'Tirei10 - Plataforma de Estudos com IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tirei10 - Estude com IA e tire 10!',
    description: 'Prepare-se para ENEM, OAB, Concursos Públicos e CPA ANBIMA com IA Adaptativa. Comece grátis!',
          images: ['/tirei10-logo.png'],
    creator: '@tirei10',
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  category: 'education',
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

export default function RootLayout({ // NOSONAR
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Tirei10",
              "url": APP_URL,
              "logo": `${APP_URL}/tirei10-icon.png`,
              "description": "Plataforma de estudos com IA adaptativa para ENEM, OAB, Concursos Públicos e CPA ANBIMA.",
              "sameAs": [
                "https://www.instagram.com/tirei10",
              ],
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL",
                "description": "Plano gratuito disponível"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
