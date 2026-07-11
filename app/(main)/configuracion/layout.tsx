import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración | AgroPlan Colombia - Ajustes y Equipo',
  description: 'Configura tu experiencia, revisa tu ubicación y conoce al equipo detrás de AgroPlan Colombia.',
  keywords: 'configuración, ajustes, equipo, AgroPlan Colombia',
}

export default function ConfiguracionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
