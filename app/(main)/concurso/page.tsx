import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ConcursoPage } from '@/components/concurso-page'
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: 'Datos al ecosistema 2026 - AgroPlan Colombia',
  description: 'Explora el ecosistema completo de AgroPlan Colombia: pipeline de Machine Learning, API, dashboard, MCP y modelos publicados para el concurso de Datos Abiertos 2026.',
}

function ConcursoFallback() {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p>Cargando concurso...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<ConcursoFallback />}>
      <ConcursoPage />
    </Suspense>
  )
}
