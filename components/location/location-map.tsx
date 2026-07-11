"use client"

import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map"
import { cn } from "@/lib/utils"
import type { Municipality } from "@/types"

interface LocationMapProps {
  municipalities: Municipality[]
  selected: Municipality | null
  onSelect: (municipality: Municipality) => void
}

export function LocationMap({
  municipalities,
  selected,
  onSelect,
}: LocationMapProps) {
  return (
    <Map
      center={[-74.297, 4.57]}
      zoom={5.5}
      scrollZoom
      className="h-full w-full rounded-xl border border-border"
      attributionControl={{ compact: true }}
    >
      <MapControls position="bottom-right" showZoom />
      {municipalities.map((m) => {
        const isSelected = selected?.id === m.id
        return (
          <MapMarker
            key={m.id}
            longitude={m.lng}
            latitude={m.lat}
            onClick={() => onSelect(m)}
          >
            <MarkerContent>
              <div
                className={cn(
                  "rounded-full border-2 shadow-sm transition-all",
                  isSelected
                    ? "size-5 border-primary bg-primary"
                    : "size-3 border-white bg-primary/80 hover:size-4 hover:bg-primary"
                )}
              />
            </MarkerContent>
            <MarkerTooltip>{m.name}</MarkerTooltip>
          </MapMarker>
        )
      })}
    </Map>
  )
}
