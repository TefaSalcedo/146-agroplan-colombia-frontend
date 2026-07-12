"use client"

import { useEffect } from "react"
import Image from "next/image"
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
  Leaf,
  Recycle,
  Sprout,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MonthStrip } from "@/components/month-strip"
import { PageLoading } from "@/components/page-loading"
import { useCrop, useCropRecommendations, useCropCalendar } from "@/hooks"
import { useLocation } from "@/context/LocationContext"
import { buildLocationPath } from "@/lib/routing"
import { AIRecommendationCard } from "@/components/ai-recommendation-card"
import { CropCalendarVisualization } from "@/components/crop-calendar-visualization"
import { LandscapeIllustration, SproutPotIllustration, OrganicRingsIllustration } from "@/components/crop-illustrations"

const factIcons = {
  soil: Layers,
  temp: Thermometer,
  humidity: Droplets,
  rain: CloudRain,
  altitude: Mountain,
  irrigation: Waves,
}

const factStyles: Record<
  keyof typeof factIcons,
  { bg: string; icon: string }
> = {
  soil: { bg: 'bg-amber-700', icon: 'text-white' },
  temp: { bg: 'bg-yellow-500', icon: 'text-white' },
  humidity: { bg: 'bg-sky-500', icon: 'text-white' },
  rain: { bg: 'bg-blue-400', icon: 'text-white' },
  altitude: { bg: 'bg-emerald-500', icon: 'text-white' },
  irrigation: { bg: 'bg-teal-500', icon: 'text-white' },
}

interface CropDetailViewProps {
  id: string
}

export function CropDetailView({ id }: CropDetailViewProps) {
  const { crop, loading, error } = useCrop(id)
  const { selectedLocation } = useLocation()
  const cropsHref = selectedLocation
    ? buildLocationPath(selectedLocation.department, selectedLocation.name, 'cultivos')
    : '..'
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
          href={cropsHref}
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
          <Button nativeButton={false} render={<Link href={cropsHref}>Ver otros cultivos</Link>} />
        </Card>
      </div>
    )
  }

  const facts = [
    { key: 'soil' as const, icon: factIcons.soil, label: "Tipo de suelo", value: crop.soilType },
    { key: 'temp' as const, icon: factIcons.temp, label: "Temperatura ideal", value: crop.idealTemperature },
    { key: 'humidity' as const, icon: factIcons.humidity, label: "Humedad", value: crop.humidity },
    { key: 'rain' as const, icon: factIcons.rain, label: "Precipitación", value: crop.precipitation },
    { key: 'altitude' as const, icon: factIcons.altitude, label: "Altitud", value: crop.altitude },
    { key: 'irrigation' as const, icon: factIcons.irrigation, label: "Riego", value: crop.irrigation },
  ]

  return (
    <div className="relative flex flex-col gap-5">
      <div className="pointer-events-none absolute -right-6 -top-6 w-40 opacity-60 sm:w-52">
        <OrganicRingsIllustration className="h-full w-full" />
      </div>

      <Link
        href={cropsHref}
        className="relative flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a cultivos
      </Link>

      <div className="relative grid gap-4 md:grid-cols-3">
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

      <Card className="relative flex flex-row items-center gap-4 overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-2/3 sm:w-1/2">
          <LandscapeIllustration className="h-full w-full" />
        </div>
        <div className="relative flex flex-row items-center gap-4">
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
        </div>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Condiciones ideales</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => {
            const Icon = fact.icon
            const styles = factStyles[fact.key]
            return (
              <Card key={fact.label} className="flex items-start gap-3 p-5">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${styles.bg} ${styles.icon}`}>
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

      <Card className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-90 sm:w-56">
          <SproutPotIllustration className="h-full w-full" />
        </div>
        <div className="relative flex flex-col gap-4">
          <h2 className="text-base font-semibold">Sustratos recomendados</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {crop.substrates.map((s) => {
              const normalized = s.toLowerCase()
              const SubstrateIcon =
                normalized.includes('compost') || normalized.includes('composta')
                  ? Recycle
                  : normalized.includes('orgánica') || normalized.includes('organica') || normalized.includes('humus')
                    ? Leaf
                    : Sprout
              return (
                <div key={s} className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <SubstrateIcon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{s}</p>
                    <p className="text-sm text-muted-foreground">
                      Recomendado para mejorar el desarrollo del cultivo.
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* API-based Calendar */}
      {selectedLocation && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Image
                src="/ai%20images/agroplan.webp"
                alt="Asistente IA de Agroplan"
                width={28}
                height={28}
                className="size-7 rounded-lg object-cover"
              />
            </div>
            <h2 className="text-base font-semibold">Calendario inteligente de siembra y cosecha</h2>
          </div>
          <CropCalendarVisualization
            calendarData={cropResult ? { municipalityId: selectedLocation.id, municipalityName: selectedLocation.name, horizonMonths: 12, results: [cropResult], modelVersion: "yield-ensemble-v1" } : null}
            cropImage={crop.image}
            cropName={crop.name}
            loading={calendarLoading}
          />
        </section>
      )}
    </div>
  )
}
