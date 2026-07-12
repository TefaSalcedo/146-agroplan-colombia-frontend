"use client"

import { CropImage } from "@/components/crop-image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Layers,
  Thermometer,
  Droplets,
  CloudRain,
  Mountain,
  Waves,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MonthStrip } from "@/components/month-strip"
import { PageLoading } from "@/components/page-loading"
import { useCrop, useCropRecommendations, useCropCalendar } from "@/hooks"
import { useLocation } from "@/context/LocationContext"
import { AIRecommendationCard } from "@/components/ai-recommendation-card"
import { CropCalendarVisualization } from "@/components/crop-calendar-visualization"

const factIcons = {
  soil: Layers,
  temp: Thermometer,
  humidity: Droplets,
  rain: CloudRain,
  altitude: Mountain,
  irrigation: Waves,
}

interface CropDetailViewProps {
  id: string
}

export function CropDetailView({ id }: CropDetailViewProps) {
  const { crop, loading, error } = useCrop(id)
  const { selectedLocation } = useLocation()
  const {
    recommendation,
    loading: recommendationLoading,
    error: recommendationError,
  } = useCropRecommendations(id, selectedLocation?.id ?? "")
  const {
    cropResult,
    loading: calendarLoading,
  } = useCropCalendar(id, selectedLocation?.id ?? "")

  if (loading) {
    return <PageLoading title="Cargando cultivo" />
  }

  const totalLoading = loading || calendarLoading

  if (error || !crop) {
    return (
      <div className="flex flex-col gap-8">
        <Link
          href=".."
          className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a cultivos
        </Link>
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <div>
            <h1 className="text-2xl font-bold">Cultivo no disponible</h1>
            <p className="mt-2 max-w-md text-muted-foreground text-pretty">
              {error || "No se pudieron cargar los datos de este cultivo."}
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="..">Ver otros cultivos</Link>} />
        </Card>
      </div>
    )
  }

  const facts = [
    { icon: factIcons.soil, label: "Tipo de suelo", value: crop.soilType },
    { icon: factIcons.temp, label: "Temperatura ideal", value: crop.idealTemperature },
    { icon: factIcons.humidity, label: "Humedad", value: crop.humidity },
    { icon: factIcons.rain, label: "Precipitación", value: crop.precipitation },
    { icon: factIcons.altitude, label: "Altitud", value: crop.altitude },
    { icon: factIcons.irrigation, label: "Riego", value: crop.irrigation },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Link
        href=".."
        className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a cultivos
      </Link>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="h-full overflow-hidden p-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <CropImage
                src={crop.image || "/placeholder.svg"}
                alt={crop.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
                priority
              />
            </div>
          </Card>
        </div>
        <div className="md:col-span-2 flex flex-col justify-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-balance md:text-3xl">{crop.name}</h1>
            <p className="text-sm italic text-muted-foreground">{crop.scientificName}</p>
          </div>
        </div>
      </div>

      {selectedLocation && (
        <AIRecommendationCard
          cropId={id}
          cropName={crop.name}
          municipalityId={selectedLocation.id}
          municipalityName={selectedLocation.name}
          recommendation={recommendation}
          loading={recommendationLoading}
          error={recommendationError}
        />
      )}

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Calendario de siembra (general)</h2>
          </div>
          <MonthStrip activeMonths={crop.plantingMonths} tone="primary" />
        </Card>
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Waves className="size-4 text-accent-foreground" />
            <h2 className="text-sm font-semibold">Calendario de cosecha (general)</h2>
          </div>
          <MonthStrip activeMonths={crop.harvestMonths} tone="accent" />
        </Card>
      </section>

      <Card className="flex flex-row items-center gap-4 p-6">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Clock className="size-7" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tiempo estimado hasta cosecha</p>
          <p className="text-xl font-bold">
            {crop.daysToHarvest} días{" "}
            <span className="text-base font-normal text-muted-foreground">
              (~{Math.round(crop.daysToHarvest / 30)} meses)
            </span>
          </p>
        </div>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Condiciones ideales</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => {
            const Icon = fact.icon
            return (
              <Card key={fact.label} className="flex items-start gap-3 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{fact.label}</p>
                  <p className="font-medium text-pretty">{fact.value}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">Sustratos recomendados</h2>
        <div className="flex flex-wrap gap-2">
          {crop.substrates.map((s) => (
            <Badge key={s} variant="secondary" className="px-3 py-1.5 text-sm">
              {s}
            </Badge>
          ))}
        </div>
      </section>

      {/* API-based Calendar */}
      {selectedLocation && (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Calendario inteligente de siembra y cosecha</h2>
          <CropCalendarVisualization
            calendarData={cropResult ? { municipalityId: selectedLocation.id, municipalityName: selectedLocation.name, horizonMonths: 12, results: [cropResult], modelVersion: "yield-ensemble-v1" } : null}
            loading={calendarLoading}
          />
        </section>
      )}
    </div>
  )
}
