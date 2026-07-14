'use client'

import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusPageShell } from '@/components/status-page-shell'

export default function NotFound() {
  return (
    <StatusPageShell>
      <Card className="mt-6 w-full max-w-xl items-center gap-6 border-border/80 bg-card/85 p-6 text-center shadow-2xl shadow-primary/10 backdrop-blur-md sm:p-8">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-20">
          <Search className="size-8 sm:size-10" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Error 404</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Página no encontrada</h1>
          <p className="text-muted-foreground">
            Lo sentimos, no pudimos encontrar la página que buscas dentro de la
            aplicación principal.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Volver atrás
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/">Ir al inicio</Link>}
            className="gap-2"
          >
            <Home className="size-4" />
            Inicio
          </Button>
        </div>

        <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
          <p>Páginas disponibles:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
            >
              Inicio
            </Link>
            <Link
              href="/concurso"
              className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
            >
              Concurso
            </Link>
            <Link
              href="/configuracion"
              className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
            >
              Configuración
            </Link>
          </div>
        </div>
      </Card>
    </StatusPageShell>
  )
}
