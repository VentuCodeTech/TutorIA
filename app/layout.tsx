import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Chatbot from '@/components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TutorIA - Plataforma de Estudos com IA',
  description: 'Prepare-se para ENEM, OAB, Concursos Publicos e CPA-20 com inteligencia artificial adaptativa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Chatbot />
      </body>
    </html>
  )
}