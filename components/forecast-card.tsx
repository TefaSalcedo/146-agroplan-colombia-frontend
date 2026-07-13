import { useEffect, useState } from "react"
import { Droplets, Sun, Cloud, CloudRain, CloudSun, CloudFog, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { ForecastDayResponse } from "@/lib/api-client/types"
import { formatApiDate, parseApiDate } from "@/lib/date-utils"

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
  const date = parseApiDate(dateString)
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
  return `${WEEK_DAYS[dayIndex] ?? ""} ${formatApiDate(dateString)}`
}

interface ForecastCardProps {
  forecast: ForecastDayResponse[]
  loading?: boolean
}

export function ForecastCard({ forecast = [], loading }: ForecastCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const DEFAULT_DAYS = 4
  const MAX_DAYS = 7

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const handleChange = () => setIsDesktop(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (isDesktop) setIsExpanded(false)
  }, [isDesktop])

  if (loading) {
    return (
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {Array.from({ length: DEFAULT_DAYS }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </Card>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const filteredDays = forecast
    .filter((day) => {
      const dayDate = parseApiDate(day.date)
      dayDate.setHours(0, 0, 0, 0)
      return dayDate >= today
    })

  const displayDays = isExpanded ? filteredDays.slice(0, MAX_DAYS) : filteredDays.slice(0, DEFAULT_DAYS)
  const canExpand = filteredDays.length > DEFAULT_DAYS
  const shouldShowDays = isDesktop || isExpanded

  if (filteredDays.length === 0) {
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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Pronóstico</p>
            <p className="text-xs text-muted-foreground">
              {shouldShowDays ? `Próximos ${displayDays.length} días` : "Pronóstico diario"}
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

      {shouldShowDays && (
        <div className="flex flex-1 flex-col gap-2">
          {displayDays.map((day) => {
            const Icon = getWeatherIcon(day)
            const label = formatDayLabel(day.date)
            const tempMin = day.tempMin ?? "--"
            const tempMax = day.tempMax ?? "--"
            const precipitation = day.precipitation ?? 0
            const humidity = day.humidity ?? 0

            return (
              <div
                key={day.date}
                className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 px-4 py-3 transition-all hover:from-muted/50 hover:to-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex size-11 items-center justify-center rounded-xl ${
                    precipitation >= 50
                      ? 'bg-blue-500/10 text-blue-600'
                      : precipitation >= 20
                      ? 'bg-amber-500/10 text-amber-600'
                      : humidity >= 80
                      ? 'bg-slate-500/10 text-slate-600'
                      : 'bg-orange-500/10 text-orange-600'
                  }`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{humidity}% humedad</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-foreground">
                      {tempMax}° <span className="font-normal text-muted-foreground">/ {tempMin}°</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1">
                    <Droplets className="size-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{precipitation}mm</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
