import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Wheat, Calendar, TrendingUp } from "lucide-react"
import { MONTHS_LONG } from "@/lib/constants"
import type { CalendarBatchResponse } from "@/lib/api-client/types"

interface CropCalendarVisualizationProps {
  calendarData: CalendarBatchResponse | null
  loading?: boolean
}

export function CropCalendarVisualization({ calendarData, loading }: CropCalendarVisualizationProps) {
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
    <div className="flex flex-col gap-4">
      {/* Yield Prediction */}
      {cropResult.yieldPrediction && (
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h3 className="font-semibold">Predicción de rendimiento</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{cropResult.yieldPrediction.toFixed(2)}</span>
            <span className="text-muted-foreground">toneladas/hectárea</span>
          </div>
          {cropResult.yieldConfidence && (
            <Badge variant="secondary" className="w-fit">
              Confianza: {cropResult.yieldConfidence}
            </Badge>
          )}
        </Card>
      )}

      {/* Harvest Windows */}
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <Wheat className="size-5 text-amber-500" />
          <h3 className="font-semibold">Ventanas de cosecha recomendadas</h3>
        </div>
        
        <div className="space-y-3">
          {cropResult.topHarvestMonths.map((window, index) => (
            <div
              key={`${window.harvestYear}-${window.harvestMonth}-${index}`}
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  <span className="font-medium">
                    {window.harvestMonthName} {window.harvestYear}
                  </span>
                </div>
                <Badge variant="default" className="bg-primary">
                  Score: {(window.score * 100).toFixed(0)}%
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Sprout className="size-4 text-emerald-500" />
                <span className="text-muted-foreground">
                  Siembra: {window.plantingMonths.map(m => MONTHS_LONG[m - 1]).join(", ")} {window.plantingYear}
                </span>
              </div>

              {window.durationDaysMin && window.durationDaysMax && (
                <div className="text-xs text-muted-foreground">
                  Duración: {window.durationDaysMin === window.durationDaysMax 
                    ? `${window.durationDaysMin} días` 
                    : `${window.durationDaysMin} - ${window.durationDaysMax} días`}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* AI Explanation */}
      {cropResult.explanation?.text && (
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            <h3 className="font-semibold">Análisis inteligente</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
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
          <ul className="space-y-1 text-sm text-amber-800">
            {cropResult.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}