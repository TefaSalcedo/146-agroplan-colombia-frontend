import { Sun, Cloud, CloudRain, CloudSun, Droplets, CloudDrizzle } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Weather } from "@/types"

const iconMap = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  partly: CloudSun,
}

export function WeatherCard({ weather }: { weather: Weather | null }) {
  if (!weather) {
    return (
      <Card className="flex flex-col justify-between gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex size-14 animate-pulse items-center justify-center rounded-2xl bg-muted" />
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="flex items-center gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </Card>
    )
  }

  const Icon = iconMap[weather.icon] ?? CloudSun

  return (
    <Card className="flex flex-col justify-between gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Clima ahora</p>
          <p className="text-3xl font-bold tabular-nums">{weather.temperature}°C</p>
        </div>
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Icon className="size-7" />
        </div>
      </div>
      <p className="text-sm font-medium">{weather.condition}</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Droplets className="size-4" />
          {weather.humidity}% humedad
        </span>
        <span className="flex items-center gap-1.5">
          <CloudDrizzle className="size-4" />
          {weather.precipitation}% lluvia
        </span>
      </div>
    </Card>
  )
}
