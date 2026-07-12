"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { CropImage } from "@/components/crop-image"
import { Skeleton } from "@/components/ui/skeleton"
import { suitabilityColors } from "@/lib/constants"
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
  maxCrops?: number
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

function CropRing({ crop }: { crop: SatelliteCropMapCrop }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(crop.successRate, 0), 100)
  const offset = circumference - (progress / 100) * circumference
  const color = getRingColor(crop.successRate, crop.recommendation)
  const hasData = crop.successRate > 0

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          className="size-24 sm:size-28"
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
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="relative size-14 sm:size-16 overflow-hidden rounded-full shadow-inner">
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
        <p className="text-base font-semibold text-white drop-shadow-md">
          {hasData ? `${crop.successRate}%` : "No Data"}
        </p>
        <p className="max-w-24 truncate text-sm font-medium text-white/90 drop-shadow-md sm:max-w-28">
          {crop.name}
        </p>
      </div>
    </div>
  )
}

export function SatelliteCropMap({
  location,
  crops,
  maxCrops = 6,
  loading,
}: SatelliteCropMapProps) {
  const displayedCrops = useMemo(
    () => crops.slice(0, maxCrops),
    [crops, maxCrops],
  )

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
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border sm:h-[520px]">
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

        {displayedCrops.length > 0 && (
          <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-black/25 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-white/95 drop-shadow">
              Cultivos recomendados
            </p>
            <div className="grid grid-cols-3 gap-4 sm:gap-5">
              {displayedCrops.map((crop) => (
                <CropRing key={crop.id} crop={crop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
