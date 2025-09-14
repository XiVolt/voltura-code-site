import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Voltura Code - Solutions de Développement Web',
  description: 'Solutions de développement web modernes et innovantes. Transformons vos idées en applications performantes et élégantes.',
  keywords: 'développement web, React, Next.js, TypeScript, applications web, voltura code',
  authors: [{ name: 'Voltura Code' }],
  creator: 'Voltura Code',
  publisher: 'Voltura Code',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://voltura-code.com',
    title: 'Voltura Code - Solutions de Développement Web',
    description: 'Solutions de développement web modernes et innovantes.',
    siteName: 'Voltura Code',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voltura Code - Solutions de Développement Web',
    description: 'Solutions de développement web modernes et innovantes.',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}