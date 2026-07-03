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
import { MONTHS_LONG } from '@/lib/mock-data'
import { api, ApiError } from '@/lib/api'
import type { Crop, Weather, Municipality } from '@/types'

export default function InicioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Municipality | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Check if user has selected a location
    if (typeof window !== 'undefined') {
      const storedLocation = sessionStorage.getItem('selectedLocation')
      if (!storedLocation) {
        // Redirect to landing page if no location selected
        router.push('/')
        return
      }

      const location = JSON.parse(storedLocation)
      setSelectedLocation(location)
      
      // Load data from API
      loadData(location.id)
    }
  }, [router])

  const loadData = async (municipalityId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch weather and recommendations in parallel
      const [weatherData, recommendationsData] = await Promise.all([
        api.weather.get(municipalityId),
        api.recommendations.get(municipalityId),
      ])
      
      setWeather(weatherData)
      setRecommendations(recommendationsData)
    } catch (err) {
      console.error('Error loading data:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Error loading data')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !selectedLocation) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  const topCrop = recommendations?.top_crop
  const otherCrops = recommendations?.other_crops || []
  const nextSeason = recommendations?.next_planting_season

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
        <DownloadPdfButton pageName="Dashboard-AgroPlan" />
      </header>

      <div id="pdf-content" className="flex flex-col gap-8 bg-white p-6 rounded-lg">

      <section className="grid gap-4 sm:grid-cols-2">
        <LocationCard location={displayLocation} />
        <WeatherCard weather={weather} />
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
            <p className="font-semibold">
              {nextSeason ? `${nextSeason.month_name} · Temporada de siembra` : MONTHS_LONG[8] + ' · Segunda cosecha'}
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              {nextSeason && nextSeason.crops.length > 0
                ? `Cultivos recomendados: ${nextSeason.crops.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}.`
                : 'La mejor ventana para sembrar café y fríjol comienza en septiembre, cuando llegan las lluvias moderadas.'}
            </p>
          </div>
        </Card>
      </section>

      <section aria-labelledby="alerts-title" className="flex flex-col gap-4">
        <h2 id="alerts-title" className="text-lg font-semibold">
          Alertas del clima
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ClimateAlertCard alert={{
            id: '1',
            type: 'warning',
            title: 'Lluvias moderadas',
            description: 'Se esperan lluvias moderadas en los próximos días, ideal para la siembra.',
          }} />
          <ClimateAlertCard alert={{
            id: '2',
            type: 'info',
            title: 'Temperatura estable',
            description: 'Las temperaturas se mantienen dentro de los rangos óptimos.',
          }} />
        </div>
      </section>
      </div>
    </div>
  )
}
