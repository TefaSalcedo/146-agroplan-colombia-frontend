"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CropImage } from "@/components/crop-image"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  CloudRain,
  Mountain,
  CalendarDays,
  Info,
  Loader2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SuitabilityBadge } from "@/components/recommendation-badge"
import { useCrop, useMunicipalities, useZoning } from "@/hooks"
import { suitabilityColors } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Municipality, Suitability } from "@/types"

interface CropNationwideMapProps {
  municipalities: Municipality[]
  suitabilityMap: Record<string, Suitability>
  selectedId: string | null
  onSelect: (municipality: Municipality) => void
  cropImage?: string
}

const CropNationwideMap = dynamic<CropNationwideMapProps>(
  () => import("@/components/crop-nationwide-map").then((m) => m.CropNationwideMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
  }
)

interface CropMapViewProps {
  cropId: string
}

function successRateFromSuitability(suitability: Suitability, confidence: number): number {
  const base =
    suitability === "high" ? 0.9 : suitability === "medium" ? 0.78 : suitability === "low" ? 0.6 : 0.25
  return Math.round((base * (0.95 + confidence * 0.05)) * 100)
}

export function CropMapView({ cropId }: CropMapViewProps) {
  const router = useRouter()
  const { crop, loading: cropLoading, error: cropError } = useCrop(cropId)
  const { municipalities, loading: municipalitiesLoading } = useMunicipalities()
  const { getMap, loading: zoningLoading, error: zoningError } = useZoning()

  const [suitabilityMap, setSuitabilityMap] = useState<Record<string, Suitability>>({})
  const [confidenceMap, setConfidenceMap] = useState<Record<string, number>>({})
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null)

  useEffect(() => {
    if (!cropId || municipalities.length === 0) return

    const loadPredictions = async () => {
      const result = await getMap(cropId)
      if (!result) return

      const suit: Record<string, Suitability> = {}
      const conf: Record<string, number> = {}

      result.results.forEach((p) => {
        suit[p.municipalityId] = p.suitability
        conf[p.municipalityId] = p.confidence
      })

      setSuitabilityMap(suit)
      setConfidenceMap(conf)
    }

    loadPredictions()
  }, [cropId, municipalities, getMap])

  const cropFacts = useMemo(() => {
    if (!crop) return []
    return [
      { icon: Thermometer, label: "Temperatura ideal", value: crop.idealTemperature },
      { icon: Droplets, label: "Humedad", value: crop.humidity },
      { icon: CloudRain, label: "Precipitación", value: crop.precipitation },
      { icon: Mountain, label: "Altitud", value: crop.altitude },
    ]
  }, [crop])

  const selectedSuitability = selectedMunicipality
    ? suitabilityMap[selectedMunicipality.id] ?? "none"
    : null

  const selectedSuccessRate = selectedMunicipality
    ? successRateFromSuitability(
        selectedSuitability ?? "none",
        confidenceMap[selectedMunicipality.id] ?? 0.7
      )
    : null

  const loading = cropLoading || municipalitiesLoading || zoningLoading
  const error = cropError || zoningError

  const showMapLoader = municipalitiesLoading || zoningLoading

  if (cropLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin" />
          <p>Cargando cultivo...</p>
        </div>
      </div>
    )
  }

  if (error || !crop) {
    return (
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <h1 className="text-2xl font-bold">Cultivo no disponible</h1>
          <p className="max-w-md text-muted-foreground text-pretty">
            {error || "No se pudieron cargar los datos de este cultivo."}
          </p>
          <Button onClick={() => router.push("/")}>Elegir otro cultivo</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70svh] flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b bg-background p-4 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CropImage src={crop.image} alt={crop.name} className="size-16 rounded-xl object-cover" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{crop.name}</h1>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Mapa Nacional
              </span>
            </div>
            <p className="text-pretty text-muted-foreground">
              Explora dónde se puede sembrar {crop.name.toLowerCase()} y qué tan favorable es cada zona en Colombia.
            </p>
          </div>
        </div>
      </div>

      {/* Map section */}
      <div className="relative h-[60svh] w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 text-white">
          <div>
            <h2 className="font-semibold">Mapa de aptitud</h2>
            <p className="text-xs text-white/80">Toca un punto para ver el porcentaje de éxito estimado.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="hidden flex-col gap-1 text-xs sm:flex">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full" style={{ backgroundColor: suitabilityColors.high }} />
                <span>Alta</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full" style={{ backgroundColor: suitabilityColors.medium }} />
                <span>Media</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full" style={{ backgroundColor: suitabilityColors.low }} />
                <span>Baja</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-full w-full">
          {showMapLoader && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Calculando aptitud en Colombia...</p>
            </div>
          )}
          <CropNationwideMap
            municipalities={municipalities}
            suitabilityMap={suitabilityMap}
            selectedId={selectedMunicipality?.id ?? null}
            onSelect={setSelectedMunicipality}
            cropImage={crop.image}
          />
        </div>

        {selectedMunicipality && selectedSuitability && (
          <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-72">
            <div className="space-y-2">
              <div>
                <p className="text-lg font-semibold leading-tight">{selectedMunicipality.name}</p>
                <p className="text-sm text-muted-foreground">{selectedMunicipality.department}</p>
              </div>
              <div className="flex items-center justify-between">
                <SuitabilityBadge level={selectedSuitability} />
                <span className="text-lg font-bold text-primary">{selectedSuccessRate}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Probabilidad estimada de éxito para {crop.name.toLowerCase()} en esta zona.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info sections */}
      <div className="flex flex-col gap-6 bg-background p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div id="crop-calendar-section">
            <Card className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-5 text-primary" />
                  <h2 className="font-semibold">Calendario de siembra</h2>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {crop.plantingMonths.length} meses
                </span>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground">
                  {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
                    <div key={i} className="text-center font-medium">
                      {m}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 12 }, (_, i) => {
                    const isActive = crop.plantingMonths.includes(i + 1)
                    return (
                      <div
                        key={i}
                        className={cn(
                          "h-6 rounded-sm transition-colors",
                          isActive ? "bg-primary shadow-sm" : "bg-muted/40"
                        )}
                        title={isActive ? `Mes ${i + 1} recomendado` : `Mes ${i + 1} no recomendado`}
                      />
                    )
                  })}
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-sm bg-primary" />
                    <span>Época ideal</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-sm bg-muted/40" />
                    <span>No recomendado</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div id="crop-temperature-section">
            <Card className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <Thermometer className="size-5 text-primary" />
                <h2 className="font-semibold">Condiciones ideales</h2>
              </div>
              <div className="grid gap-3">
                {cropFacts.map((fact) => {
                  const Icon = fact.icon
                  return (
                    <div key={fact.label} className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{fact.label}</p>
                        <p className="text-sm font-medium">{fact.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
