"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PageLoading } from "@/components/page-loading"
import { DownloadPdfButton } from "@/components/download-pdf-button"
import {
  AgriculturalCalendar,
  AgriculturalCalendarLegend,
} from "@/components/agricultural-calendar"
import { useRecommendations, useCalendars } from "@/hooks"
import { useLocation } from "@/context/LocationContext"
import { CalendarDetail } from "@/components/calendar-detail"
import type { CalendarBatchResponse } from "@/lib/api-client/types"

export default function CalendarioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()

  const municipalityId = selectedLocation?.id || ""

  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
  } = useRecommendations(municipalityId)
  const { predictBatch, loading: calendarLoading, error: calendarError } = useCalendars()

  const [batchResponse, setBatchResponse] = useState<CalendarBatchResponse | null>(null)

  useEffect(() => {
    setMounted(true)

    if (!selectedLocation && mounted) {
      router.push('/')
    }
  }, [selectedLocation, mounted, router])

  useEffect(() => {
    const recommendedIds = recommendations?.topCrop
      ? [
          recommendations.topCrop.id,
          ...(recommendations.otherCrops || []).map((c) => c.id),
        ]
      : []

    if (municipalityId && recommendedIds.length > 0) {
      predictBatch({
        municipality_id: municipalityId,
        crop_ids: recommendedIds,
        horizon_months: 12,
      }).then((response) => {
        if (response) setBatchResponse(response)
      })
    }
  }, [municipalityId, recommendations, predictBatch])

  const loading = recommendationsLoading || calendarLoading
  const error = recommendationsError || calendarError

  if (!mounted || !selectedLocation) {
    return null
  }

  if (loading) {
    return <PageLoading title="Calendario de siembra y cosecha" />
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Calendario de siembra y cosecha
          </h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            {batchResponse
              ? `Plan agrícola para ${batchResponse.municipalityName} a ${batchResponse.horizonMonths} meses.`
              : "Planifica tu próxima siembra según el clima de tu municipio."}
          </p>
        </div>
        <DownloadPdfButton pageName="Calendario-AgroPlan" />
      </div>

      <div id="pdf-calendario" className="flex flex-col gap-6 rounded-lg bg-card p-4 md:p-6">
        <AgriculturalCalendar batchResponse={batchResponse} mode="full" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AgriculturalCalendarLegend />
          <Card className="flex items-start gap-3 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">Las fechas pueden variar según las condiciones climáticas de tu municipio.</p>
              <p className="text-muted-foreground">
                Consulta siempre con tu entidad local para recomendaciones específicas.
              </p>
            </div>
          </Card>
        </div>

        <CalendarDetail batchResponse={batchResponse} />
      </div>
    </div>
  )
}
