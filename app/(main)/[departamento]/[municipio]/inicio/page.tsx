'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarClock } from 'lucide-react'
import { LocationCard } from '@/components/location-card'
import { WeatherCard } from '@/components/weather-card'
import { RecommendationCard } from '@/components/recommendation-card'
import { CropCard } from '@/components/crop-card'
import { ClimateAlertCard } from '@/components/climate-alert-card'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import { Card } from '@/components/ui/card'
import { MONTHS_LONG } from '@/lib/constants'
import { useWeather, useRecommendations, useAlerts } from '@/hooks'
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from '@/lib/routing'
import type { Crop, Weather, Municipality } from '@/types'

export default function InicioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()

  const municipalityId = selectedLocation?.id || ''

  const { weather, loading: weatherLoading, error: weatherError } = useWeather(municipalityId)
  const { recommendations, loading: recommendationsLoading, error: recommendationsError } = useRecommendations(municipalityId)
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts(municipalityId)

  const loading = weatherLoading || recommendationsLoading || alertsLoading
  const error = weatherError || recommendationsError || alertsError

  useEffect(() => {
    setMounted(true)

    // Redirect to landing page if no location selected
    if (!selectedLocation && mounted) {
      router.push('/')
    }
  }, [selectedLocation, mounted, router])

  if (!mounted || !selectedLocation) {
    return null
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  const topCrop = recommendations?.topCrop
  const otherCrops = recommendations?.otherCrops || []
  const nextSeason = recommendations?.nextPlantingSeason

  // Create a location object with the selected municipality for display
  const displayLocation = {
    municipality: selectedLocation.name,
    department: selectedLocation.department,
    altitude: selectedLocation.altitude || 1200,
  }

  const cropsBasePath = buildLocationPath(selectedLocation.department, selectedLocation.name, 'cultivos')

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">Hola, buen día</p>
          <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
            ¿Qué puedo sembrar hoy?
          </h1>
        </div>
        <DownloadPdfButton pageName="Dashboard-AgroPlan" />
      </header>

      <div id="pdf-content" className="flex flex-col gap-8 rounded-lg bg-white p-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <LocationCard location={displayLocation} />
          <WeatherCard weather={weather} />
        </section>

        <section aria-labelledby="rec-title" className="flex flex-col gap-4">
          <h2 id="rec-title" className="sr-only">
            Cultivo recomendado
          </h2>
          {topCrop ? <RecommendationCard crop={topCrop} href={`${cropsBasePath}/${topCrop.id}`} /> : null}
        </section>

        <section aria-labelledby="more-title" className="flex flex-col gap-4">
          <h2 id="more-title" className="text-lg font-semibold">
            Más cultivos para ti
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {otherCrops.length > 0
              ? otherCrops.map((crop) => (
                  <CropCard key={crop.id} {...crop} href={`${cropsBasePath}/${crop.id}`} />
                ))
              : null}
          </div>
        </section>

        <section aria-labelledby="season-title" className="flex flex-col gap-4">
          <h2 id="season-title" className="text-lg font-semibold">
            Próxima temporada de siembra
          </h2>
          <Card className="flex flex-row items-center gap-4 p-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <CalendarClock className="size-7" />
            </div>
            <div>
              <p className="font-semibold">
                {nextSeason ? `${nextSeason.monthName} · Temporada de siembra` : 'Próxima temporada de siembra'}
              </p>
              <p className="text-sm text-muted-foreground text-pretty">
                {nextSeason && nextSeason.crops.length > 0
                  ? `Cultivos recomendados: ${nextSeason.crops.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}.`
                  : 'No hay información de temporada disponible en este momento.'}
              </p>
            </div>
          </Card>
        </section>

        <section aria-labelledby="alerts-title" className="flex flex-col gap-4">
          <h2 id="alerts-title" className="text-lg font-semibold">
            Alertas del clima
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
        </section>
      </div>
    </div>
  )
}
