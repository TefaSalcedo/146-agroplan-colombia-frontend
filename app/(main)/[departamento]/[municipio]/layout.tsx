import type { Metadata } from 'next'
import type { ReactNode } from 'react'
export const metadata: Metadata = {
  title: 'AgroPlan Colombia - Inteligencia Agrícola Predictiva',
  description: 'Sistema de IA para agricultura inteligente en Colombia.',
}

export default function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
