"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Sprout,
  Wheat,
  Clock,
  Layers,
  Thermometer,
  Droplets,
  CloudRain,
  Mountain,
  Waves,
  Lightbulb,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SuccessIndicator } from "@/components/success-indicator"
import { RecommendationBadge } from "@/components/recommendation-badge"
import { Timeline } from "@/components/timeline"
import { MonthStrip } from "@/components/month-strip"
import { CropDownloadButtons } from "@/components/crop-download-buttons"
import { PageLoading } from "@/components/page-loading"
import { useCrop } from "@/hooks"

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

  if (loading) {
    return <PageLoading title="Cargando cultivo" />
  }

  if (error || !crop) {
    return (
      <div className="flex flex-col gap-8">
        <Link
          href="/cultivos"
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
          <Button nativeButton={false} render={<Link href="/cultivos">Ver otros cultivos</Link>} />
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
        href="/cultivos"
        className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a cultivos
      </Link>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="overflow-hidden p-0 h-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
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
        <div className="md:col-span-2 flex flex-col gap-3 justify-center">
          <div>
            <RecommendationBadge level={crop.recommendation} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{crop.name}</h1>
            <p className="italic text-sm text-muted-foreground">{crop.scientificName}</p>
          </div>
          <SuccessIndicator value={crop.successRate} />
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">¿Por qué te lo recomendamos?</h2>
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{crop.reason}</p>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Sprout className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Calendario de siembra</h2>
          </div>
          <MonthStrip activeMonths={crop.plantingMonths} tone="primary" />
        </Card>
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Wheat className="size-4 text-accent-foreground" />
            <h2 className="text-sm font-semibold">Calendario de cosecha</h2>
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

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Ciclo del cultivo</h2>
        <Card className="p-4">
          <Timeline stages={crop.stages} />
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Consejos importantes</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {crop.tips.map((tip) => (
            <Card key={tip.title} className="flex flex-col gap-2 p-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Lightbulb className="size-5" />
              </div>
              <p className="font-semibold">{tip.title}</p>
              <p className="text-sm text-muted-foreground text-pretty">{tip.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Descargar información</h2>
        <CropDownloadButtons cropName={crop.name} />
      </section>
    </div>
  )
}
