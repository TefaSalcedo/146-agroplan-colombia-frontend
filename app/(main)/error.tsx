'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusPageShell } from '@/components/status-page-shell'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Main route error:', error)
  }, [error])

  return (
    <StatusPageShell>
      <Card className="mt-6 w-full max-w-xl items-center gap-6 border-border/80 bg-card/85 p-6 text-center shadow-2xl shadow-primary/10 backdrop-blur-md sm:p-8">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/15 sm:size-20">
          <AlertCircle className="size-8 sm:size-10" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-destructive">Error de sección</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Error en la aplicación</h1>
          <p className="text-muted-foreground">
            Ha ocurrido un error al cargar esta sección. Por favor, intenta
            nuevamente o regresa a la página principal.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="size-4" />
            Intentar de nuevo
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/">Ir al inicio</Link>}
            className="gap-2"
          >
            <Home className="size-4" />
            Inicio
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-2 w-full text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Ver detalles del error
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </Card>
    </StatusPageShell>
  )
}
