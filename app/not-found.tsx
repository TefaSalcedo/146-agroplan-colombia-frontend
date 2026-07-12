'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="flex max-w-md flex-col items-center gap-6 p-8 text-center">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Search className="size-10" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Página no encontrada</h1>
          <p className="text-muted-foreground">
            Lo sentimos, no pudimos encontrar la página que buscas. Puede que
            haya sido movida o eliminada.
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

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <p>O intenta con:</p>
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
    </div>
  )
}
