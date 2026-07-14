'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'

import { StatusPageShell } from '@/components/status-page-shell'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Critical application error:', error)
  }, [error])

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <StatusPageShell>
          <div className="mt-6 flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-border/80 bg-card/85 p-6 text-center shadow-2xl shadow-primary/10 backdrop-blur-md sm:p-8">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/15 sm:size-20">
              <AlertTriangle className="size-8 sm:size-10" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-destructive">Error crítico</p>
              <h1 className="text-2xl font-bold sm:text-3xl">La aplicación necesita recargarse</h1>
              <p className="text-muted-foreground">
                Ha ocurrido un error grave en AgroPlan. Recarga la página o
                regresa al inicio para continuar.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Recargar página
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Home className="size-4" />
                Ir al inicio
              </Link>
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
          </div>
        </StatusPageShell>
      </body>
    </html>
  )
}
