"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { DownloadPdfButton } from "@/components/download-pdf-button"
import { PageLoading } from "@/components/page-loading"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CropCard } from "@/components/crop-card"
import { MONTHS_LONG } from "@/lib/constants"
import { useMunicipalities, useCrops, useCalendars } from "@/hooks"
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from "@/lib/routing"
import { cn } from "@/lib/utils"
import type { Municipality, Crop } from "@/types"

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

const ratingStyles = {
  ideal: "bg-primary text-primary-foreground",
  acceptable: "bg-accent text-accent-foreground",
  notRecommended: "bg-muted text-muted-foreground",
}

export default function CalendarioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()
  const { municipalities: municipalitiesData, loading: municipalitiesLoading, error: municipalitiesError } = useMunicipalities(selectedLocation?.department)
  const { crops: cropsData, loading: cropsLoading, error: cropsError } = useCrops()
  const { predict, loading: calendarLoading, error: calendarError } = useCalendars()

  const [municipalityId, setMunicipalityId] = useState<string>("")
  const [cropId, setCropId] = useState<string>("")
  const [calendar, setCalendar] = useState<any>(null)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setMounted(true)

    // Redirect to landing page if no location selected
    if (!selectedLocation && mounted) {
      router.push('/')
    }
  }, [selectedLocation, mounted, router])

  useEffect(() => {
    if (municipalitiesData.length > 0 && !municipalityId) {
      // Preselect the selected location municipality if available
      if (selectedLocation && municipalitiesData.find(m => m.id === selectedLocation.id)) {
        setMunicipalityId(selectedLocation.id)
      } else {
        setMunicipalityId(municipalitiesData[0].id)
      }
    }
    if (cropsData.length > 0 && !cropId) {
      setCropId(cropsData[0].id)
    }
  }, [municipalitiesData, cropsData, selectedLocation])

  useEffect(() => {
    if (municipalityId && cropId) {
      loadCalendar()
    }
  }, [municipalityId, cropId])

  const loadCalendar = async () => {
    const calendarData = await predict({
      crop_id: cropId,
      municipality_id: municipalityId,
      month: currentMonth + 1, // API expects 1-based month
      year: currentYear,
    })
    if (calendarData) {
      setCalendar(calendarData)
    }
  }

  const loading = municipalitiesLoading || cropsLoading
  const error = municipalitiesError || cropsError || calendarError

  if (!mounted || !selectedLocation) {
    return null
  }

  const days = calendar?.days || []
  const idealCount = calendar?.idealCount || 0
  const startOffset = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7 // 0 = Monday, aligning with WEEKDAYS

  const otherCrops = cropsData
    .filter((c) => c.id !== cropId)
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      recommendation: c.recommendation,
      successRate: c.successRate,
    }))

  const cropsBasePath = selectedLocation
    ? buildLocationPath(selectedLocation.department, selectedLocation.name, 'cultivos')
    : '/cultivos'

  if (loading) {
    return <PageLoading title="Calendario agrícola" />
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Calendario agrícola</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            ¿Qué puedo sembrar este mes? Elige tu municipio y cultivo.
          </p>
        </div>
        <DownloadPdfButton pageName="Calendario-AgroPlan" />
      </div>

      <div id="pdf-calendario" className="flex flex-col gap-6 bg-white p-6 rounded-lg">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            value={municipalityId}
            onValueChange={(value) => setMunicipalityId(value)}
            items={Object.fromEntries(municipalitiesData.map((m) => [m.id, m.name]))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Municipio" />
            </SelectTrigger>
            <SelectContent>
              {municipalitiesData.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={cropId}
            onValueChange={(value) => setCropId(value)}
            items={Object.fromEntries(cropsData.map((c) => [c.id, c.name]))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cultivo" />
            </SelectTrigger>
            <SelectContent>
              {cropsData.map((c) => (
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
            {days.map((d: any) => (
              <div
                key={d.day}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-sm font-medium tabular-nums transition-transform hover:scale-105",
                  ratingStyles[d.rating as keyof typeof ratingStyles],
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
              <CropCard key={crop.id} {...crop} href={`${cropsBasePath}/${crop.id}`} />
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
