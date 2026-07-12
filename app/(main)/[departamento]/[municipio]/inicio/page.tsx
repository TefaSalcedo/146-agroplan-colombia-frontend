'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, Wheat, AlertCircle, Calendar, Leaf } from 'lucide-react'
import { LocationCard } from '@/components/location-card'
import { WeatherCard } from '@/components/weather-card'
import { ForecastCard } from '@/components/forecast-card'
import { SatelliteCropMap } from '@/components/satellite-crop-map'
import { RecommendationCard } from '@/components/recommendation-card'
import { CropCard } from '@/components/crop-card'
import { HarvestCard } from '@/components/harvest-card'
import { ClimateAlertCard } from '@/components/climate-alert-card'
import { DashboardActionCard } from '@/components/dashboard-action-card'
import { DailyTipCard } from '@/components/daily-tip-card'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import { Card } from '@/components/ui/card'
import { useWeather, useForecast, useRecommendations, useAlerts, useCrops } from '@/hooks'
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from '@/lib/routing'
import {
  getPlantingStatus,
  getHarvestStatus,
  estimateMaturity,
  getMonthName,
  getPlantingWindowLabel,
} from '@/lib/calendar'
import { getClimateTips } from '@/lib/climate-tip'
import type { Crop, RecommendationLevel } from '@/types'
import type { CropLite } from '@/lib/api-client/types'

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

  const { weather, loading: weatherLoading } = useWeather(municipalityId)
  const { forecast, loading: forecastLoading } = useForecast(municipalityId, 4)
  const { recommendations, loading: recommendationsLoading } = useRecommendations(municipalityId)
  const { alerts, loading: alertsLoading } = useAlerts(municipalityId)
  const { crops: allCrops, loading: cropsLoading } = useCrops()

  const loading = weatherLoading || forecastLoading || recommendationsLoading || alertsLoading || cropsLoading

  useEffect(() => {
    setMounted(true)

    if (!selectedLocation && mounted) {
      router.push('/')
    }
  }, [selectedLocation, mounted, router])

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

  if (loading) {
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

  const dailyTip = topCrop?.tips?.[0]?.description ?? 'Mantén el suelo húmedo y protegido. Evita la exposición directa en las horas de más sol.'

  const MAX_SOWING_CARDS = 3
  const MAX_ZONE_CARDS = 3
  const MAX_HARVEST_CARDS = 2

  const visibleSowingCrops = sowingCarouselCrops.slice(0, MAX_SOWING_CARDS)
  const sowingFillCount = Math.max(0, MAX_SOWING_CARDS - visibleSowingCrops.length)

  const visibleZoneCrops = zoneCrops.slice(0, MAX_ZONE_CARDS)
  const zoneFillCount = Math.max(0, MAX_ZONE_CARDS - visibleZoneCrops.length)

  const visibleHarvestCrops = harvestCrops.slice(0, MAX_HARVEST_CARDS)
  const harvestFillCount = Math.max(0, MAX_HARVEST_CARDS - visibleHarvestCrops.length)

  const climateTips = getClimateTips(weather)

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
        {/* 1. Información general */}
        <section aria-labelledby="general-title" className="grid gap-3 sm:grid-cols-2 md:gap-4">
          <span id="general-title" className="sr-only">
            Información general
          </span>
          <LocationCard location={displayLocation} />
          <WeatherCard weather={weather} />
        </section>

        {/* 2. Mapa satelital + pronóstico */}
        <section
          aria-labelledby="map-forecast-title"
          className="grid gap-4 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]"
        >
          <span id="map-forecast-title" className="sr-only">
            Mapa satelital y pronóstico del clima
          </span>
          <ForecastCard forecast={forecast} loading={forecastLoading} />
          <SatelliteCropMap location={selectedLocation} crops={allRecommendedCrops} loading={loading} />
        </section>

        {/* 3. Siembra */}
        <section aria-labelledby="sowing-title" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sprout className="size-5" />
            </div>
            <div>
              <h2 id="sowing-title" className="text-lg font-semibold">
                Siembra
              </h2>
              <p className="text-sm text-muted-foreground">
                Cultivos recomendados para sembrar ahora o en los próximos meses
              </p>
            </div>
          </div>

          {topCrop ? (
            <RecommendationCard
              crop={topCrop}
              href={`${cropsBasePath}/${topCrop.id}`}
              title={topCropTitle}
              plantingWindowLabel={topCropPlantingWindow}
            />
          ) : (
            <DailyTipCard
              title="Consejo del clima"
              description={climateTips[0]}
              className="h-full"
            />
          )}

          <div className="grid gap-3 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_260px]">
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
              {Array.from({ length: sowingFillCount }, (_, i) => (
                <DailyTipCard
                  key={`sowing-tip-${i}`}
                  title="Consejo del clima"
                  description={climateTips[i % climateTips.length]}
                  className="h-full"
                />
              ))}
            </div>
            <DashboardActionCard
              icon={Leaf}
              title="Ver todos los cultivos"
              description="Explora todos los cultivos recomendados para tu zona"
              href={cropsBasePath}
            />
          </div>
        </section>

        {/* 4. Alertas + Cosecha */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alertas climáticas */}
          <section aria-labelledby="alerts-title" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-5" />
              </div>
              <h2 id="alerts-title" className="text-lg font-semibold">
                Alertas climáticas
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => <ClimateAlertCard key={alert.id} alert={alert} />)
              ) : (
                <ClimateAlertCard
                  alert={{
                    id: 'no-alerts',
                    level: 'info',
                    title: 'Sin alertas activas',
                    description: 'No hay alertas climáticas para tu municipio en este momento.',
                  }}
                />
              )}
            </div>
            <DailyTipCard
              title="Consejo del clima"
              description={climateTips[1] ?? climateTips[0]}
              className="h-full"
            />
          </section>

          {/* Cosecha */}
          <section aria-labelledby="harvest-title" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Wheat className="size-5" />
              </div>
              <div>
                <h2 id="harvest-title" className="text-lg font-semibold">
                  Próximas cosechas
                </h2>
                <p className="text-sm text-muted-foreground">Cultivos próximos a cosechar</p>
              </div>
            </div>

            {visibleHarvestCrops.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                {Array.from({ length: harvestFillCount }, (_, i) => (
                  <DailyTipCard
                    key={`harvest-tip-${i}`}
                    title="Consejo del clima"
                    description={climateTips[(i + 2) % climateTips.length]}
                    className="h-full"
                  />
                ))}
              </div>
            ) : (
              <Card className="flex items-center gap-4 p-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Wheat className="size-7" />
                </div>
                <div>
                  <p className="font-medium">No hay cosechas próximas</p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Ninguno de los cultivos recomendados está cerca de su ventana de cosecha.
                  </p>
                </div>
              </Card>
            )}
          </section>
        </div>

        {/* 5. Cultivos recomendados para tu zona */}
        <section aria-labelledby="zone-title" className="flex flex-col gap-4">
          <div>
            <h2 id="zone-title" className="text-lg font-semibold">
              Cultivos recomendados para tu zona
            </h2>
            <p className="text-sm text-muted-foreground">Otros cultivos compatibles con tu municipio</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_260px]">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {visibleZoneCrops.map((crop) => (
                <CropCard
                  key={crop.id}
                  id={crop.id}
                  name={crop.name}
                  image={crop.image}
                  recommendation={crop.recommendation}
                  successRate={crop.successRate}
                  href={`${cropsBasePath}/${crop.id}`}
                  className="h-full"
                />
              ))}
              {Array.from({ length: zoneFillCount }, (_, i) => (
                <DailyTipCard
                  key={`zone-tip-${i}`}
                  title="Consejo del clima"
                  description={climateTips[(i + 3) % climateTips.length]}
                  className="h-full"
                />
              ))}
            </div>
            <DashboardActionCard
              icon={Calendar}
              title="Ver calendario"
              description="¿Quieres ver cuándo sembrar cada cultivo?"
              href={calendarBasePath}
              tone="accent"
              linkLabel="Ver calendario"
            />
          </div>
        </section>

        {/* 6. Consejo del día */}
        <section aria-labelledby="tip-title">
          <span id="tip-title" className="sr-only">
            Consejo del día
          </span>
          <DailyTipCard description={dailyTip} />
        </section>
      </div>
    </div>
  )
}
