import {
  Droplets,
  Sun,
  CloudRain,
  Cloud,
  CloudSun,
  CloudFog,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { ForecastTrend, MonthlyForecastResponse } from "@/lib/api-client/types"
import { formatApiMonth } from "@/lib/date-utils"

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

interface MonthlyForecastModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  forecast: MonthlyForecastResponse | null
  loading?: boolean
}

export function MonthlyForecastModal({ open, onOpenChange, forecast, loading }: MonthlyForecastModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pronóstico mensual completo</DialogTitle>
          <DialogDescription>
            Pronóstico estacional detallado para los próximos meses
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : !forecast || forecast.forecasts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No hay datos de pronóstico mensual disponibles
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {forecast.forecasts.map((month) => {
              const trendMeta = getTrendMeta(month.trend)
              const WeatherIcon = getWeatherIcon(month.precipitation)

              return (
                <div
                  key={month.forecastMonth}
                  className="flex flex-col gap-2 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {formatApiMonth(month.forecastMonth, month.monthName)}
                    </p>
                    <WeatherIcon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xs font-medium ${trendMeta.color}`}>
                      {trendMeta.label}
                    </p>
                    <p className="text-lg font-bold tabular-nums">
                      {month.tempMean.toFixed(1)}°
                      <span className="text-sm font-normal text-muted-foreground">
                        ({formatAnomaly(month.tempAnomaly)}°)
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Droplets className="size-3" />
                      <span>{month.precipitation.toFixed(1)}mm</span>
                    </div>
                    <p>Anomalía: {formatAnomaly(month.precipitationAnomaly)}mm</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {forecast?.note && (
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            {forecast.note}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
