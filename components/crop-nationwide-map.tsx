"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import MapLibreGL from "maplibre-gl"
import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip, useMap } from "@/components/ui/map"
import { cn } from "@/lib/utils"
import { suitabilityColors } from "@/lib/constants"
import type { Municipality, Suitability } from "@/types"

// Simple clustering implementation for Colombian municipalities
interface ClusterPoint {
  id: string
  longitude: number
  latitude: number
  suitability: Suitability
  municipality: Municipality
}

interface Cluster {
  id: string
  longitude: number
  latitude: number
  point_count: number
  point_count_abbreviated: string
  suitability: Suitability
  points: ClusterPoint[]
}

function haversineDistanceMeters(
  from: Pick<ClusterPoint, "longitude" | "latitude">,
  to: Pick<ClusterPoint, "longitude" | "latitude">
): number {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadius = 6371_000
  const latDelta = toRadians(to.latitude - from.latitude)
  const lngDelta = toRadians(to.longitude - from.longitude)
  const latA = toRadians(from.latitude)
  const latB = toRadians(to.latitude)
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(lngDelta / 2) ** 2
  return 2 * earthRadius * Math.asin(Math.sqrt(a))
}

function clusterPoints(points: ClusterPoint[], zoom: number): Cluster[] {
  const clusters: Cluster[] = []
  const clusterRadius = Math.max(12_000, 180_000 / Math.pow(2, zoom - 5))
  const processed = new Set<string>()
  
  points.forEach(point => {
    if (processed.has(point.id)) return
    
    const cluster: Cluster = {
      id: `cluster_${clusters.length}`,
      longitude: point.longitude,
      latitude: point.latitude,
      point_count: 1,
      point_count_abbreviated: '1',
      suitability: point.suitability,
      points: [point]
    }
    
    processed.add(point.id)
    
    // Find nearby points
    points.forEach(otherPoint => {
      if (processed.has(otherPoint.id)) return
      
      const distance = haversineDistanceMeters(point, otherPoint)
      
      if (distance < clusterRadius) {
        cluster.points.push(otherPoint)
        cluster.point_count++
        processed.add(otherPoint.id)
        
        // Update cluster center to be the average of all points
        cluster.longitude = cluster.points.reduce((sum, p) => sum + p.longitude, 0) / cluster.points.length
        cluster.latitude = cluster.points.reduce((sum, p) => sum + p.latitude, 0) / cluster.points.length
      }
    })
    
    cluster.point_count_abbreviated = cluster.point_count >= 1000 
      ? `${Math.round(cluster.point_count / 100) / 10}k`
      : cluster.point_count.toString()
    
    // Determine predominant suitability
    const suitabilityCounts = cluster.points.reduce((acc, p) => {
      acc[p.suitability] = (acc[p.suitability] || 0) + 1
      return acc
    }, {} as Record<Suitability, number>)
    
    cluster.suitability = Object.entries(suitabilityCounts).reduce((a, b) => 
      suitabilityCounts[a[0] as Suitability] > suitabilityCounts[b[0] as Suitability] ? a : b
    )[0] as Suitability
    
    clusters.push(cluster)
  })
  
  return clusters
}

interface CropNationwideMapProps {
  municipalities: Municipality[]
  suitabilityMap: Record<string, Suitability>
  selectedId: string | null
  onSelect: (municipality: Municipality) => void
  cropImage?: string
}

