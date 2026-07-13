"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Droplets,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Sparkles,
  Sprout,
  XCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CropMapSidebar } from "@/components/crop-map-sidebar"
import { CropConditionsCard } from "@/components/crop-conditions-card"
import { DynamicAiLoadingMessage } from "@/components/dynamic-ai-loading-message"
import { useCrop, useCropNationalGuide, useCropsLite, useMunicipalities, useZoning } from "@/hooks"
import { mapSuitabilityColors } from "@/lib/constants"
import type { CropNationalGuideResponse, ZoningMapMunicipalityResult } from "@/lib/api-client/types"

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
  },
)

interface CropMapViewProps {
  cropId: string
}

function NationalGuideSkeleton() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-5 md:p-6">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
        <DynamicAiLoadingMessage isLoading className="py-1" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </Card>
  )
}

function DisabledNationalGuide() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sprout className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Recomendaciones IA</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Las recomendaciones inteligentes aún no se encuentran disponibles para este cultivo.
          </p>
        </div>
        <div className="grid w-full max-w-xl gap-2 text-left text-sm text-muted-foreground sm:grid-cols-2">
          {["Manejo", "Fertilización", "Plagas", "Riego", "Cosecha", "Buenas prácticas"].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg bg-background/70 px-3 py-2">
              <span className="font-bold text-primary">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function NationalGuideError() {
  return (
    <Card className="border-destructive/20 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="space-y-1">
          <h2 className="font-semibold">No fue posible obtener las recomendaciones inteligentes.</h2>
          <p className="text-sm text-muted-foreground">Intenta nuevamente más tarde.</p>
        </div>
      </div>
    </Card>
  )
}

function NationalGuideContent({ guide }: { guide: CropNationalGuideResponse }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-5 md:p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">Recomendaciones Inteligentes</h2>
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">IA</span>
            </div>
            <p className="text-sm text-muted-foreground">Generadas por IA para este cultivo</p>
          </div>
        </div>

        {guide.summary && (
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed">{guide.summary}</p>
          </div>
        )}

        {guide.sections.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {guide.sections.map((section, index) => {
              const Icon = section.title.toLowerCase().includes("riego")
                ? Droplets
                : section.title.toLowerCase().includes("sembr")
                  ? CalendarDays
                  : section.title.toLowerCase().includes("fert")
                    ? Leaf
                    : Sprout

              return (
                <div key={`${section.title}-${index}`} className="rounded-xl border border-primary/15 bg-card/70 p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Esta guía fue generada por IA para orientación general. Valida las decisiones de manejo con asistencia técnica local.
        </p>
      </div>
    </Card>
  )
}

function NationalGuide({ guide, loading, error }: {
  guide: CropNationalGuideResponse | null
  loading: boolean
  error: string | null
}) {
  if (loading) return <NationalGuideSkeleton />
  if (error || guide?.status === "error") return <NationalGuideError />
  if (guide?.status === "llm_disabled") return <DisabledNationalGuide />
  if (guide) return <NationalGuideContent guide={guide} />
  return null
}

export function CropMapView({ cropId }: CropMapViewProps) {
  const router = useRouter()
  const { crop, loading: cropLoading, error: cropError } = useCrop(cropId)
  const cropReady = Boolean(crop) && !cropLoading
  const { crops: catalogCrops } = useCropsLite()
  const { municipalities } = useMunicipalities()
  const { getMap, loading: zoningLoading, error: zoningError } = useZoning()
  const { guide: nationalGuide, loading: guideLoading, error: guideError } = useCropNationalGuide(cropReady ? cropId : "")

  const [zoningResults, setZoningResults] = useState<ZoningMapMunicipalityResult[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    (ZoningMapMunicipalityResult & { department: string }) | null
  >(null)
  const [showMapLegend, setShowMapLegend] = useState(true)
  const [showCropConditions, setShowCropConditions] = useState(false)

  const departmentsByMunicipality = useMemo(
    () => Object.fromEntries(municipalities.map((municipality) => [municipality.id, municipality.department])),
    [municipalities],
  )

  useEffect(() => {
    if (!cropId || !cropReady) {
      setZoningResults([])
      return
    }

    let cancelled = false
    setZoningResults([])

    const loadPredictions = async () => {
      const result = await getMap(cropId)
      if (cancelled || !result) return
      setZoningResults(result.results)
    }

    loadPredictions()

    return () => {
      cancelled = true
    }
  }, [cropId, cropReady, getMap])

  const error = cropError || zoningError

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-4 flex justify-center">
            <XCircle className="size-16 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Cultivo no disponible</h1>
          <p className="mb-6 text-muted-foreground">{error || "No se pudieron cargar los datos de este cultivo."}</p>
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
      <Card className="overflow-hidden rounded-2xl border-2 p-0">
        <div className="relative h-[60vh]">
          <div className="absolute right-4 top-4 z-10 flex items-start gap-2">
            {showMapLegend && (
              <div className="rounded-xl border border-white/40 bg-background/70 p-3 text-xs text-foreground shadow-xl backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="font-semibold">Aptitud</span>
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                    onClick={() => setShowMapLegend(false)}
                    aria-label="Ocultar convenciones del mapa"
                    title="Ocultar convenciones"
                  >
                    <EyeOff className="size-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: mapSuitabilityColors.high }} />
                    <span>Alta aptitud</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: mapSuitabilityColors.medium }} />
                    <span>Aptitud media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: mapSuitabilityColors.low }} />
                    <span>Aptitud baja</span>
                  </div>
                </div>
              </div>
            )}
            {!showMapLegend && (
              <button
                type="button"
                className="rounded-xl border border-white/40 bg-background/70 p-2 text-foreground shadow-xl backdrop-blur-xl transition-colors hover:bg-background/85"
                onClick={() => setShowMapLegend(true)}
                aria-label="Mostrar convenciones del mapa"
                title="Mostrar convenciones"
              >
                <Eye className="size-4" />
              </button>
            )}
          </div>

          {cropReady && crop && (
            <div className="absolute left-4 top-4 z-10 rounded-xl border border-white/40 bg-background/55 px-3 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur-xl">
              Mapa de aptitud · {crop.name}
            </div>
          )}

          {cropReady && crop && (
            <div className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)]">
            {showCropConditions ? (
              <div className="relative max-h-[calc(60vh-2rem)] overflow-y-auto rounded-2xl">
                <CropConditionsCard crop={crop} glass />
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  onClick={() => setShowCropConditions(false)}
                  aria-label="Ocultar condiciones ideales"
                  title="Ocultar condiciones ideales"
                >
                  <EyeOff className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-background/20 px-2.5 py-1 text-[10px] text-foreground/60 shadow-sm backdrop-blur-md transition-colors hover:bg-background/40 hover:text-foreground"
                onClick={() => setShowCropConditions(true)}
                aria-label="Mostrar condiciones ideales"
                title="Mostrar condiciones ideales"
              >
                <Eye className="size-4" />
                <span>Ver condiciones ideales</span>
              </button>
            )}
            </div>
          )}

          <div className="relative h-full">
            {zoningLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/90 backdrop-blur-sm">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="text-base font-medium">Calculando aptitud en Colombia...</p>
                <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
              </div>
            )}
            <CropNationwideMap
              results={cropReady ? zoningResults : []}
              departmentsByMunicipality={departmentsByMunicipality}
              selectedId={selectedMunicipality?.municipalityId ?? null}
              onSelect={setSelectedMunicipality}
            />
          </div>

          {selectedMunicipality && cropReady && crop && (
            <div className="absolute inset-x-4 bottom-4 z-10 max-h-[calc(60vh-2rem)] overflow-y-auto rounded-2xl border-2 border-border bg-card/95 p-5 shadow-2xl backdrop-blur-sm md:inset-x-auto md:right-4 md:bottom-4 md:w-96">
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-bold leading-tight">{selectedMunicipality.municipalityName}</p>
                  <p className="text-base text-muted-foreground">{selectedMunicipality.department}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Confidence del modelo</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{(selectedMunicipality.confidence * 100).toFixed(2)}%</p>
                </div>
                {selectedMunicipality.method && (
                  <p className="text-xs text-muted-foreground">
                    Método: <span className="font-medium">{selectedMunicipality.method}</span>
                  </p>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Probabilidad estimada de éxito para {crop.name.toLowerCase()} en esta zona.
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedMunicipality(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <section aria-label="Recomendaciones inteligentes">
        {cropReady ? (
          <NationalGuide guide={nationalGuide} loading={guideLoading} error={guideError} />
        ) : (
          <NationalGuideSkeleton />
        )}
      </section>

      <div className="md:hidden">
        <CropMapSidebar
          crop={crop}
          crops={catalogCrops}
          selectedCropId={cropId}
          onCropChange={(nextCropId) => router.push(`/mapa/${encodeURIComponent(nextCropId)}`)}
        />
      </div>
    </div>
  )
}
