import { Cloud, CloudRain, Sun, CloudSun, CloudFog, Droplets, Wind, Thermometer } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { WeatherResponse } from "@/lib/api-client/types"
import { formatPrecipitation } from "@/lib/weather-format"

const ICONS: Record<string, typeof Sun> = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  partly: CloudSun,
  fog: CloudFog,
}

interface WeatherCardProps {
  weather: WeatherResponse | null
  loading?: boolean
}

export function WeatherCard({ weather, loading }: WeatherCardProps) {
  if (loading) {
    return (
      <Card className="flex h-full flex-col gap-4 p-5">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-1 items-center gap-4">
          <Skeleton className="size-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center">
        <Cloud className="size-10 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Clima no disponible</p>
      </Card>
    )
  }

  const Icon = ICONS[weather.icon] ?? Cloud

  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Clima actual</p>
        <span className="text-xs text-muted-foreground capitalize">{weather.source}</span>
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-9" />
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight">{Math.round(weather.temperature)}°C</p>
          <p className="text-sm font-medium text-muted-foreground">{weather.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <Droplets className="size-4 text-blue-500" />
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Humedad</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <Wind className="size-4 text-slate-500" />
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Precipitación</p>
            <p className="text-sm font-semibold">{formatPrecipitation(weather.precipitation)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <Thermometer className="size-4 text-orange-500" />
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Sensación</p>
            <p className="text-sm font-semibold">{Math.round(weather.temperature)}°</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
