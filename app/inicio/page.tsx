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
import { Card } from '@/components/ui/card'
import {
  currentLocation,
  currentWeather,
  crops,
  extraCrops,
  climateAlerts,
  MONTHS_LONG,
  municipalities,
} from '@/lib/mock-data'

export default function InicioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedLocation, setLocation] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Check if user has selected a location
    if (typeof window !== 'undefined') {
      const storedLocation = sessionStorage.getItem('selectedLocation')
      if (!storedLocation) {
        // Redirect to landing page if no location selected
        router.push('/')
      } else {
        setLocation(JSON.parse(storedLocation))
      }
    }
  }, [router])

  if (!mounted || !selectedLocation) {
    return null
  }

  const topCrop = crops[0]
  const otherCrops = [
    ...crops.slice(1).map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      recommendation: c.recommendation,
      successRate: c.successRate,
    })),
    ...extraCrops,
  ].slice(0, 6)

  // Create a location object with the selected municipality for display
  const displayLocation = {
    municipality: selectedLocation.name,
    department: selectedLocation.department,
    altitude: selectedLocation.altitude || 1200,
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">Hola, buen día</p>
          <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
            ¿Qué puedo sembrar hoy?
          </h1>
        </div>
        <DownloadPdfButton pageName="Dashboard-AgroPlan" contentId="pdf-content" />
      </header>

      <div id="pdf-content" className="flex flex-col gap-8 bg-white p-6 rounded-lg">

      <section className="grid gap-4 sm:grid-cols-2">
        <LocationCard location={displayLocation} />
        <WeatherCard weather={currentWeather} />
      </section>

      <section aria-labelledby="rec-title" className="flex flex-col gap-4">
        <h2 id="rec-title" className="sr-only">
          Cultivo recomendado
        </h2>
        <RecommendationCard crop={topCrop} />
      </section>

      <section aria-labelledby="more-title" className="flex flex-col gap-4">
        <h2 id="more-title" className="text-lg font-semibold">
          Más cultivos para ti
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {otherCrops.map((crop) => (
            <CropCard key={crop.id} {...crop} />
          ))}
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
            <p className="font-semibold">{MONTHS_LONG[8]} · Segunda cosecha</p>
            <p className="text-sm text-muted-foreground text-pretty">
              La mejor ventana para sembrar café y fríjol comienza en septiembre, cuando llegan las
              lluvias moderadas.
            </p>
          </div>
        </Card>
      </section>

      <section aria-labelledby="alerts-title" className="flex flex-col gap-4">
        <h2 id="alerts-title" className="text-lg font-semibold">
          Alertas del clima
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {climateAlerts.map((alert) => (
            <ClimateAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}
