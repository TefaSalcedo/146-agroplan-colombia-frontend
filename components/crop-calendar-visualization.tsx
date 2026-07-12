import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Wheat, Calendar, TrendingUp, Clock } from "lucide-react"
import { MONTHS_LONG } from "@/lib/constants"
import { CropImage } from "@/components/crop-image"
import type { CalendarBatchResponse } from "@/lib/api-client/types"

interface CropCalendarVisualizationProps {
  calendarData: CalendarBatchResponse | null
  cropImage?: string
  cropName?: string
  loading?: boolean
}

export function CropCalendarVisualization({ calendarData, cropImage, cropName, loading }: CropCalendarVisualizationProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-12 w-full animate-pulse rounded bg-muted" />
          <div className="h-12 w-full animate-pulse rounded bg-muted" />
        </div>
      </Card>
    )
  }

  if (!calendarData || !calendarData.results || calendarData.results.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No hay datos de calendario disponibles</p>
      </Card>
    )
  }

  const cropResult = calendarData.results[0]

  return (
    <div className="flex flex-col gap-6">
      {/* Top row: Yield prediction and harvest windows */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Yield Prediction */}
        {cropResult.yieldPrediction && (
          <Card className="relative flex min-h-[240px] flex-col justify-between gap-4 overflow-hidden bg-emerald-700 p-6 text-white">
            <div className="pointer-events-none absolute inset-0">
              {cropImage ? (
                <div className="absolute inset-0">
                  <CropImage
                    src={cropImage || "/placeholder.svg"}
                    alt={cropName || "Cultivo"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-800/80 via-emerald-700/60 to-emerald-700/40" />
                </div>
              ) : (
                <div className="absolute inset-y-0 right-0 w-1/2 opacity-30 sm:w-44">
                  <div className="flex h-full w-full items-end justify-center">
                    <span className="text-6xl opacity-20">🌱</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-emerald-100" />
                <h3 className="text-base font-semibold">Predicción de rendimiento</h3>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{cropResult.yieldPrediction.toFixed(2)}</span>
                  <span className="text-emerald-100">toneladas/hectárea</span>
                </div>
              </div>
              {cropResult.yieldConfidence && (
                <Badge variant="secondary" className="w-fit border-emerald-500/50 bg-emerald-800/70 text-emerald-50 hover:bg-emerald-800/70">
                  Confianza: {cropResult.yieldConfidence}
                </Badge>
              )}
            </div>
          </Card>
        )}

        {/* Harvest Windows */}
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Wheat className="size-5" />
            </div>
            <h3 className="text-base font-semibold">Ventanas de cosecha recomendadas</h3>
          </div>

          <div className="space-y-4">
            {cropResult.topHarvestMonths.map((window, index) => (
              <div
                key={`${window.harvestYear}-${window.harvestMonth}-${index}`}
                className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-primary" />
                    <span className="text-lg font-semibold text-foreground">
                      {window.harvestMonthName} {window.harvestYear}
                    </span>
                  </div>
                  <Badge variant="default" className="bg-primary px-2.5 py-0.5 text-xs font-semibold">
                    Score: {(window.score * 100).toFixed(0)}%
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <Sprout className="size-4 shrink-0 text-emerald-600" />
                    <span>
                      Siembra: {window.plantingMonths.map(m => MONTHS_LONG[m - 1]).join(", ")} {window.plantingYear}
                    </span>
                  </div>

                  {window.durationDaysMin && window.durationDaysMax && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4 shrink-0 text-slate-400" />
                      <span>
                        Duración: {window.durationDaysMin === window.durationDaysMax
                          ? `${window.durationDaysMin} días`
                          : `${window.durationDaysMin} - ${window.durationDaysMax} días`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Explanation */}
      {cropResult.explanation?.text && (
        <Card className="relative flex flex-col gap-4 overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-background to-background p-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <Image
                src="/ai%20images/agroplan.webp"
                alt="Asistente IA de Agroplan"
                width={32}
                height={32}
                className="size-8 rounded-xl object-cover"
              />
            </div>
            <h3 className="text-base font-semibold">Análisis inteligente</h3>
          </div>
          <p className="text-justify text-sm leading-loose text-foreground print:text-base print:leading-loose">
            {cropResult.explanation.text}
          </p>
          {cropResult.explanation.model && (
            <div className="text-xs text-muted-foreground">
              Modelo: {cropResult.explanation.model}
              {cropResult.explanation.latencyMs && ` · ${cropResult.explanation.latencyMs}ms`}
            </div>
          )}
        </Card>
      )}

      {/* Warnings */}
      {cropResult.warnings && cropResult.warnings.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 p-5">
          <h4 className="mb-2 font-medium text-amber-900">Advertencias</h4>
          <ul className="space-y-2 text-sm leading-relaxed text-amber-800">
            {cropResult.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
