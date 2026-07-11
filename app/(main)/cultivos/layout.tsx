import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cultivos Recomendados | AgroPlan Colombia - Recomendaciones Inteligentes',
  description: 'Descubre los cultivos más recomendados para tu municipio. Análisis agroclimático con inteligencia artificial para agricultores colombianos.',
  keywords: 'cultivos, recomendaciones agrícolas, qué sembrar, agricultura inteligente, Colombia',
}

export default function CultivosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
