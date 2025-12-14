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
  icons: {
    icon: '/images/Voltura.png',
    shortcut: '/images/Voltura.png',
    apple: '/images/Voltura.png',
  },
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
    images: [
      {
        url: '/images/Voltura.png',
        width: 1200,
        height: 630,
        alt: 'Voltura Code',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voltura Code - Solutions de Développement Web',
    description: 'Solutions de développement web modernes et innovantes.',
    images: ['/images/Voltura.png'],
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
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}