import {
  Droplets,
  Sun,
  CloudRain,
  Cloud,
  CloudSun,
  CloudFog,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  if (loading) {
    return (
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
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

  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="text-sm font-semibold">Pronóstico mensual</p>
        <p className="text-xs text-muted-foreground">Próximos {forecast.months} meses</p>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {forecast.forecasts.map((month) => {
          const trendMeta = getTrendMeta(month.trend)
          const WeatherIcon = getWeatherIcon(month.precipitation)

          return (
            <div
              key={month.forecastMonth}
              className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground">
                  <WeatherIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{month.monthName}</p>
                  <p className={`text-xs ${trendMeta.color}`}>{trendMeta.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {month.tempMean.toFixed(1)}°
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    ({formatAnomaly(month.tempAnomaly)}°)
                  </span>
                </p>
                <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <Droplets className="size-3" />
                  {month.precipitation.toFixed(1)}mm
                  <span className="ml-1">({formatAnomaly(month.precipitationAnomaly)}mm)</span>
                </p>
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
