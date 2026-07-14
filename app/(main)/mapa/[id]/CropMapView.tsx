"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Droplets,
  Eye,
  EyeOff,
  GripHorizontal,
  Leaf,
  Loader2,
  RefreshCw,
  Sparkles,
  Sprout,
  XCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CropCoverCard, CropMapSidebar } from "@/components/crop-map-sidebar"
import { DynamicAiLoadingMessage } from "@/components/dynamic-ai-loading-message"
import { useCrop, useCropNationalGuide, useCropsLite, useMunicipalities, useZoning } from "@/hooks"
import { mapSuitabilityColors } from "@/lib/constants"
import { cn } from "@/lib/utils"
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

function NationalGuideSkeleton({ desktopLayout = false }: { desktopLayout?: boolean }) {
  return (
    <Card
      className={cn(
        desktopLayout
          ? "border-transparent bg-transparent p-5 shadow-none backdrop-blur-none md:p-6"
          : "border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-5 md:p-6",
        desktopLayout ? "h-auto min-h-full" : "h-full overflow-hidden",
      )}
    >
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
        <div className={cn("flex gap-3 overflow-hidden", desktopLayout && "flex-col overflow-visible")}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className={cn("h-32 min-w-[86%] rounded-xl md:min-w-[24rem]", desktopLayout && "w-full")}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

function DisabledNationalGuide({ desktopLayout = false }: { desktopLayout?: boolean }) {
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
        <div
          className={cn(
            "flex w-full max-w-xl snap-x gap-2 overflow-x-auto text-left text-sm text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            desktopLayout && "max-w-none flex-col overflow-visible",
          )}
        >
          {["Manejo", "Fertilización", "Plagas", "Riego", "Cosecha", "Buenas prácticas"].map((item) => (
            <div
              key={item}
              className={cn(
                "flex min-w-40 shrink-0 snap-start items-center gap-2 rounded-lg bg-background/70 px-3 py-2",
                desktopLayout && "w-full",
              )}
            >
              <span className="font-bold text-primary">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function NationalGuideError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-primary/20 bg-background/95 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <AlertCircle className="size-5" />
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Lo sentimos, las recomendaciones no están disponibles.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Tuvimos un inconveniente al generarlas. Puedes intentarlo nuevamente sin recargar toda la página.
          </p>
          {onRetry && (
            <Button type="button" size="sm" variant="outline" onClick={onRetry}>
              <RefreshCw className="size-3.5" />
              Reintentar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

function NationalGuideContent({
  guide,
  desktopLayout = false,
}: {
  guide: CropNationalGuideResponse
  desktopLayout?: boolean
}) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)

  const scrollToSection = (index: number) => {
    const carousel = carouselRef.current
    const section = carousel?.children[index]
    if (!carousel || !(section instanceof HTMLElement)) return

    carousel.scrollTo({ left: section.offsetLeft - carousel.offsetLeft, behavior: "smooth" })
    setActiveSection(index)
  }

  return (
    <Card
      className={cn(
        "border-primary/20 bg-background/90 p-3 shadow-xl backdrop-blur-xl md:p-4",
        desktopLayout ? "h-auto min-h-full" : "h-full overflow-hidden",
      )}
    >
      <div className="space-y-3 md:space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary md:size-8">
            <Sparkles className="size-6 md:size-4" />
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
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 md:max-h-10 md:overflow-hidden md:p-2">
            <p className="text-sm leading-relaxed md:line-clamp-1 md:text-xs">{guide.summary}</p>
          </div>
        )}

        {guide.sections.length > 0 && (
          <>
            <div
              ref={carouselRef}
              className={cn(
                "-mx-1 flex gap-3 px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                desktopLayout
                  ? "flex-col overflow-visible"
                  : "snap-x snap-mandatory overflow-x-auto md:h-[15svh] md:min-h-[132px]",
              )}
              aria-label="Tarjetas de recomendaciones inteligentes"
              onScroll={!desktopLayout ? (event) => {
                const carousel = event.currentTarget
                const firstSection = carousel.children[0]
                if (!(firstSection instanceof HTMLElement)) return
                const sectionWidth = firstSection.offsetWidth + 12
                setActiveSection(Math.min(guide.sections.length - 1, Math.round(carousel.scrollLeft / sectionWidth)))
              } : undefined}
              onWheel={!desktopLayout ? (event) => {
                if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                  event.currentTarget.scrollLeft += event.deltaY
                }
              } : undefined}
            >
            {guide.sections.map((section, index) => {
              const Icon = section.title.toLowerCase().includes("riego")
                ? Droplets
                : section.title.toLowerCase().includes("sembr")
                  ? CalendarDays
                  : section.title.toLowerCase().includes("fert")
                    ? Leaf
                    : Sprout

              return (
                <div
                  key={`${section.title}-${index}`}
                  className={cn(
                    "flex min-h-28 items-start rounded-xl border border-primary/15 bg-card/85 p-4 transition-shadow hover:shadow-md",
                    desktopLayout
                      ? "w-full"
                      : "w-[min(86vw,24rem)] shrink-0 snap-start md:h-full md:min-h-0 md:w-[min(31vw,25rem)]",
                  )}
                >
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
            {!desktopLayout && (
              <div className="mt-1 flex items-center justify-center gap-1.5" aria-label="Navegación de recomendaciones">
                {guide.sections.map((section, index) => (
                  <button
                    key={`${section.title}-dot-${index}`}
                    type="button"
                    className={cn(
                      "size-1.5 rounded-full bg-primary/25 transition-all",
                      index === activeSection && "w-4 bg-primary",
                    )}
                    onClick={() => scrollToSection(index)}
                    aria-label={`Ver recomendación ${index + 1}: ${section.title}`}
                    aria-current={index === activeSection ? "true" : undefined}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <p className="text-xs text-muted-foreground">
          Esta guía fue generada por IA para orientación general. Valida las decisiones de manejo con asistencia técnica local.
        </p>
      </div>
    </Card>
  )
}

function NationalGuide({ guide, loading, error, onRetry, desktopLayout = false }: {
  guide: CropNationalGuideResponse | null
  loading: boolean
  error: string | null
  onRetry?: () => void
  desktopLayout?: boolean
}) {
  if (loading) return <NationalGuideSkeleton desktopLayout={desktopLayout} />
  if (error || guide?.status === "error") return <NationalGuideError onRetry={onRetry} />
  if (guide?.status === "llm_disabled") return <DisabledNationalGuide desktopLayout={desktopLayout} />
  if (guide) return <NationalGuideContent guide={guide} desktopLayout={desktopLayout} />
  return null
}

export function CropMapView({ cropId }: CropMapViewProps) {
  const router = useRouter()
  const { crop, loading: cropLoading, error: cropError } = useCrop(cropId)
  const cropReady = Boolean(crop) && !cropLoading
  const { crops: catalogCrops } = useCropsLite()
  const { municipalities } = useMunicipalities()
  const { getMap, loading: zoningLoading, error: zoningError } = useZoning()
  const {
    guide: nationalGuide,
    loading: guideLoading,
    error: guideError,
    reload: reloadNationalGuide,
  } = useCropNationalGuide(cropReady ? cropId : "")

  const [zoningResults, setZoningResults] = useState<ZoningMapMunicipalityResult[]>([])
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    (ZoningMapMunicipalityResult & { department: string }) | null
  >(null)
  const [showMapLegend, setShowMapLegend] = useState(true)
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(false)
  const [desktopRecommendationsOpen, setDesktopRecommendationsOpen] = useState(true)

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
  const nationalGuideHasError = Boolean(guideError || nationalGuide?.status === "error")

  useEffect(() => {
    if (nationalGuideHasError) {
      setDesktopRecommendationsOpen(false)
    }
  }, [nationalGuideHasError])

  const handleNationalGuideRetry = () => {
    setDesktopRecommendationsOpen(true)
    reloadNationalGuide()
  }

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
    <div className="flex flex-col gap-6 pb-8 md:h-screen md:w-full md:block">
      <Card className="overflow-hidden rounded-2xl border-2 p-0 md:h-full md:w-full md:rounded-none md:border-0">
        <div className="relative h-[60svh] min-h-0 md:h-full">
          <div
            className={cn(
              "absolute right-4 top-4 z-10 flex items-start gap-2 transition-[right] duration-500 ease-out",
              desktopRecommendationsOpen ? "lg:right-[calc(min(34vw,420px)+1rem)]" : "",
            )}
          >
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
            <div
              className={cn(
                "absolute inset-x-4 bottom-4 z-10 max-h-[calc(95svh-2rem)] overflow-y-auto rounded-2xl border-2 border-border bg-card/95 p-5 shadow-2xl backdrop-blur-sm transition-[right] duration-500 ease-out md:inset-x-auto md:bottom-4 md:w-96",
                desktopRecommendationsOpen
                  ? "lg:right-[calc(min(34vw,420px)+1rem)]"
                  : "",
              )}
            >
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

          <div
            className={cn(
              "absolute inset-x-3 bottom-3 z-30 hidden overflow-hidden transition-[height] duration-500 ease-out md:block lg:hidden",
              recommendationsExpanded ? "h-[min(52svh,520px)]" : "h-[22%] min-h-[180px] max-h-[240px]",
            )}
            onWheel={(event) => {
              if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                setRecommendationsExpanded(event.deltaY < 0)
              }
            }}
          >
            <button
              type="button"
              className="absolute left-1/2 top-1 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/20 bg-background/90 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-md backdrop-blur-xl transition-colors hover:text-foreground"
              onClick={() => setRecommendationsExpanded((isExpanded) => !isExpanded)}
              aria-expanded={recommendationsExpanded}
              aria-controls="tablet-national-guide"
            >
              <GripHorizontal className="size-4" />
              {recommendationsExpanded ? "Ocultar recomendaciones" : "Ver recomendaciones"}
              {recommendationsExpanded ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
            </button>
            <div id="tablet-national-guide" className="h-full pt-7">
              {cropReady ? (
                <NationalGuide
                  guide={nationalGuide}
                  loading={guideLoading}
                  error={guideError}
                  onRetry={handleNationalGuideRetry}
                />
              ) : (
                <NationalGuideSkeleton />
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 z-40 hidden w-[min(34vw,420px)] lg:block">
            <aside
              id="desktop-national-guide"
              className={cn(
                "pointer-events-auto absolute inset-y-4 right-0 flex h-auto w-full flex-col overflow-y-auto rounded-l-2xl border border-r-0 transition-[transform,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out",
                !cropReady || guideLoading
                  ? "border-transparent bg-transparent shadow-none backdrop-blur-none"
                  : "border-primary/20 bg-background/90 shadow-2xl backdrop-blur-xl",
                desktopRecommendationsOpen ? "translate-x-0" : "translate-x-full",
              )}
              aria-hidden={!desktopRecommendationsOpen}
              inert={!desktopRecommendationsOpen}
            >
              <button
                type="button"
                className="absolute left-2 top-1/2 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/20 bg-background/95 text-muted-foreground shadow-lg transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setDesktopRecommendationsOpen(false)}
                aria-label="Ocultar recomendaciones inteligentes"
                title="Ocultar recomendaciones"
                tabIndex={desktopRecommendationsOpen ? 0 : -1}
              >
                <ChevronRight className="size-5" />
              </button>
              <div className="flex-1 overflow-y-auto p-3 md:p-4">
                {cropReady ? (
                  <NationalGuide
                    guide={nationalGuide}
                    loading={guideLoading}
                    error={guideError}
                    onRetry={handleNationalGuideRetry}
                    desktopLayout
                  />
                ) : (
                  <NationalGuideSkeleton desktopLayout />
                )}
              </div>
            </aside>

            {nationalGuideHasError && (
              <div className="pointer-events-auto absolute right-4 top-4 z-50 hidden w-[min(34vw,420px)] lg:block">
                <NationalGuideError onRetry={handleNationalGuideRetry} />
              </div>
            )}

            <button
              type="button"
              className={cn(
                "pointer-events-auto absolute right-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-l-xl border border-r-0 border-primary/20 bg-background/95 text-muted-foreground shadow-xl backdrop-blur-xl transition-[opacity,transform] duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                desktopRecommendationsOpen && "pointer-events-none translate-x-4 opacity-0",
              )}
              onClick={() => setDesktopRecommendationsOpen(true)}
              aria-label="Mostrar recomendaciones inteligentes"
              title="Mostrar recomendaciones"
              aria-expanded={desktopRecommendationsOpen}
              aria-controls="desktop-national-guide"
              tabIndex={desktopRecommendationsOpen ? -1 : 0}
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </div>
      </Card>

      <section aria-label="Recomendaciones inteligentes" className="md:hidden">
        {cropReady ? (
          <NationalGuide
            guide={nationalGuide}
            loading={guideLoading}
            error={guideError}
            onRetry={handleNationalGuideRetry}
          />
        ) : (
          <NationalGuideSkeleton />
        )}
      </section>

      <div className="space-y-4 md:hidden">
        <CropCoverCard crop={crop} />
      </div>

      <div className="md:hidden">
        <CropMapSidebar
          showCropCard={false}
          crop={crop}
          crops={catalogCrops}
          selectedCropId={cropId}
          onCropChange={(nextCropId) => router.push(`/mapa/${encodeURIComponent(nextCropId)}`)}
        />
      </div>
    </div>
  )
}
