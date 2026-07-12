"use client"

import { AlertTriangle } from "lucide-react"
import { ClimateAlertCard } from "@/components/climate-alert-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AlertResponse } from "@/lib/api-client/types"

interface ClimateAlertsSectionProps {
  alerts: AlertResponse[]
  loading?: boolean
}

export function ClimateAlertsSection({ alerts, loading }: ClimateAlertsSectionProps) {
  if (loading) {
    return (
      <section aria-labelledby="alerts-title" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
      </section>
    )
  }

  if (!alerts || alerts.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="alerts-title" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <AlertTriangle className="size-5" />
        </div>
        <div>
          <h2 id="alerts-title" className="text-lg font-semibold">
            Alertas climáticas
          </h2>
          <p className="text-sm text-muted-foreground">Información relevante para tu municipio</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <ClimateAlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  )
}
