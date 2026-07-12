'use client'

import { useEffect, useState } from 'react'
import { Activity, AlertCircle, CheckCircle2, Server } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchReadiness } from '@/lib/api-client/health'
import type { ReadinessResponse, ComponentStatus } from '@/lib/api-client/types'

export function BackendStatus() {
  const [data, setData] = useState<ReadinessResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const result = await fetchReadiness()
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setData(null)
          setError(err instanceof Error ? err.message : 'Error checking backend status')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <Server className="size-5 text-primary" />
          <p className="font-medium">Estado del backend</p>
        </div>
        <p className="text-sm text-muted-foreground">Consultando estado de los servicios...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-5 text-destructive" />
          <p className="font-medium">Backend no disponible</p>
        </div>
        <p className="text-sm text-destructive text-pretty">{error}</p>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  const isHealthy = data.status === 'ok'

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="size-5 text-primary" />
          <div>
            <p className="font-medium">Estado del backend</p>
            <p className="text-sm text-muted-foreground">Versión: {data.version}</p>
          </div>
        </div>
        <Badge variant={isHealthy ? 'default' : 'destructive'} className="shrink-0">
          {isHealthy ? 'Saludable' : 'Degradado'}
        </Badge>
      </div>

      <div className="grid gap-2">
        {data.components.map((component: ComponentStatus) => (
          <div
            key={component.name}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              {component.ready ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <AlertCircle className="size-4 text-destructive" />
              )}
              <span className="text-sm font-medium capitalize">{component.name.replace(/_/g, ' ')}</span>
            </div>
            <span className="text-xs text-muted-foreground">{component.detail || (component.ready ? 'Ready' : 'Not ready')}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
