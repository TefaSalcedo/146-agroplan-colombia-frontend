import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendario Agrícola | AgroPlan Colombia - ¿Qué sembrar este mes?',
  description: 'Consulta el calendario de siembra ideal para tu municipio y cultivo. Planificación agrícola inteligente con datos agroclimáticos reales.',
  keywords: 'calendario agrícola, siembra, cosecha, planificación cultivos, agricultura Colombia',
}

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
