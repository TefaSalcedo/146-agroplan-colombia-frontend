"use client"

import { MapPin, Loader2, LocateOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GeoButtonProps {
  isLoading: boolean
  disabled?: boolean
  onClick: () => void
}

export function GeoButton({ isLoading, disabled, onClick }: GeoButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      size="lg"
      className="h-14 w-full gap-2 rounded-xl bg-primary text-base font-semibold shadow-lg hover:bg-primary/90"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          <span>Detectando tu ubicación...</span>
        </>
      ) : (
        <>
          <MapPin className="size-5" />
          <span>Usar mi ubicación actual</span>
        </>
      )}
    </Button>
  )
}

export function GeoNotSupportedButton() {
  return (
    <Button
      disabled
      size="lg"
      variant="outline"
      className="h-14 w-full gap-2 rounded-xl text-base"
    >
      <LocateOff className="size-5" />
      <span>Tu navegador no soporta geolocalización</span>
    </Button>
  )
}
