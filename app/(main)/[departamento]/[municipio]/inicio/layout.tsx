import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Agrícola | AgroPlan Colombia - Recomendaciones Personalizadas',
  description:
    'Tu dashboard de recomendaciones agrícolas personalizadas basadas en tu ubicación, clima y datos regionales en tiempo real.',
  keywords: 'dashboard agrícola, recomendaciones cultivos, inteligencia agrícola, análisis climático',
}

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
