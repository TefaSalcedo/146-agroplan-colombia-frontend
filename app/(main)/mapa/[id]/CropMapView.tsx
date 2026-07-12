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
  XCircle,
  AlertCircle,
  MapPin,
  Sparkles,
  Sprout,
  Layers,
  Waves,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SuitabilityBadge } from "@/components/recommendation-badge"
import { useCrop, useCropNationalGuide, useMunicipalities, useZoning } from "@/hooks"
import { mapSuitabilityColors } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Suitability } from "@/types"
import type { ZoningMapMunicipalityResult } from "@/lib/api-client/types"

interface CropNationwideMapProps {
  results: ZoningMapMunicipalityResult[]
  departmentsByMunicipality: Record<string, string>
  selectedId: string | null
  onSelect: (municipality: ZoningMapMunicipalityResult & { department: string }) => void
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
  const { municipalities } = useMunicipalities()
  const { getMap, loading: zoningLoading, error: zoningError } = useZoning()
  const { guide: nationalGuide, loading: guideLoading, error: guideError } = useCropNationalGuide(cropId)

  const [zoningResults, setZoningResults] = useState<ZoningMapMunicipalityResult[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    (ZoningMapMunicipalityResult & { department: string }) | null
  >(null)

  const departmentsByMunicipality = useMemo(
    () => Object.fromEntries(municipalities.map((municipality) => [municipality.id, municipality.department])),
    [municipalities],
  )

  useEffect(() => {
    if (!cropId) return

    const loadPredictions = async () => {
      const result = await getMap(cropId)
      if (!result) return
      setZoningResults(result.results)
    }

    loadPredictions()
  }, [cropId, getMap])

  const cropFacts = useMemo(() => {
    if (!crop) return []
    return [
      { icon: Thermometer, label: "Temperatura ideal", value: crop.idealTemperature },
      { icon: Droplets, label: "Humedad", value: crop.humidity },
      { icon: CloudRain, label: "Precipitación", value: crop.precipitation },
      { icon: Mountain, label: "Altitud", value: crop.altitude },
      { icon: Layers, label: "Tipo de suelo", value: crop.soilType },
      { icon: Waves, label: "Riego", value: crop.irrigation },
    ]
  }, [crop])

  const selectedSuitability = selectedMunicipality
    ? selectedMunicipality.suitability
    : null

  const selectedSuccessRate = selectedMunicipality
    ? successRateFromSuitability(
        selectedSuitability ?? "none",
        selectedMunicipality.confidence,
      )
    : null

  const error = cropError || zoningError

  const showMapLoader = zoningLoading

  if (cropLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Cargando información del cultivo...</p>
          <p className="text-sm text-muted-foreground">Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  if (error || !crop) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-4 flex justify-center">
            <XCircle className="size-16 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Cultivo no disponible</h1>
          <p className="mb-6 text-muted-foreground">
            {error || "No se pudieron cargar los datos de este cultivo."}
          </p>
          <Button onClick={() => router.push("/")} size="lg" className="w-full">
            <ArrowLeft className="mr-2 size-4" />
            Volver al inicio
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header Section */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
          <div className="flex-shrink-0">
            <CropImage
              src={crop.image}
              alt={crop.name}
              fill={false}
              width={128}
              height={128}
              className="size-24 rounded-2xl object-cover shadow-lg md:size-32"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{crop.name}</h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                  <MapPin className="size-4" />
                  Mapa Nacional
                </span>
              </div>
            </div>
            <p className="text-lg text-muted-foreground md:text-xl">
              Explora dónde se puede sembrar {crop.name.toLowerCase()} y qué tan favorable es cada zona en Colombia.
            </p>
            <p className="text-sm text-muted-foreground italic">{crop.scientificName}</p>
          </div>
        </div>
      </Card>

      {/* Map Section */}
      <Card className="overflow-hidden border-2 p-0">
        <div className="relative h-[60vh] min-h-[480px]">
          {/* Map Header Overlay */}
          <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-3 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-4 text-white md:flex-row md:items-center md:justify-between md:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold md:text-xl">Mapa de aptitud</h2>
              <p className="text-sm text-white/90 md:text-base">
                Acerca el mapa para separar municipios y selecciona uno para ver su aptitud
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm md:flex-nowrap md:justify-end">
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: mapSuitabilityColors.high }} />
                <span className="font-medium">Alta aptitud</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: mapSuitabilityColors.medium }} />
                <span className="font-medium">Aptitud media</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: mapSuitabilityColors.low }} />
                <span className="font-medium">Aptitud baja</span>
              </div>
            </div>
          </div>

          {/* Map Content */}
          <div className="relative h-full">
            {showMapLoader && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/90 backdrop-blur-sm">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="text-base font-medium">Calculando aptitud en Colombia...</p>
                <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
              </div>
            )}
            <CropNationwideMap
              results={zoningResults}
              departmentsByMunicipality={departmentsByMunicipality}
              selectedId={selectedMunicipality?.municipalityId ?? null}
              onSelect={setSelectedMunicipality}
            />
          </div>

          {/* Selected Municipality Card */}
          {selectedMunicipality && selectedSuitability && crop && (
            <div className="absolute inset-x-4 bottom-4 z-10 max-h-[70vh] overflow-y-auto rounded-2xl border-2 border-border bg-card/95 p-5 shadow-2xl backdrop-blur-sm md:inset-x-auto md:right-4 md:bottom-4 md:w-96">
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-bold leading-tight">{selectedMunicipality.municipalityName}</p>
                  <p className="text-base text-muted-foreground">{selectedMunicipality.department}</p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Aptitud</span>
                    <SuitabilityBadge level={selectedSuitability} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Éxito estimado</span>
                    <span className="text-2xl font-bold text-primary">{selectedSuccessRate}%</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Confianza del modelo</p>
                  <p className="mt-1 text-lg font-bold">{Math.round(selectedMunicipality.confidence * 100)}%</p>
                </div>
                {selectedMunicipality.method && (
                  <p className="text-xs text-muted-foreground">
                    Método: <span className="font-medium">{selectedMunicipality.method}</span>
                  </p>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Probabilidad estimada de éxito para {crop.name.toLowerCase()} en esta zona.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedMunicipality(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Information Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar Section */}
        <Card id="crop-calendar-section" className="border-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Calendario de siembra</h2>
                <p className="text-sm text-muted-foreground">Mejores épocas para sembrar</p>
              </div>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
              {crop.plantingMonths.length} meses
            </span>
          </div>

          <div className="space-y-4">
            {/* Month Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-1 text-xs font-bold text-muted-foreground">
                {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
                  <div key={i} className="text-center py-1">
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
                        "h-8 rounded-md transition-all duration-200 hover:scale-105",
                        isActive
                          ? "bg-primary shadow-md cursor-pointer"
                          : "bg-muted/40 cursor-not-allowed"
                      )}
                      title={isActive ? `Mes ${i + 1}: Recomendado` : `Mes ${i + 1}: No recomendado`}
                      role="gridcell"
                      aria-label={`Mes ${i + 1}: ${isActive ? "Recomendado" : "No recomendado"}`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-4 items-center justify-center rounded bg-primary" />
                <span className="text-sm font-medium">Época ideal de siembra</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-4 items-center justify-center rounded bg-muted/40" />
                <span className="text-sm font-medium text-muted-foreground">No recomendado</span>
              </div>
            </div>

            {/* Info Tip */}
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
              <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-muted-foreground">
                Siembra en los meses marcados para mejores resultados. Consulta con un técnico agrícola local para recomendaciones específicas.
              </p>
            </div>
          </div>
        </Card>

        {/* Conditions Section */}
        <Card id="crop-temperature-section" className="border-2 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Thermometer className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Condiciones ideales</h2>
              <p className="text-sm text-muted-foreground">Requisitos del cultivo</p>
            </div>
          </div>

          <div className="space-y-3">
            {cropFacts.map((fact) => {
              const Icon = fact.icon
              return (
                <div
                  key={fact.label}
                  className="flex items-start gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold uppercase text-muted-foreground">{fact.label}</p>
                    <p className="text-lg font-bold">{fact.value}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Importante</p>
                <p className="text-muted-foreground">
                  Estas son condiciones generales. Las condiciones locales pueden variar. Consulta con un experto agrícola antes de sembrar.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Manejo del cultivo</h2>
            <p className="text-sm text-muted-foreground">Información técnica del perfil agrícola</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Sustratos recomendados</h3>
            <div className="flex flex-wrap gap-2">
              {crop.substrates.map((substrate) => (
                <span key={substrate} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                  {substrate}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Etapas de desarrollo</h3>
            <ul className="space-y-2 text-sm">
              {crop.stages.map((stage) => (
                <li key={stage.label}>
                  <p className="font-medium">{stage.label}</p>
                  <p className="text-muted-foreground">{stage.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Consejos del cultivo</h3>
            <ul className="space-y-2 text-sm">
              {crop.tips.map((tip) => (
                <li key={tip.title}>
                  <p className="font-medium">{tip.title}</p>
                  <p className="text-muted-foreground">{tip.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">Recomendaciones nacionales</h2>
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                Recomendación de IA
              </span>
            </div>
            {guideLoading && <p className="text-sm text-muted-foreground">Generando guía nacional...</p>}
            {guideError && <p className="text-sm text-muted-foreground">{guideError}</p>}
            {nationalGuide && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">{nationalGuide.summary}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {nationalGuide.sections.map((section) => (
                    <div key={section.title} className="rounded-xl border border-primary/15 bg-card/70 p-4">
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Esta guía fue generada por IA para orientación general. Valida las decisiones de manejo con asistencia técnica local.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/")}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}