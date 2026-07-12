import type { Metadata } from 'next'
import { ConcursoPage } from '@/components/concurso-page'

export const metadata: Metadata = {
  title: 'Concurso - AgroPlan Colombia',
  description: 'Información completa del proyecto AgroPlan Colombia para el concurso de Datos Abiertos 2026.',
}

export default function Page() {
  return <ConcursoPage />
}
