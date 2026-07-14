import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configuración de AgroPlan',
  description: 'Configura tu experiencia en AgroPlan y consulta la información del proyecto de inteligencia agrícola para Colombia.',
  keywords: ['configuración AgroPlan', 'proyecto AgroPlan Colombia', 'inteligencia agrícola'],
  alternates: {
    canonical: '/configuracion',
  },
  openGraph: {
    title: 'Configuración de AgroPlan | AgroPlan Colombia',
    description: 'Configura tu experiencia y conoce el ecosistema AgroPlan.',
    type: 'website',
    url: '/configuracion',
  },
}

export default function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  return children
}
