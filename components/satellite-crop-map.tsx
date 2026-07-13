"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { CropImage } from "@/components/crop-image"
import { Skeleton } from "@/components/ui/skeleton"
import { suitabilityColors } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Municipality, RecommendationLevel } from "@/types"
import type { StyleSpecification } from "maplibre-gl"

interface SatelliteCropMapCrop {
  id: string
  name: string
  image: string
  successRate: number
  recommendation: RecommendationLevel
}

interface SatelliteCropMapProps {
  location: Municipality
  crops: SatelliteCropMapCrop[]
  getCropHref: (crop: SatelliteCropMapCrop) => string
  loading?: boolean
}

const satelliteStyle: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
    },
  ],
}

const Map = dynamic(
  () => import("@/components/ui/map").then((m) => m.Map),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> },
)

const MapControls = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapControls),
  { ssr: false },
)

function getRingColor(successRate: number, recommendation: RecommendationLevel): string {
  if (successRate === 0) return suitabilityColors.none
  if (recommendation === "high") return suitabilityColors.high
  if (recommendation === "medium") return suitabilityColors.medium
  return suitabilityColors.low
}

function CropRing({
  crop,
  href,
  compact,
}: {
  crop: SatelliteCropMapCrop
  href: string
  compact: boolean
}) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(crop.successRate, 0), 100)
  const offset = circumference - (progress / 100) * circumference
  const color = getRingColor(crop.successRate, crop.recommendation)
  const hasData = crop.successRate > 0
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(false)
    const frame = requestAnimationFrame(() => setIsAnimated(true))

    return () => cancelAnimationFrame(frame)
  }, [offset])

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-1 text-center outline-none transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-white/90"
      aria-label={`Ver detalles de ${crop.name}, recomendación ${hasData ? `${crop.successRate}%` : "sin datos"}`}
    >
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          className={cn("transition-transform duration-300 group-hover:scale-105", compact ? "size-18 sm:size-20" : "size-20 sm:size-24")}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/15"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isAnimated ? offset : circumference}
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className={cn("relative overflow-hidden rounded-full shadow-inner", compact ? "size-11 sm:size-12" : "size-12 sm:size-14")}>
            <CropImage
              src={crop.image || "/placeholder.svg"}
              alt={crop.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        <p className={cn("font-semibold tabular-nums text-white drop-shadow-md", compact ? "text-sm" : "text-base")}>
          {hasData ? `${crop.successRate}%` : "No Data"}
        </p>
        <p className={cn("truncate font-medium text-white/90 drop-shadow-md", compact ? "max-w-18 text-xs sm:max-w-20" : "max-w-24 text-sm sm:max-w-28")}>
          {crop.name}
        </p>
      </div>
    </Link>
  )
}

export function SatelliteCropMap({
  location,
  crops,
  getCropHref,
  loading,
}: SatelliteCropMapProps) {
  const hasManyCrops = crops.length > 4
  const cropGridClass = crops.length === 1
    ? "grid-cols-1"
    : crops.length === 2
      ? "grid-cols-2"
      : hasManyCrops
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-3"

  const mapStyles = useMemo(
    () => ({
      light: satelliteStyle,
      dark: satelliteStyle,
    }),
    [],
  )

  if (loading) {
    return (
      <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border sm:h-[520px]">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border",
        hasManyCrops ? "h-[540px] sm:h-[520px]" : "h-[420px] sm:h-[460px]",
      )}
    >
      <Map
        center={[location.lng, location.lat]}
        zoom={15}
        scrollZoom
        styles={mapStyles}
        className="h-full w-full"
        attributionControl={{ compact: true }}
      >
        <MapControls position="bottom-right" showZoom />
      </Map>

      <div className="pointer-events-none absolute inset-0 p-4 sm:p-5">
        <div className="pointer-events-auto absolute left-4 top-4 rounded-2xl border border-white/15 bg-black/30 px-4 py-2 text-white shadow-lg backdrop-blur-xl">
          <p className="text-sm font-semibold drop-shadow-md">{location.name}</p>
          <p className="text-xs text-white/80 drop-shadow-md">
            {location.department}, Colombia
          </p>
        </div>

        {crops.length > 0 && (
          <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(92%,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/25 bg-black/15 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md sm:p-5">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-white/95 drop-shadow sm:text-sm">
              Cultivos recomendados
            </p>
            <p className="mb-3 text-center text-[11px] text-white/75 sm:text-xs">
              Selecciona un cultivo para ver su recomendación
            </p>
            <div className={cn("grid items-start justify-items-center gap-x-3 gap-y-3 sm:gap-x-5 sm:gap-y-4", cropGridClass)}>
              {crops.map((crop) => (
                <CropRing key={crop.id} crop={crop} href={getCropHref(crop)} compact={hasManyCrops} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
