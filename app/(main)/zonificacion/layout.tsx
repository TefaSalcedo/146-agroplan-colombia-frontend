import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zonificación Agroclimática | AgroPlan Colombia - Mapa de Aptitud',
  description: 'Explora el mapa de zonificación agroclimática y descubre qué cultivos tienen mejor aptitud en cada municipio de tu región.',
  keywords: 'zonificación, aptitud, mapa agrícola, cultivos, municipios Colombia',
}

export default function ZonificacionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
