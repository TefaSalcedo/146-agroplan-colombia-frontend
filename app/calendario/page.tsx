"use client"

import { useMemo, useState } from "react"
import { Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DownloadPdfButton } from "@/components/download-pdf-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CropCard } from "@/components/crop-card"
import {
  crops,
  extraCrops,
  municipalities,
  generateCalendar,
  MONTHS_LONG,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

const ratingStyles = {
  ideal: "bg-primary text-primary-foreground",
  acceptable: "bg-accent text-accent-foreground",
  notRecommended: "bg-muted text-muted-foreground",
}

export default function CalendarioPage() {
  const [municipalityId, setMunicipalityId] = useState(municipalities[0].id)
  const [cropId, setCropId] = useState(crops[0].id)

  const currentMonth = new Date().getMonth()
  const seed = useMemo(() => {
    const mIndex = municipalities.findIndex((m) => m.id === municipalityId)
    const cIndex = crops.findIndex((c) => c.id === cropId)
    return (mIndex + 1) * 31 + (cIndex + 1) * 7 + currentMonth
  }, [municipalityId, cropId, currentMonth])

  const days = useMemo(() => generateCalendar(seed), [seed])
  // simple offset so grid looks like a real month
  const startOffset = seed % 7

  const idealCount = days.filter((d) => d.rating === "ideal").length

  const otherCrops = [...crops, ...extraCrops]
    .filter((c) => c.id !== cropId)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      recommendation: c.recommendation,
      successRate: c.successRate,
    }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Calendario agrícola</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            ¿Qué puedo sembrar este mes? Elige tu municipio y cultivo.
          </p>
        </div>
        <DownloadPdfButton pageName="Calendario-AgroPlan" contentId="pdf-calendario" />
      </div>

      <div id="pdf-calendario" className="flex flex-col gap-6 bg-white p-6 rounded-lg">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          value={municipalityId}
          onValueChange={setMunicipalityId}
          items={Object.fromEntries(municipalities.map((m) => [m.id, m.name]))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Municipio" />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={cropId}
          onValueChange={setCropId}
          items={Object.fromEntries(crops.map((c) => [c.id, c.name]))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cultivo" />
          </SelectTrigger>
          <SelectContent>
            {crops.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold capitalize">{MONTHS_LONG[currentMonth]}</h2>
          <span className="text-sm text-muted-foreground">{idealCount} días ideales</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="pb-1 text-center text-xs font-medium text-muted-foreground">
              {wd}
            </div>
          ))}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} aria-hidden />
          ))}
          {days.map((d) => (
            <div
              key={d.day}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-sm font-medium tabular-nums transition-transform hover:scale-105",
                ratingStyles[d.rating],
              )}
            >
              {d.day}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-2 text-sm">
          <Legend className="bg-primary" label="Ideal para sembrar" />
          <Legend className="bg-accent" label="Aceptable" />
          <Legend className="bg-muted" label="No recomendado" />
        </div>
      </Card>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Próximos cultivos recomendados</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {otherCrops.map((crop) => (
            <CropCard key={crop.id} {...crop} />
          ))}
        </div>
      </section>

      <Card className="flex flex-row items-start gap-3 border-dashed p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <Info className="size-5" />
        </div>
        <div>
          <p className="font-medium">¿No hay suficientes datos?</p>
          <p className="text-sm text-muted-foreground text-pretty">
            Cuando el modelo tiene pocos datos de tu municipio, te sugiere cultivos similares con
            condiciones parecidas para que igual tengas una recomendación confiable.
          </p>
        </div>
      </Card>
      </div>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <span className={cn("size-4 rounded", className)} aria-hidden />
      {label}
    </span>
  )
}
