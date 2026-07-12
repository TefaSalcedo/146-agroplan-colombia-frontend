import { Droplets, Sun, Cloud, CloudRain, CloudSun, CloudFog } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ForecastDayResponse } from "@/lib/api-client/types"

const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getWeatherIcon(day: ForecastDayResponse) {
  const precipitation = day.precipitation ?? 0
  const humidity = day.humidity ?? 0

  if (precipitation >= 50) return CloudRain
  if (precipitation >= 20) return CloudSun
  if (humidity >= 80) return CloudFog
  if (precipitation >= 5 || humidity >= 60) return Cloud
  return Sun
}

function formatDayLabel(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return "Hoy"
  if (isSameDay(date, tomorrow)) return "Mañana"

  const dayIndex = date.getDay()
  return WEEK_DAYS[dayIndex] ?? ""
}

interface ForecastCardProps {
  forecast: ForecastDayResponse[]
  loading?: boolean
}

export function ForecastCard({ forecast = [], loading }: ForecastCardProps) {
  if (loading) {
    return (
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
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

  const days = forecast.slice(0, 4)

  if (days.length === 0) {
    return (
      <Card className="flex h-full flex-col justify-center gap-2 p-5 text-center">
        <p className="text-sm font-medium text-muted-foreground">Pronóstico no disponible</p>
        <p className="text-xs text-muted-foreground">
          No pudimos cargar el pronóstico del clima para los próximos días.
        </p>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="text-sm font-semibold">Pronóstico</p>
        <p className="text-xs text-muted-foreground">Próximos 4 días</p>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {days.map((day) => {
          const Icon = getWeatherIcon(day)
          const label = formatDayLabel(day.date)
          const tempMin = day.tempMin ?? "--"
          const tempMax = day.tempMax ?? "--"
          const precipitation = day.precipitation ?? 0
          const humidity = day.humidity ?? 0

          return (
            <div
              key={day.date}
              className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{humidity}% humedad</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {tempMax}° / {tempMin}°
                </p>
                <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <Droplets className="size-3" />
                  {precipitation}mm
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
