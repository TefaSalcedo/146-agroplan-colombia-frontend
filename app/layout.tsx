import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { LocationProvider } from '@/context/LocationContext'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: 'AgroPlan Colombia - Inteligencia Agrícola Predictiva | Qué Sembrar Hoy',
  description:
    'AgroPlan es un sistema de IA que ayuda a agricultores y alcaldías en Colombia a decidir qué cultivar, cuándo sembrar y dónde. Zonificación agroclimática inteligente basada en datos reales de tu región.',
  keywords: 'agricultura Colombia, qué sembrar, zonificación agrícola, cultivos, predicción agrícola, IA agrícola, planificación agraria',
  authors: [{ name: 'AgroPlan Colombia' }],
  creator: 'AgroPlan Colombia',
  publisher: 'AgroPlan Colombia',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://agroplan.co',
    siteName: 'AgroPlan Colombia',
    title: 'AgroPlan Colombia - Inteligencia Agrícola Predictiva',
    description: 'Sistema de IA para agricultura inteligente en Colombia. Descubre qué sembrar con precisión.',
  },
  alternates: {
    canonical: 'https://agroplan.co',
  },
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#242424' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="bg-background">
      <body className="antialiased">
        <LocationProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </LocationProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