function MapContent({ 
  municipalities, 
  suitabilityMap, 
  selectedId, 
  onSelect,
  cropImage
}: CropNationwideMapProps) {
  const { map } = useMap()
  const [zoom, setZoom] = useState(5.5)
  const [clusters, setClusters] = useState<Cluster[]>([])

  // Convert municipalities to cluster points
  // We only include municipalities that have a suitability (i.e., not "none")
  // so we only paint the locations where it can be planted.
  const points = useMemo(
    () =>
      municipalities
        .filter((m) => suitabilityMap[m.id] && suitabilityMap[m.id] !== "none")
        .map((m) => ({
          id: m.id,
          longitude: m.lng,
          latitude: m.lat,
          suitability: suitabilityMap[m.id],
          municipality: m,
        })),
    [municipalities, suitabilityMap]
  )

  const updateClusters = useCallback(() => {
    if (!map) return
    const currentZoom = map.getZoom()
    setZoom(currentZoom)
    setClusters(clusterPoints(points, currentZoom))
  }, [map, points])

  useEffect(() => {
    if (!map) return

    // Initial clustering
    updateClusters()

    // Update clustering on zoom
    map.on("zoomend", updateClusters)
    map.on("moveend", updateClusters)

    return () => {
      map.off("zoomend", updateClusters)
      map.off("moveend", updateClusters)
    }
  }, [map, updateClusters])

  const handleClusterClick = (cluster: Cluster) => {
    if (!map) return
    
    if (cluster.point_count === 1) {
      // Single point - select the municipality
      onSelect(cluster.points[0].municipality)
    } else {
      // Multiple points - zoom to cluster bounds
      const bounds = new MapLibreGL.LngLatBounds()
      cluster.points.forEach(point => {
        bounds.extend([point.longitude, point.latitude])
      })
      map.fitBounds(bounds, { padding: 50, maxZoom: 12 })
    }
  }

  // Show individual markers at high zoom, clusters at low zoom
  const showClusters = zoom < 8
  const visibleItems = showClusters ? clusters : points

  return (
    <>
      <MapControls position="bottom-right" showZoom />
      
      {visibleItems.map((item) => {
        const isCluster = 'point_count' in item
        const point = isCluster ? item : item
        const isSelected = !isCluster && selectedId === point.id
        const suit = point.suitability
        const color = suitabilityColors[suit]
        
        if (isCluster) {
          const cluster = item as Cluster
          const baseSize = Math.max(20, Math.min(40, 15 + Math.log(cluster.point_count) * 3))
          const size = cropImage ? Math.max(baseSize, 36) : baseSize
          
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
                    className={cn(
                      "flex items-center justify-center rounded-full border-2 shadow-sm transition-all hover:scale-110 bg-cover bg-center",
                      "border-white/80"
                    )}
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: color,
                      backgroundImage: cropImage ? `url(${cropImage})` : undefined,
                    }}
                  >
                    {cropImage && (
                      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} />
                    )}
                    {!cropImage && (
                      <span className="text-xs font-bold text-white relative z-10">
                        {cluster.point_count_abbreviated}
                      </span>
                    )}
                  </div>
                  {cropImage && (
                    <div 
                      className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-white px-1 text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {cluster.point_count_abbreviated}
                    </div>
                  )}
                </div>
              </MarkerContent>
              <MarkerTooltip>
                {cluster.point_count} municipio{cluster.point_count !== 1 ? 's' : ''}
              </MarkerTooltip>
            </MapMarker>
          )
        } else {
          const markerSize = isSelected ? 14 : suit === "none" ? 5 : 9
          
          return (
            <MapMarker
              key={point.id}
              longitude={point.longitude}
              latitude={point.latitude}
              onClick={() => onSelect((point as ClusterPoint).municipality)}
            >
              <MarkerContent>
                <div
                  className={cn(
                    "rounded-full border-2 shadow-sm transition-all",
                    isSelected ? "border-foreground" : "border-white/80 hover:scale-125"
                  )}
                  style={{
                    width: markerSize,
                    height: markerSize,
                    backgroundColor: color,
                  }}
                />
              </MarkerContent>
              <MarkerTooltip>{(point as ClusterPoint).municipality.name}</MarkerTooltip>
            </MapMarker>
          )
        }
      })}
    </>
  )
}

export function CropNationwideMap({
  municipalities,
  suitabilityMap,
  selectedId,
  onSelect,
  cropImage
}: CropNationwideMapProps) {
  return (
    <Map
      center={[-74.297, 4.57]}
      zoom={5.5}
      scrollZoom
      className="h-full w-full"
      attributionControl={{ compact: true }}
    >
      <MapContent
        municipalities={municipalities}
        suitabilityMap={suitabilityMap}
        selectedId={selectedId}
        onSelect={onSelect}
        cropImage={cropImage}
      />
    </Map>
  )
}
