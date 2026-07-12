'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, Calendar, MapPin, CloudSun, AlertTriangle } from 'lucide-react'
import { LocationCard } from '@/components/location-card'
import { WeatherCard } from '@/components/weather-card'
import { ForecastCard } from '@/components/forecast-card'
import { ClimateAlertCard } from '@/components/climate-alert-card'
import { SatelliteCropMap } from '@/components/satellite-crop-map'
import { RecommendationCard } from '@/components/recommendation-card'
import { CropCard } from '@/components/crop-card'
import { HarvestCard } from '@/components/harvest-card'
import { DashboardActionCard } from '@/components/dashboard-action-card'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import { AgriculturalCalendar, AgriculturalCalendarLegend } from '@/components/agricultural-calendar'
import { useRecommendations, useCrops, useCalendars, useWeather, useForecast, useAlerts } from '@/hooks'
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from '@/lib/routing'
import {
  getPlantingStatus,
  getHarvestStatus,
  estimateMaturity,
  getMonthName,
  getPlantingWindowLabel,
} from '@/lib/calendar'
import type { Crop, RecommendationLevel } from '@/types'
import type { CropLite, CalendarBatchResponse } from '@/lib/api-client/types'

interface EnrichedCrop extends CropLite {
  plantingMonths: number[]
  harvestMonths: number[]
  daysToHarvest: number
  recommendation: RecommendationLevel
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

interface ClassifiedCrops {
  sowing: EnrichedCrop[]
  harvest: EnrichedCrop[]
  zone: EnrichedCrop[]
}

function classifyByCalendar(crops: EnrichedCrop[], referenceDate: Date = new Date()): ClassifiedCrops {
  const sowing: EnrichedCrop[] = []
  const harvest: EnrichedCrop[] = []
  const zone: EnrichedCrop[] = []

  crops.forEach((crop) => {
    const planting = getPlantingStatus(crop.plantingMonths, referenceDate)
    const harvestStatus = getHarvestStatus(crop.harvestMonths, crop.daysToHarvest, referenceDate)

    if (planting.isNow || (planting.daysUntil !== null && planting.daysUntil <= 30)) {
      sowing.push(crop)
      return
    }

    if (harvestStatus.isNow || (harvestStatus.daysUntil !== null && harvestStatus.daysUntil <= 30)) {
      harvest.push(crop)
      return
    }

    zone.push(crop)
  })

  return { sowing, harvest, zone }
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
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts(municipalityId)

  const [batchResponse, setBatchResponse] = useState<CalendarBatchResponse | null>(null)

  const loading = recommendationsLoading || cropsLoading || calendarLoading || weatherLoading || forecastLoading

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

  const { sowingCrops, harvestCrops, zoneCrops, topCrop, allRecommendedCrops } = useMemo(() => {
    const cropMap = buildCropMap(allCrops)
    const enriched = enrichRecommendations(recommendations, cropMap)
    const classified = classifyByCalendar(enriched)
    return {
      sowingCrops: classified.sowing,
      harvestCrops: classified.harvest,
      zoneCrops: classified.zone,
      topCrop: recommendations?.topCrop,
      allRecommendedCrops: enriched,
    }
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

  const cropsBasePath = buildLocationPath(selectedLocation.department, selectedLocation.name, 'cultivos')
  const calendarBasePath = buildLocationPath(selectedLocation.department, selectedLocation.name, 'calendario')
  const today = new Date()

  const topPlantingStatus = topCrop ? getPlantingStatus(topCrop.plantingMonths, today) : null
  const topCropTitle = topPlantingStatus
    ? topPlantingStatus.isNow
      ? 'Hoy puedes sembrar'
      : topPlantingStatus.daysUntil !== null && topPlantingStatus.daysUntil <= 30
        ? 'Próxima siembra'
        : 'Cultivo recomendado'
    : 'Cultivo recomendado'

  const sowingCarouselCrops = topCrop
    ? sowingCrops.filter((c) => c.id !== topCrop.id)
    : sowingCrops

  const topCropPlantingWindow = topCrop ? getPlantingWindowLabel(topCrop.plantingMonths, today) : undefined

  const MAX_SOWING_CARDS = 3
  const MAX_ZONE_CARDS = 3
  const MAX_HARVEST_CARDS = 2

  const visibleSowingCrops = sowingCarouselCrops.slice(0, MAX_SOWING_CARDS)
  const visibleZoneCrops = zoneCrops.slice(0, MAX_ZONE_CARDS)
  const visibleHarvestCrops = harvestCrops.slice(0, MAX_HARVEST_CARDS)

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
        {/* 1. Ubicación y clima actual */}
        <section aria-labelledby="general-title" className="grid gap-3 sm:grid-cols-2 md:gap-4">
          <span id="general-title" className="sr-only">
            Ubicación y clima actual
          </span>
          <LocationCard location={displayLocation} municipality={selectedLocation} />
          <WeatherCard weather={weather} loading={weatherLoading} />
        </section>

        {/* 2. Mapa satelital con cultivos recomendados */}
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

        {/* 3. Clima futuro y alertas */}
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

          {/* Roja: endpoint de alertas + datos reales */}
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-xs font-medium text-red-700 dark:text-red-300">Endpoint de alertas</p>
              <code className="break-all text-sm text-red-800 dark:text-red-200">
                {`http://192.168.5.117:8000/api/v1/alerts/${municipalityId}`}
              </code>
            </div>

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
            {/* Amarilla: endpoint de pronóstico + datos reales */}
            <div className="flex flex-col gap-2">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/30">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Endpoint de pronóstico</p>
                <code className="break-all text-sm text-yellow-800 dark:text-yellow-200">
                  {`/api/v1/forecast/daily/{municipality_id}`}
                </code>
              </div>
              <ForecastCard forecast={forecast} loading={forecastLoading} />
            </div>

            {/* Gris / blanco: espacio reservado */}
            <div className="min-h-[200px] rounded-lg border border-dashed border-muted-foreground/20 bg-white dark:bg-background" />
          </div>
        </section>

        {/* 4. Siembra y cosechas */}
        <section aria-labelledby="sowing-title" className="flex flex-col gap-4">
          {/* <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sprout className="size-5" />
            </div>
            <div>
              <h2 id="sowing-title" className="text-lg font-semibold">
                Siembra y cosechas
              </h2>
              <p className="text-sm text-muted-foreground">
                Cultivos recomendados para tu calendario agrícola
              </p>
            </div>
          </div> */}

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Siembra */}
            {/* <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">Para sembrar ahora</p>
              {topCrop && (
                <RecommendationCard
                  crop={topCrop}
                  href={`${cropsBasePath}/${topCrop.id}`}
                  title={topCropTitle}
                  plantingWindowLabel={topCropPlantingWindow}
                  source={recommendations?.source}
                />
              )}
              {visibleSowingCrops.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {visibleSowingCrops.map((crop) => (
                    <CropCard
                      key={crop.id}
                      id={crop.id}
                      name={crop.name}
                      image={crop.image}
                      recommendation={crop.recommendation}
                      successRate={crop.successRate}
                      statusLabel={getPlantingStatus(crop.plantingMonths, today).label}
                      href={`${cropsBasePath}/${crop.id}`}
                      className="h-full"
                    />
                  ))}
                </div>
              )}
            </div> */}

            {/* Cosechas */}
            {/* {visibleHarvestCrops.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-muted-foreground">Próximas cosechas</p>
                <div className="grid grid-cols-1 gap-3">
                  {visibleHarvestCrops.map((crop) => {
                    const status = getHarvestStatus(crop.harvestMonths, crop.daysToHarvest, today)
                    return (
                      <HarvestCard
                        key={crop.id}
                        id={crop.id}
                        name={crop.name}
                        image={crop.image}
                        estimatedMonth={getMonthName(status.targetMonth)}
                        daysRemaining={status.daysUntil}
                        maturity={estimateMaturity(status.daysUntil, crop.daysToHarvest)}
                        statusLabel={status.label}
                        href={`${cropsBasePath}/${crop.id}`}
                        className="h-full w-full"
                      />
                    )
                  })}
                </div>
              </div>
            )} */}
          </div>

          {/* <DashboardActionCard
            icon={Sprout}
            title="Ver todos los cultivos"
            description="Explora todos los cultivos recomendados para tu zona"
            href={cropsBasePath}
          /> */}
        </section>

        {/* 5. Mini calendario agrícola */}
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
            {/* <DashboardActionCard
              icon={Calendar}
              title="Ver calendario"
              description="Ver completo"
              href={calendarBasePath}
              tone="accent"
              linkLabel="Ver calendario"
              className="hidden sm:flex"
            /> */}
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

        {/* 6. Cultivos recomendados para tu zona */}
      </div>
    </div>
  )
}
