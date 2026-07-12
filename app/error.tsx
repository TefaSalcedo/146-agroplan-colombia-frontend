'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="flex max-w-md flex-col items-center gap-6 p-8 text-center">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-10" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="text-muted-foreground">
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente o
            regresa a la página principal.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            onClick={reset}
            className="gap-2"
          >
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
          <details className="mt-4 w-full text-left">
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
    </div>
  )
}
