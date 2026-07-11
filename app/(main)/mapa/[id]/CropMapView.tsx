"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  CloudRain,
  Mountain,
  Waves,
  Layers,
  Sprout,
  CalendarDays,
  Info,
  Loader2,
  MapPin,
  X,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SuitabilityBadge } from "@/components/recommendation-badge"
import { MonthStrip } from "@/components/month-strip"
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
  const { predictBatch, loading: zoningLoading, error: zoningError } = useZoning()

  const [suitabilityMap, setSuitabilityMap] = useState<Record<string, Suitability>>({})
  const [confidenceMap, setConfidenceMap] = useState<Record<string, number>>({})
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [showMapInfoCards, setShowMapInfoCards] = useState(true)

  useEffect(() => {
    if (!cropId || municipalities.length === 0) return

    const loadPredictions = async () => {
      const result = await predictBatch({ crop_id: cropId })
      if (!result) return

      const suit: Record<string, Suitability> = {}
      const conf: Record<string, number> = {}

      result.predictions.forEach((p) => {
        suit[p.municipalityId] = p.suitability
        conf[p.municipalityId] = p.confidence
      })

      setSuitabilityMap(suit)
      setConfidenceMap(conf)
    }

    loadPredictions()
  }, [cropId, municipalities, predictBatch])

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
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-shrink-0 flex-col gap-2 border-b bg-background p-4 lg:p-6">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {crop.name} en Colombia
        </h1>
        <p className="text-muted-foreground text-pretty">
          Explora dónde se puede sembrar {crop.name.toLowerCase()} y qué tan favorable es cada zona.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width */}
        <div className="hidden w-[300px] flex-shrink-0 flex-col gap-4 overflow-y-auto border-r bg-background p-4 xl:flex 2xl:w-[360px] 2xl:p-6">
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
              <Image
                src={crop.image || "/placeholder.svg"}
                alt={crop.name}
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm italic opacity-90">{crop.scientificName}</p>
                <p className="text-xl font-bold">{crop.name}</p>
              </div>
            </div>
          </Card>

          

          <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="size-5 text-primary" />
                <h2 className="font-semibold">Calendario de siembra</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {crop.plantingMonths.length} meses
              </span>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground">
                {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
                  <div key={i} className="text-center font-medium">{m}</div>
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
                        isActive
                          ? "bg-primary shadow-sm"
                          : "bg-muted/40"
                      )}
                      title={isActive ? `Mes ${i + 1} recomendado` : `Mes ${i + 1} no recomendado`}
                    />
                  )
                })}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border/50">
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

          <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <Info className="size-5 text-primary" />
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

        {/* Map - Full remaining space */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 text-white">
            <div>
              <h2 className="font-semibold">Mapa de aptitud</h2>
              <p className="text-xs text-white/80">
                Toca un punto para ver el porcentaje de éxito estimado.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="hidden flex-col gap-1 text-xs sm:flex">
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: suitabilityColors.high }}
                  />
                  <span>Alta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: suitabilityColors.medium }}
                  />
                  <span>Media</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: suitabilityColors.low }}
                  />
                  <span>Baja</span>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="hidden h-8 rounded-full border border-white/30 bg-white/10 px-3 text-xs text-white hover:bg-white/20 xl:inline-flex"
                onClick={() => setShowMapInfoCards((prev) => !prev)}
              >
                {showMapInfoCards ? <EyeOff className="mr-1 size-3.5" /> : <Eye className="mr-1 size-3.5" />}
                {showMapInfoCards ? "Ocultar cards" : "Mostrar cards"}
              </Button>
            </div>
          </div>

          {showMapInfoCards && (
            <div className="absolute right-4 top-20 z-10 hidden max-h-[calc(100%-120px)] w-[320px] flex-col gap-3 overflow-y-auto xl:flex 2xl:w-[340px]">
              <Card className="space-y-3 p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Recomendaciones de manejo</h3>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>• Tipo de suelo: {crop.soilType}</p>
                  <p>• Riego: {crop.irrigation}</p>
                  <p>• Sustratos recomendados: {crop.substrates.join(", ")}</p>
                </div>
              </Card>

              <Card className="space-y-3 p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Mountain className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Consejos prácticos</h3>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {crop.tips.slice(0, 3).map((tip, index) => (
                    <p key={index}>• {tip.title}: {tip.description}</p>
                  ))}
                </div>
              </Card>

              <Card className="space-y-3 p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Información de cosecha</h3>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>• Días a cosecha: {crop.daysToHarvest} días</p>
                  <p>• Meses de cosecha: {crop.harvestMonths.join(", ")}</p>
                  <p>• Tasa de éxito: {crop.successRate}%</p>
                </div>
              </Card>
            </div>
          )}

          <div className="relative flex-1">
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

        {/* Mobile drawer overlay */}
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl border-t bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 xl:hidden",
            isMobileDrawerOpen ? "translate-y-0" : "translate-y-[calc(100%-64px)]"
          )}
          style={{ maxHeight: "85vh" }}
        >
          {/* Drawer Handle / Header */}
          <div 
            className="flex flex-col items-center px-4 pt-3 pb-2 cursor-pointer bg-background rounded-t-3xl z-10"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          >
            <div className="mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
            <div className="flex w-full items-center justify-between">
              <h2 className="text-base font-semibold">Ver información del cultivo</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8 rounded-full" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsMobileDrawerOpen(!isMobileDrawerOpen); 
                }}
              >
                {isMobileDrawerOpen ? <X className="size-4" /> : <ChevronUp className="size-4" />}
              </Button>
            </div>
          </div>
          
          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-4">
            <div className="flex items-start gap-4 mb-2 mt-2">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={crop.image || "/placeholder.svg"}
                  alt={crop.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold leading-none">{crop.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {crop.scientificName}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  Cultivo de alto valor nutricional, ideal para diferentes regiones de Colombia.
                </p>
              </div>
            </div>

            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Días a cosecha</p>
                  <p className="text-xl font-bold">{crop.daysToHarvest} - {crop.daysToHarvest + 20} días</p>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays className="size-5" />
                </div>
              </div>
            </Card>

            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <Sprout className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Calendario de siembra</h3>
              </div>
              <p className="text-xs text-muted-foreground">Épocas recomendadas</p>
              <MonthStrip activeMonths={crop.plantingMonths} tone="primary" />
            </Card>

            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Condiciones ideales</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {cropFacts.slice(0, 4).map((fact) => {
                  const Icon = fact.icon
                  return (
                    <div key={fact.label} className="flex items-start gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">{fact.label}</span>
                        <span className="text-xs font-medium">{fact.value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="flex flex-col gap-3 p-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Sustratos recomendados
              </h3>
              <div className="flex flex-wrap gap-2">
                {crop.substrates.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-secondary/50 px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2">
                <Sprout className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Recomendaciones de manejo</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                <li>Realiza rotación de cultivos para mejorar el suelo.</li>
                <li>Mantén el suelo con buena humedad.</li>
                {crop.tips.slice(0, 2).map((tip, index) => (
                  <li key={index}>{tip.title}: {tip.description}</li>
                ))}
              </ul>
            </Card>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">
              Ver recomendaciones
              <ArrowLeft className="ml-2 size-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
