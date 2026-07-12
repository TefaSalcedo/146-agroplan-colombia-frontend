"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import MapLibreGL from "maplibre-gl"
import { Sprout } from "lucide-react"
import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip, useMap } from "@/components/ui/map"
import { mapSuitabilityColors } from "@/lib/constants"
import type { Suitability } from "@/types"
import type { ZoningMapMunicipalityResult } from "@/lib/api-client/types"

const MAP_CONTEXT_BOUNDS: [[number, number], [number, number]] = [
  [-83.5, -6.5],
  [-62.5, 15.5],
]

const MAP_VIEW_BOUNDS: [[number, number], [number, number]] = [
  [-84, -6.5],
  [-61.5, 15.5],
]

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
}

interface MapPoint extends ZoningMapMunicipalityResult {
  department: string
}

interface CropCluster {
  id: string
  longitude: number
  latitude: number
  points: MapPoint[]
  suitability: Suitability
}

interface CropNationwideMapProps {
  results: ZoningMapMunicipalityResult[]
  departmentsByMunicipality: Record<string, string>
  selectedId: string | null
  onSelect: (municipality: MapPoint) => void
}

function haversineDistanceMeters(
  from: Pick<MapPoint, "lng" | "lat">,
  to: Pick<MapPoint, "lng" | "lat">,
): number {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadius = 6_371_000
  const latDelta = toRadians(to.lat - from.lat)
  const lngDelta = toRadians(to.lng - from.lng)
  const latitudeA = toRadians(from.lat)
  const latitudeB = toRadians(to.lat)
  const value =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(lngDelta / 2) ** 2

  return 2 * earthRadius * Math.asin(Math.sqrt(value))
}

function getDominantSuitability(points: MapPoint[]): Suitability {
  const counts = points.reduce<Record<Suitability, number>>(
    (total, point) => ({ ...total, [point.suitability]: total[point.suitability] + 1 }),
    { high: 0, medium: 0, low: 0, none: 0 },
  )

  return (Object.entries(counts).sort(([, countA], [, countB]) => countB - countA)[0]?.[0] ??
    "none") as Suitability
}

function clusterPoints(points: MapPoint[], zoom: number): CropCluster[] {
  const radius = Math.max(12_000, 180_000 / Math.pow(2, zoom - 5))
  const processed = new Set<string>()
  const clusters: CropCluster[] = []

  for (const point of points) {
    if (processed.has(point.municipalityId)) continue

    const clusterPoints = [point]
    processed.add(point.municipalityId)

    for (const candidate of points) {
      if (processed.has(candidate.municipalityId)) continue
      if (haversineDistanceMeters(point, candidate) < radius) {
        clusterPoints.push(candidate)
        processed.add(candidate.municipalityId)
      }
    }

    clusters.push({
      id: clusterPoints.map(({ municipalityId }) => municipalityId).join("-"),
      longitude: clusterPoints.reduce((total, item) => total + item.lng, 0) / clusterPoints.length,
      latitude: clusterPoints.reduce((total, item) => total + item.lat, 0) / clusterPoints.length,
      points: clusterPoints,
      suitability: getDominantSuitability(clusterPoints),
    })
  }

  return clusters
}

