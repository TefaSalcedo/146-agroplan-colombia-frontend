import { useState } from "react"
import {
  Droplets,
  Sun,
  CloudRain,
  Cloud,
  CloudSun,
  CloudFog,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { ForecastTrend, MonthlyForecastResponse } from "@/lib/api-client/types"

interface TrendMeta {
  label: string
  color: string
}

function getTrendMeta(trend: ForecastTrend): TrendMeta {
  const map: Record<ForecastTrend, TrendMeta> = {
    warmer: { label: "Más cálido", color: "text-amber-500" },
    cooler: { label: "Más frío", color: "text-blue-500" },
    wetter: { label: "Más húmedo", color: "text-blue-500" },
    drier: { label: "Más seco", color: "text-amber-500" },
    warmer_drier: { label: "Más cálido y seco", color: "text-orange-500" },
    warmer_wetter: { label: "Más cálido y húmedo", color: "text-rose-500" },
    cooler_drier: { label: "Más frío y seco", color: "text-cyan-500" },
    cooler_wetter: { label: "Más frío y húmedo", color: "text-blue-500" },
    normal: { label: "Normal", color: "text-emerald-500" },
  }
  return map[trend] || { label: trend, color: "text-muted-foreground" }
}

function getWeatherIcon(precipitation: number, humidity?: number) {
  if (precipitation >= 50) return CloudRain
  if (precipitation >= 20) return CloudSun
  if (humidity && humidity >= 80) return CloudFog
  if (precipitation >= 5 || (humidity && humidity >= 60)) return Cloud
  return Sun
}

function formatAnomaly(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : ""
  return `${sign}${value.toFixed(1)}`
}

interface MonthlyForecastCardProps {
  forecast?: MonthlyForecastResponse | null
  loading?: boolean
}

export function MonthlyForecastCard({ forecast, loading }: MonthlyForecastCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const DEFAULT_MONTHS = 4
  const MAX_MONTHS = 6

  if (loading) {
    return (
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {Array.from({ length: DEFAULT_MONTHS }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    )
  }

  if (!forecast || forecast.forecasts.length === 0) {
    return (
      <Card className="flex h-full flex-col justify-center gap-2 p-5 text-center">
        <p className="text-sm font-medium text-muted-foreground">Pronóstico mensual no disponible</p>
        <p className="text-xs text-muted-foreground">
          No pudimos cargar el pronóstico climático mensual para esta ubicación.
        </p>
      </Card>
    )
  }

  const displayMonths = isExpanded ? forecast.forecasts.slice(0, MAX_MONTHS) : forecast.forecasts.slice(0, DEFAULT_MONTHS)
  const canExpand = forecast.forecasts.length > DEFAULT_MONTHS

  return (
    <Card className="flex h-full flex-col gap-4 p-5 hover:bg-accent/50 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Pronóstico mensual</p>
            <p className="text-xs text-muted-foreground">
              {isExpanded ? `Próximos ${displayMonths.length} meses` : `Próximos ${DEFAULT_MONTHS} meses`}
            </p>
          </div>
          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 gap-1 text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-4" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  Ver más
                </>
              )}
            </Button>
          )}
        </div>

      <div className="flex flex-1 flex-col gap-2">
        {displayMonths.map((month) => {
          const trendMeta = getTrendMeta(month.trend)
          const WeatherIcon = getWeatherIcon(month.precipitation)

          return (
            <div
              key={month.forecastMonth}
              className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 px-4 py-3 transition-all hover:from-muted/50 hover:to-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-11 items-center justify-center rounded-xl ${
                  month.precipitation >= 100
                    ? 'bg-blue-500/10 text-blue-600'
                    : month.precipitation >= 50
                    ? 'bg-cyan-500/10 text-cyan-600'
                    : month.precipitation >= 20
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-orange-500/10 text-orange-600'
                }`}>
                  <WeatherIcon className="size-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">{month.monthName}</p>
                  <p className={`text-xs font-medium ${trendMeta.color}`}>{trendMeta.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums text-foreground">
                    {month.tempMean.toFixed(1)}°
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({formatAnomaly(month.tempAnomaly)}°)
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1">
                  <Droplets className="size-3.5 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">{month.precipitation.toFixed(1)}mm</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {forecast.note && (
        <p className="text-xs text-muted-foreground leading-relaxed">{forecast.note}</p>
      )}
    </Card>
  )
}
