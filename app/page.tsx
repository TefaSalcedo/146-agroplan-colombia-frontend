import type { Metadata } from 'next'
import { LandingPage } from '@/components/landing-page'

export const metadata: Metadata = {
  title: 'AgroPlan Colombia · ¿Qué sembrar hoy?',
  description: 'Sistema de inteligencia artificial que ayuda a agricultores y alcaldías en Colombia a decidir qué cultivar, cuándo sembrar y dónde, con zonificación agroclimática.',
}

export default function Page() {
  return <LandingPage />
}