function MapContent({
  points,
  selectedId,
  onSelect,
}: {
  points: MapPoint[]
  selectedId: string | null
  onSelect: (municipality: MapPoint) => void
}) {
  const { map } = useMap()
  const [clusters, setClusters] = useState<CropCluster[]>([])

  const updateClusters = useCallback(() => {
    if (!map) return
    setClusters(clusterPoints(points, map.getZoom()))
  }, [map, points])

  const applyVibrantPalette = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return

    const isDarkStyle = map.getStyle().name?.toLowerCase().includes("dark") ?? false
    const waterColor = isDarkStyle ? "#24586b" : "#67c7e0"
    const waterShadowColor = isDarkStyle ? "#1d4657" : "#a1dce8"
    const waterwayColor = isDarkStyle ? "#3d8298" : "#3aaecb"

    for (const layer of map.getStyle().layers) {
      if (layer.id === "water") {
        map.setPaintProperty(layer.id, "fill-color", waterColor)
      } else if (layer.id === "water_shadow") {
        map.setPaintProperty(layer.id, "fill-color", waterShadowColor)
      } else if (layer.id === "waterway") {
        map.setPaintProperty(layer.id, "line-color", waterwayColor)
      } else if (layer.id === "background") {
        map.setPaintProperty(layer.id, "background-color", isDarkStyle ? "#132229" : "#f8f8f3")
      }
    }
  }, [map])

  useEffect(() => {
    if (!map) return

    updateClusters()
    map.on("moveend", updateClusters)
    return () => {
      map.off("moveend", updateClusters)
    }
  }, [map, updateClusters])

  useEffect(() => {
    if (!map || points.length === 0) return

    map.fitBounds(MAP_CONTEXT_BOUNDS, { padding: 48, maxZoom: 2.5, duration: 0 })
  }, [map, points])

  useEffect(() => {
    if (!map) return

    if (map.isStyleLoaded()) {
      applyVibrantPalette()
      return
    }

    map.once("idle", applyVibrantPalette)
    return () => {
      map.off("idle", applyVibrantPalette)
    }
  }, [applyVibrantPalette, map])

  const handleClusterClick = (cluster: CropCluster) => {
    if (cluster.points.length === 1) {
      onSelect(cluster.points[0])
      return
    }

    const bounds = new MapLibreGL.LngLatBounds()
    cluster.points.forEach(({ lng, lat }) => bounds.extend([lng, lat]))
    map?.fitBounds(bounds, { padding: 72, maxZoom: 11, duration: 500 })
  }

  return (
    <>
      <MapControls position="bottom-right" showZoom />
      {clusters.map((cluster) => {
        const municipality = cluster.points[0]
        const isSingleMunicipality = cluster.points.length === 1
        const isSelected = isSingleMunicipality && selectedId === municipality.municipalityId
        const markerSize = isSingleMunicipality ? 38 : Math.min(52, 36 + Math.log2(cluster.points.length) * 4)

        return (
          <MapMarker
            key={cluster.id}
            longitude={cluster.longitude}
            latitude={cluster.latitude}
            onClick={() => handleClusterClick(cluster)}
          >
            <MarkerContent>
              <div className="relative">
                <div
                  className={`flex items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition-transform hover:scale-110 ${
                    isSelected ? "ring-4 ring-foreground/25" : ""
                  }`}
                  style={{
                    width: markerSize,
                    height: markerSize,
                    backgroundColor: mapSuitabilityColors[cluster.suitability],
                  }}
                >
                  <Sprout className="size-5" aria-hidden />
                </div>
                {!isSingleMunicipality && (
                  <span
                    className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center rounded-full border border-white px-1 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm"
                    style={{ backgroundColor: mapSuitabilityColors[cluster.suitability] }}
                    aria-label={`${cluster.points.length} municipios agrupados`}
                  >
                    {cluster.points.length}
                  </span>
                )}
              </div>
            </MarkerContent>
            <MarkerTooltip>
              {isSingleMunicipality
                ? `${municipality.municipalityName}, ${municipality.department}`
                : `${cluster.points.length} municipios agrupados`}
            </MarkerTooltip>
          </MapMarker>
        )
      })}
    </>
  )
}

export function CropNationwideMap({
  results,
  departmentsByMunicipality,
  selectedId,
  onSelect,
}: CropNationwideMapProps) {
  const points = useMemo(
    () =>
      results
        .filter(({ lat, lng }) => Number.isFinite(lat) && Number.isFinite(lng))
        .map((result) => ({
          ...result,
          department: departmentsByMunicipality[result.municipalityId] ?? "Colombia",
        })),
    [departmentsByMunicipality, results],
  )

  return (
    <Map
      bounds={MAP_CONTEXT_BOUNDS}
      fitBoundsOptions={{ padding: 48, maxZoom: 2.5 }}
      maxBounds={MAP_VIEW_BOUNDS}
      minZoom={2.2}
      maxZoom={12}
      styles={MAP_STYLES}
      scrollZoom
      className="h-full w-full"
      attributionControl={{ compact: true }}
    >
      <MapContent points={points} selectedId={selectedId} onSelect={onSelect} />
    </Map>
  )
}
