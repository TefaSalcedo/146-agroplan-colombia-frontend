"use client"

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
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

export function ZonificationMap({ cropId, activeLayers, selectedId, onSelect, municipalities, suitabilityMap = {} }: ZonificationMapProps) {
  return (
    <MapContainer
      center={[6.1, -75.4]}
      zoom={10}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#e8efe8" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {municipalities.map((m) => {
        const suit = (suitabilityMap[m.id] ?? "none") as Suitability
        if (!activeLayers[suit]) return null
        const isSelected = selectedId === m.id
        return (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={isSelected ? 16 : 12}
            pathOptions={{
              color: "#ffffff",
              weight: isSelected ? 3 : 2,
              fillColor: suitabilityColors[suit],
              fillOpacity: 0.85,
            }}
            eventHandlers={{ click: () => onSelect(m) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {m.name}
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
