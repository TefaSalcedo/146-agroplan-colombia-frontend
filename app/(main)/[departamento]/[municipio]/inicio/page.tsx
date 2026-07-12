'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, AlertTriangle } from 'lucide-react'
import { LocationCard } from '@/components/location-card'
import { WeatherCard } from '@/components/weather-card'
import { ForecastCard } from '@/components/forecast-card'
import { MonthlyForecastCard } from '@/components/monthly-forecast-card'
import { ClimateAlertCard } from '@/components/climate-alert-card'
import { SatelliteCropMap } from '@/components/satellite-crop-map'
import { DashboardActionCard } from '@/components/dashboard-action-card'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import { AgriculturalCalendar, AgriculturalCalendarLegend } from '@/components/agricultural-calendar'
import { useRecommendations, useCrops, useCalendars, useWeather, useForecast, useMonthlyForecast, useAlerts } from '@/hooks'
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from '@/lib/routing'
import type { Crop, RecommendationLevel } from '@/types'
import type { CropLite, CalendarBatchResponse } from '@/lib/api-client/types'

interface EnrichedCrop extends CropLite {
  plantingMonths: number[]
  harvestMonths: number[]
  daysToHarvest: number
}

function buildCropMap(crops: Crop[]): Map<string, Crop> {
  const map = new Map<string, Crop>()
  crops.forEach((crop) => map.set(crop.id, crop))
  return map
}

function enrichRecommendations(
  recommendations: { topCrop?: Crop | null; otherCrops?: CropLite[] } | null,
  cropMap: Map<string, Crop>,
): EnrichedCrop[] {
  if (!recommendations) return []

  const source: (Crop | CropLite | null | undefined)[] = [
    recommendations.topCrop,
    ...(recommendations.otherCrops || []),
  ]

  const result: EnrichedCrop[] = []
  source.forEach((item) => {
    if (!item) return
    const full = cropMap.get(item.id)
    if (!full) return

    result.push({
      id: item.id,
      name: item.name,
      image: item.image,
      successRate: item.successRate ?? full.successRate ?? 0,
      recommendation: ('recommendation' in item ? item.recommendation : full.recommendation) as RecommendationLevel,
      plantingMonths: full.plantingMonths,
      harvestMonths: full.harvestMonths,
      daysToHarvest: full.daysToHarvest,
    })
  })

  return result
}

export default function InicioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()

  const municipalityId = selectedLocation?.id || ''

  const { recommendations, loading: recommendationsLoading } = useRecommendations(municipalityId)
  const { crops: allCrops, loading: cropsLoading } = useCrops()
  const { predictBatch, loading: calendarLoading } = useCalendars()
  const { weather, loading: weatherLoading } = useWeather(municipalityId)
  const { forecast, loading: forecastLoading } = useForecast(municipalityId, 4)
  const { forecast: monthlyForecast, loading: monthlyForecastLoading } = useMonthlyForecast(municipalityId, 4)
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts(municipalityId)

  const [batchResponse, setBatchResponse] = useState<CalendarBatchResponse | null>(null)

  const loading = recommendationsLoading || cropsLoading || calendarLoading || weatherLoading || forecastLoading || monthlyForecastLoading

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

  const allRecommendedCrops = useMemo(() => {
    const cropMap = buildCropMap(allCrops)
    return enrichRecommendations(recommendations, cropMap)
  }, [allCrops, recommendations])

  if (!mounted || !selectedLocation) {
    return null
  }

  if (loading && !batchResponse) {
    return <DashboardSkeleton />
  }

  const displayLocation = {
    municipality: selectedLocation.name,
    department: selectedLocation.department,
  }

  const calendarBasePath = buildLocationPath(selectedLocation.department, selectedLocation.name, 'calendario')

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">Hola, buen día</p>
          <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
            ¿Qué puedo sembrar este mes ?
          </h1>
        </div>
        <DownloadPdfButton pageName="Dashboard-AgroPlan" />
      </header>

      <div id="pdf-content" className="flex flex-col gap-6 rounded-lg bg-card p-4 md:gap-8 md:p-6">
        <section aria-labelledby="general-title" className="grid gap-3 sm:grid-cols-2 md:gap-4">
          <span id="general-title" className="sr-only">
            Ubicación y clima actual
          </span>
          <LocationCard location={displayLocation} municipality={selectedLocation} />
          <WeatherCard weather={weather} loading={weatherLoading} />
        </section>

        <section aria-labelledby="climate-alerts-title" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 id="climate-alerts-title" className="text-lg font-semibold">
                Clima futuro y alertas
              </h2>
              <p className="text-sm text-muted-foreground">Pronóstico y alertas para tu municipio</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {alertsLoading ? (
              <p className="text-sm text-muted-foreground">Cargando alertas...</p>
            ) : alertsError ? (
              <p className="text-sm text-destructive">Error: {alertsError}</p>
            ) : alerts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {alerts.map((alert) => (
                  <ClimateAlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <ForecastCard forecast={forecast} loading={forecastLoading} />
            </div>

            <div className="flex flex-col gap-2">
              <MonthlyForecastCard forecast={monthlyForecast} loading={monthlyForecastLoading} />
            </div>
          </div>
        </section>


        <section aria-labelledby="map-title" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
            <div>
              <h2 id="map-title" className="text-lg font-semibold">
                ¿Qué puedes sembrar aquí?
              </h2>
              <p className="text-sm text-muted-foreground">
                Cultivos recomendados para {selectedLocation.name} con su probabilidad de éxito
              </p>
            </div>
          </div>
          <SatelliteCropMap location={selectedLocation} crops={allRecommendedCrops} loading={loading} />
        </section>

        <section aria-labelledby="calendar-title" className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Calendar className="size-5" />
              </div>
              <div>
                <h2 id="calendar-title" className="text-lg font-semibold">
                  Calendario agrícola
                </h2>
                <p className="text-sm text-muted-foreground">
                  Siembra y cosecha de los cultivos recomendados
                </p>
              </div>
            </div>
          </div>
          <AgriculturalCalendar batchResponse={batchResponse} mode="compact" />
          <AgriculturalCalendarLegend />
          <div className="sm:hidden">
            <DashboardActionCard
              icon={Calendar}
              title="Ver calendario"
              description="Ver calendario completo"
              href={calendarBasePath}
              tone="accent"
              linkLabel="Ver calendario"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
