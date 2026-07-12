'use client'

import { AlertTriangle, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-10" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Error crítico</h1>
            <p className="text-muted-foreground">
              Ha ocurrido un error grave en la aplicación. Por favor, recarga la
              página o regresa al inicio.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Recargar página
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            >
              <Home className="size-4" />
              Ir al inicio
            </Link>
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
        </div>
      </body>
    </html>
  )
}
