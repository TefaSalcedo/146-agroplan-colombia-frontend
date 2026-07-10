"use client"

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map"
import { suitabilityColors } from "@/lib/mock-data"
import type { Municipality, Suitability } from "@/types"

interface ZonificationMapProps {
  cropId: string
  activeLayers: Record<Suitability, boolean>
  selectedId: string | null
  onSelect: (m: Municipality) => void
  municipalities: Municipality[]
  suitabilityMap?: Record<string, Suitability>
}

// Estilo vectorial tipo MapBox usando OpenFreeMap (gratuito, sin API key)
const mapStyles = {
  light: "https://tiles.openfreemap.org/styles/bright",
  dark: "https://tiles.openfreemap.org/styles/dark",
}

export function ZonificationMap({
  cropId,
  activeLayers,
  selectedId,
  onSelect,
  municipalities,
  suitabilityMap = {},
}: ZonificationMapProps) {
  return (
    <Map
      center={[-75.4, 6.1]}
      zoom={10}
      scrollZoom
      styles={mapStyles}
      className="h-full w-full"
      attributionControl={{ compact: true }}
    >
      <MapControls position="bottom-right" showZoom />
      {municipalities.map((m) => {
        const suit = (suitabilityMap[m.id] ?? "none") as Suitability
        if (!activeLayers[suit]) return null
        const isSelected = selectedId === m.id
        const size = isSelected ? 16 : 12
        return (
          <MapMarker
            key={m.id}
            longitude={m.lng}
            latitude={m.lat}
            onClick={() => onSelect(m)}
          >
            <MarkerContent>
              <div
                className="rounded-full border-2 border-white shadow-sm transition-all"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: suitabilityColors[suit],
                }}
              />
            </MarkerContent>
            <MarkerTooltip>{m.name}</MarkerTooltip>
          </MapMarker>
        )
      })}
    </Map>
  )
}
