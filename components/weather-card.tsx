"use client"

import { useRef } from "react"
import { Sun, Cloud, CloudRain, CloudSun, Droplets, CloudDrizzle, Moon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { Weather } from "@/types"

const iconMap = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  partly: CloudSun,
}

function isNightTime(): boolean {
  const hour = new Date().getHours()
  return hour < 6 || hour >= 18
}

export function WeatherCard({ weather }: { weather: Weather | null }) {
  const iconRef = useRef<HTMLDivElement>(null)
  const rainRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!iconRef.current) return

    const icon = iconRef.current
    const ctx = gsap.context(() => {
      const iconType = weather?.icon ?? "partly"
      const night = isNightTime()

      gsap.killTweensOf(icon)

      if (iconType === "sun" && !night) {
        gsap.to(icon, {
          rotation: 360,
          duration: 12,
          repeat: -1,
          ease: "none",
        })
      } else if (iconType === "cloud" || iconType === "partly" || (iconType === "sun" && night)) {
        gsap.to(icon, {
          y: -4,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
        gsap.to(icon, {
          rotation: 4,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      } else if (iconType === "rain") {
        gsap.to(icon, {
          y: 2,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
      }

      if (rainRef.current && iconType === "rain") {
        const drops = rainRef.current.querySelectorAll(".rain-drop")
        gsap.fromTo(
          drops,
          { y: -6, opacity: 0 },
          {
            y: 12,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            repeat: -1,
            ease: "power1.in",
          },
        )
      }
    }, iconRef)

    return () => ctx.revert()
  }, [weather])

  if (!weather) {
    return (
      <Card className="flex flex-col justify-between gap-4 p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-10 w-28 animate-pulse rounded bg-muted" />
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

  const night = isNightTime()
  const iconKey = weather.icon === "sun" && night ? "moon" : weather.icon
  const Icon = iconKey === "moon" ? Moon : (iconMap[weather.icon] ?? CloudSun)

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Clima actual</p>
          <p className="text-4xl font-bold tabular-nums tracking-tight">{weather.temperature}°C</p>
        </div>
        <div
          ref={iconRef}
          className="relative flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"
        >
          <Icon className="size-7" />
          {weather.icon === "rain" && (
            <div ref={rainRef} className="pointer-events-none absolute bottom-2 flex gap-0.5">
              <span className="rain-drop size-0.5 rounded-full bg-accent-foreground/70" />
              <span className="rain-drop size-0.5 rounded-full bg-accent-foreground/70" />
              <span className="rain-drop size-0.5 rounded-full bg-accent-foreground/70" />
            </div>
          )}
        </div>
      </div>
      <p className="text-sm font-medium">{weather.condition}</p>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
