"use client"

"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MapPin, Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Municipality } from "@/types"

const LocationMap = dynamic(
  () => import("./location-map").then((m) => m.LocationMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  }
)

interface MapModalProps {
  municipalities: Municipality[]
  selected: Municipality | null
  onSelect: (municipality: Municipality) => void
  onConfirm: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MapModal({
  municipalities,
  selected,
  onSelect,
  onConfirm,
  open,
  onOpenChange,
}: MapModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="px-6 pt-6 text-left">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Selecciona tu ubicación en el mapa
          </DialogTitle>
          <DialogDescription>
            Acerca el mapa a tu municipio y toca el punto para seleccionarlo.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[50vh] min-h-[320px] px-6">
          <LocationMap
            municipalities={municipalities}
            selected={selected}
            onSelect={onSelect}
          />
        </div>

        {selected && (
          <div className="px-6 pb-2 text-sm text-foreground">
            <span className="font-semibold">Seleccionado:</span>{" "}
            {selected.name}, {selected.department}
          </div>
        )}

        <DialogFooter className="px-6 pb-6">
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            size="lg"
            className="w-full gap-2 rounded-xl"
          >
            <Check className="size-4" />
            Usar esta ubicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
