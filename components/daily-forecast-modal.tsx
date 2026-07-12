import { Droplets, Sun, Cloud, CloudRain, CloudSun, CloudFog } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { ForecastDayResponse } from "@/lib/api-client/types"
import { formatApiDate, parseApiDate } from "@/lib/date-utils"

const WEEK_DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const WEEK_DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getWeatherIcon(day: ForecastDayResponse) {
  const precipitation = day.precipitation ?? 0
  const humidity = day.humidity ?? 0

  if (precipitation >= 50) return CloudRain
  if (precipitation >= 20) return CloudSun
  if (humidity >= 80) return CloudFog
  if (precipitation >= 5 || humidity >= 60) return Cloud
  return Sun
}

function formatDayLabel(dateString: string): { full: string; short: string } {
  const date = parseApiDate(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return { full: "Hoy", short: "Hoy" }
  if (isSameDay(date, tomorrow)) return { full: "Mañana", short: "Mañana" }

  const dayIndex = date.getDay()
  const dayName = WEEK_DAYS[dayIndex] ?? ""
  const dayNameShort = WEEK_DAYS_SHORT[dayIndex] ?? ""
  const dateLabel = formatApiDate(dateString)
  return { full: `${dayName} ${dateLabel}`, short: `${dayNameShort} ${dateLabel}` }
}

interface DailyForecastModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  forecast: ForecastDayResponse[]
  loading?: boolean
}

export function DailyForecastModal({ open, onOpenChange, forecast, loading }: DailyForecastModalProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = forecast
    .filter((day) => {
      const dayDate = parseApiDate(day.date)
      dayDate.setHours(0, 0, 0, 0)
      return dayDate >= today
    })
    .slice(0, 12)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pronóstico diario completo</DialogTitle>
          <DialogDescription>
            Pronóstico detallado para los próximos 12 días
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : days.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No hay datos de pronóstico disponibles
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {days.map((day) => {
              const Icon = getWeatherIcon(day)
              const label = formatDayLabel(day.date)
              const tempMin = day.tempMin ?? "--"
              const tempMax = day.tempMax ?? "--"
              const precipitation = day.precipitation ?? 0
              const humidity = day.humidity ?? 0
              const uvIndex = day.uvIndex ?? 0
              const windSpeed = day.windSpeed ?? 0

              return (
                <div
                  key={day.date}
                  className="flex flex-col gap-2 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{label.short}</p>
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{label.full}</p>
                    <p className="text-lg font-bold tabular-nums">
                      {tempMax}°
                      <span className="text-sm font-normal text-muted-foreground"> / {tempMin}°</span>
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Droplets className="size-3" />
                      <span>{precipitation}mm</span>
                    </div>
                    <p>Humedad: {humidity}%</p>
                    <p>UV: {uvIndex.toFixed(1)}</p>
                    <p>Viento: {windSpeed.toFixed(1)} km/h</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
